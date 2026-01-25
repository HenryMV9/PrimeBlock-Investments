import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactRequest {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPPORT_EMAIL = "support@primeblockinvestment.org";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { fullName, email, subject, message }: ContactRequest = await req.json();

    if (!fullName || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const subjectMap: Record<string, string> = {
      general: "General Inquiry",
      complaint: "Complaint",
      account: "Account Issue",
      withdrawal: "Withdrawal Issue",
      deposit: "Deposit Issue",
    };

    let emailSent = false;
    let emailError: string | null = null;

    if (RESEND_API_KEY) {
      try {
        const escapedFullName = escapeHtml(fullName);
        const escapedEmail = escapeHtml(email);
        const escapedSubject = escapeHtml(subjectMap[subject] || subject);
        const escapedMessage = escapeHtml(message).replace(/\n/g, "<br>");

        const emailSubject = `[Prime Blocks] ${subjectMap[subject] || "Contact Form"} - ${fullName}`;
        const emailBody = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #1e293b; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
              .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
              .field { margin-bottom: 15px; }
              .label { font-weight: bold; color: #475569; }
              .message-box { background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-top: 15px; }
              .footer { text-align: center; padding: 15px; color: #64748b; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="margin: 0;">New Contact Form Submission</h2>
              </div>
              <div class="content">
                <div class="field">
                  <span class="label">From:</span> ${escapedFullName}
                </div>
                <div class="field">
                  <span class="label">Email:</span> <a href="mailto:${escapedEmail}">${escapedEmail}</a>
                </div>
                <div class="field">
                  <span class="label">Subject:</span> ${escapedSubject}
                </div>
                <div class="field">
                  <span class="label">Submitted:</span> ${new Date().toLocaleString()}
                </div>
                <div class="message-box">
                  <span class="label">Message:</span>
                  <p>${escapedMessage}</p>
                </div>
              </div>
              <div class="footer">
                Prime Blocks Investments - Contact Form Notification
              </div>
            </div>
          </body>
          </html>
        `;

        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Prime Blocks <onboarding@resend.dev>",
            to: [SUPPORT_EMAIL],
            reply_to: email,
            subject: emailSubject,
            html: emailBody,
          }),
        });

        if (resendResponse.ok) {
          emailSent = true;
          console.log("Email sent successfully via Resend");
        } else {
          const errorData = await resendResponse.text();
          emailError = `Resend API error: ${errorData}`;
          console.error(emailError);
        }
      } catch (err) {
        emailError = `Email sending error: ${err}`;
        console.error(emailError);
      }
    } else {
      console.log("RESEND_API_KEY not configured, skipping email send");
    }

    const { error: dbError } = await supabase
      .from("contact_messages")
      .insert({
        full_name: fullName,
        email: email,
        subject: subject,
        message: message,
        email_sent: emailSent,
      });

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to save message. Please try again." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Your message has been received. We will get back to you shortly.",
        emailSent: emailSent,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process your request. Please try again." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
