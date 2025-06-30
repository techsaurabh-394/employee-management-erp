import { sendGridEmail } from "../utils/sendGridEmail.js";

export const sendWelcomeEmail = async (to, name, password, isOrg = false) => {
  const subject = isOrg
    ? "Welcome to the Platform (Organization Admin)"
    : "Welcome to the Platform (Employee)";
  const html = `<p>Hello ${name},</p>
    <p>Your account has been created.</p>
    <p>Email: ${to}</p>
    <p>Password: ${password}</p>
    <p>Please log in and change your password after first login.</p>`;
  await sendGridEmail({ to, subject, html });
};
