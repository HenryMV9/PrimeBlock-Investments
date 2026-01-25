import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface DepositNotification {
  userId: string;
  amount: number;
  paymentMethod: string;
  referenceNumber?: string;
  notes?: string;
}

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPPORT_EMAIL = "support@primeblockinvestment.org";

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

    const { userId, amount, paymentMethod, referenceNumber, notes }: DepositNotification = await req.json();

    if (!userId || !amount || !paymentMethod) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: user, error: userError } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", userId)
      .maybeSingle();

    if (userError || !user) {
      console.error("Error fetching user:", userError);
      return new Response(
        JSON.stringify({ error: "User not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const paymentMethodMap: Record<string, string> = {
      bank_transfer: "Bank Transfer",
      wire_transfer: "Wire Transfer",
      crypto: "Cryptocurrency",
    };

    const emailSubject = `[Prime Blocks] New Deposit Request - ${user.full_name} - $${amount.toFixed(2)}`;
    const emailBody = `
      <h2>New Deposit Request Submitted</h2>
      <p><strong>User:</strong> ${user.full_name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>User ID:</strong> ${userId}</p>
      <p><strong>Amount:</strong> $${amount.toFixed(2)} USD</p>
      <p><strong>Payment Method:</strong> ${paymentMethodMap[paymentMethod] || paymentMethod}</p>
      ${referenceNumber ? `<p><strong>Reference Number:</strong> ${referenceNumber}</p>` : ""}
      ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ""}
      <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      <hr>
      <p>Please review and process this deposit request in the admin panel.</p>
    `;

    if (!RESEND_API_KEY) {
      console.log("RESEND_API_KEY not configured - skipping email");
      return new Response(
        JSON.stringify({
          success: true,
          message: "Notification queued (API key not configured in demo)"
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Prime Blocks Investments <noreply@primeblockinvestment.org>",
        to: [SUPPORT_EMAIL],
        reply_to: user.email,
        subject: emailSubject,
        html: emailBody,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text();
      console.error("Resend API error:", errorData);
      throw new Error("Failed to send email");
    }

    return new Response(
      JSON.stringify({ success: true, message: "Notification sent successfully" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending deposit notification:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send notification" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
