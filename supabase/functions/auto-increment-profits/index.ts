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
  skipped: number;
}

function getRandomProfitByPlan(plan: string): number {
  const baseMin = 1;
  const baseMax = 10;

  switch (plan) {
    case "starter":
      return baseMin + Math.random() * 2;
    case "smart":
      return baseMin + 1 + Math.random() * 3;
    case "wealth":
      return baseMin + 2 + Math.random() * 5;
    case "elite":
      return baseMin + 4 + Math.random() * 5;
    default:
      return baseMin + Math.random() * (baseMax - baseMin);
  }
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

    const { data: users, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .gt("total_deposits", 0);

    if (fetchError) {
      throw fetchError;
    }

    if (!users || users.length === 0) {
      return new Response(
        JSON.stringify({
          message: "No eligible users found",
          processed: 0,
          skipped: 0,
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
      skipped: 0,
    };

    for (const user of users) {
      try {
        const lastIncrement = user.last_profit_increment
          ? new Date(user.last_profit_increment)
          : null;

        if (lastIncrement) {
          const hoursSinceLastIncrement =
            (now.getTime() - lastIncrement.getTime()) / (1000 * 60 * 60);
          if (hoursSinceLastIncrement < 24) {
            result.skipped++;
            continue;
          }
        }

        const plan = user.investment_plan || "starter";
        const profitAmount = getRandomProfitByPlan(plan);
        const roundedProfit = Math.round(profitAmount * 100) / 100;

        const newBalance = parseFloat(user.balance) + roundedProfit;
        const newTotalProfits = parseFloat(user.total_profits) + roundedProfit;

        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            balance: newBalance,
            total_profits: newTotalProfits,
            last_profit_increment: now.toISOString(),
          })
          .eq("id", user.id);

        if (updateError) {
          throw updateError;
        }

        const { error: transactionError } = await supabase.from("transactions").insert({
          user_id: user.id,
          type: "profit_credit",
          amount: roundedProfit,
          status: "approved",
          description: `Daily Profit (${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan)`,
          processed_at: now.toISOString(),
        });

        if (transactionError) {
          throw transactionError;
        }

        result.processed++;
        result.totalProfit += roundedProfit;
      } catch (error) {
        console.error(`Error processing user ${user.id}:`, error);
        result.errors++;
      }
    }

    return new Response(
      JSON.stringify({
        message: "Daily profit distribution completed",
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
