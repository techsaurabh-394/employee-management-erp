import sgMail from "@sendgrid/mail";

export const sendGridEmail = async ({ to, subject, html }) => {
  if (
    !process.env.SENDGRID_API_KEY ||
    !process.env.SENDGRID_API_KEY.startsWith("SG.")
  ) {
    console.error("SendGrid API key is missing or invalid.");
    throw new Error("SendGrid API key is missing or invalid.");
  }
  if (!process.env.EMAIL_USER) {
    console.error("SendGrid sender email (EMAIL_USER) is missing.");
    throw new Error("SendGrid sender email (EMAIL_USER) is missing.");
  }
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to,
    from: process.env.EMAIL_USER, // Must be verified with SendGrid
    subject,
    html,
  };
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error("SendGrid email error:", error);
    throw new Error("SendGrid email could not be sent");
  }
};
