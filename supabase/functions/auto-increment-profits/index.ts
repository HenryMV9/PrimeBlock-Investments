import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ProfitIncrementResult {
  processed: number;
  errors: number;
  totalProfit: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: settings } = await supabase
      .from("admin_settings")
      .select("*");

    const settingsMap: Record<string, string> = {};
    settings?.forEach((s) => {
      settingsMap[s.setting_key] = s.setting_value;
    });

    const autoProfitEnabled = settingsMap["auto_profit_enabled"] === "true";
    if (!autoProfitEnabled) {
      return new Response(
        JSON.stringify({
          message: "Auto-profit is globally disabled",
          processed: 0,
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const starterRate = parseFloat(settingsMap["starter_increment_rate"] || "1.0");
    const smartRate = parseFloat(settingsMap["smart_increment_rate"] || "5.0");
    const wealthRate = parseFloat(settingsMap["wealth_increment_rate"] || "15.0");
    const eliteRate = parseFloat(settingsMap["elite_increment_rate"] || "50.0");
    const maxDailyCap = parseFloat(settingsMap["max_daily_profit_cap"] || "10000");
    const intervalHours = parseFloat(settingsMap["increment_interval_hours"] || "24");

    const { data: users } = await supabase
      .from("profiles")
      .select("*")
      .eq("auto_profit_enabled", true)
      .gt("total_deposits", 0);

    if (!users || users.length === 0) {
      return new Response(
        JSON.stringify({
          message: "No eligible users found",
          processed: 0,
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const now = new Date();
    const result: ProfitIncrementResult = {
      processed: 0,
      errors: 0,
      totalProfit: 0,
    };

    for (const user of users) {
      try {
        const lastIncrement = user.last_profit_increment
          ? new Date(user.last_profit_increment)
          : null;

        if (lastIncrement) {
          const hoursSinceLastIncrement =
            (now.getTime() - lastIncrement.getTime()) / (1000 * 60 * 60);
          if (hoursSinceLastIncrement < intervalHours) {
            continue;
          }
        }

        if (user.daily_profit_total >= maxDailyCap) {
          continue;
        }

        let incrementAmount = 0;
        const plan = user.investment_plan || "starter";

        switch (plan) {
          case "starter":
            incrementAmount = starterRate;
            break;
          case "smart":
            incrementAmount = smartRate;
            break;
          case "wealth":
            incrementAmount = wealthRate;
            break;
          case "elite":
            incrementAmount = eliteRate;
            break;
          default:
            incrementAmount = starterRate;
        }

        const balanceFactor = Math.min(user.balance / 1000, 5);
        incrementAmount *= (1 + balanceFactor * 0.1);

        const remainingCap = maxDailyCap - user.daily_profit_total;
        incrementAmount = Math.min(incrementAmount, remainingCap);

        if (incrementAmount <= 0) {
          continue;
        }

        const newBalance = parseFloat(user.balance) + incrementAmount;
        const newTotalProfits = parseFloat(user.total_profits) + incrementAmount;
        const newDailyTotal = parseFloat(user.daily_profit_total) + incrementAmount;

        await supabase
          .from("profiles")
          .update({
            balance: newBalance,
            total_profits: newTotalProfits,
            daily_profit_total: newDailyTotal,
            last_profit_increment: now.toISOString(),
          })
          .eq("id", user.id);

        await supabase.from("transactions").insert({
          user_id: user.id,
          type: "profit_credit",
          amount: incrementAmount,
          status: "approved",
          description: `System-Generated Earnings (${plan})`,
          processed_at: now.toISOString(),
        });

        await supabase.from("profit_history").insert({
          user_id: user.id,
          amount: incrementAmount,
          plan_name: plan,
          increment_type: "automatic",
        });

        result.processed++;
        result.totalProfit += incrementAmount;
      } catch (error) {
        console.error(`Error processing user ${user.id}:`, error);
        result.errors++;
      }
    }

    return new Response(
      JSON.stringify({
        message: "Profit increment completed",
        ...result,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
