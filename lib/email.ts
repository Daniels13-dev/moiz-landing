"use server";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not defined");
    return { success: false, error: "Configuration error" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Möiz Pets <onboarding@resend.dev>", // Usar onboarding para pruebas hasta verificar dominio
        to: [to],
        subject,
        html,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, id: data.id };
    } else {
      console.error("Resend API error:", data);
      return { success: false, error: data.message };
    }
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: "Internal server error" };
  }
}
