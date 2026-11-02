import { Resend } from "resend";

type VerificationEmail = {
  email: string;
  fullName: string;
  token: string;
};

export async function sendCustomerVerificationEmail({
  email,
  fullName,
  token,
}: VerificationEmail): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const baseUrl = process.env.NEXTAUTH_URL;

  if (!apiKey || !from || !baseUrl) {
    throw new Error("Email verification configuration is incomplete.");
  }

  const verificationUrl = new URL(
    "/account/verify-email",
    baseUrl
  );
  verificationUrl.searchParams.set("token", token);

  const safeName = fullName
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to: email,
    subject: "Verify your Ultimate Collections email",
    html: `
      <h2>Welcome to Ultimate Collections!</h2>
      <p>Hello ${safeName},</p>
      <p>Please verify your email address to activate your account.</p>
      <p><a href="${verificationUrl.toString()}">Verify Email Address</a></p>
      <p>This link expires in 24 hours.</p>
      <p>If you did not create this account, ignore this email.</p>
    `,
  });

  if (error) {
    throw new Error("Verification email delivery failed.");
  }
}
