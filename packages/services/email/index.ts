import nodemailer from "nodemailer";
import { logger } from "@repo/logger";
import { env } from "../env";

type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

function isConfigured() {
  return Boolean(env.SMTP_HOST && env.SMTP_PORT && env.SMTP_FROM);
}

function createTransport() {
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE ?? env.SMTP_PORT === 465,
    auth:
      env.SMTP_USER && env.SMTP_PASS
        ? {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS,
          }
        : undefined,
  });
}

export async function sendEmail({ to, subject, text, html }: SendEmailInput) {
  if (!isConfigured()) {
    logger.debug("Skipping email because SMTP is not configured", { to, subject });
    return;
  }

  try {
    const transport = createTransport();
    await transport.sendMail({
      from: env.SMTP_FROM,
      to,
      subject,
      text,
      html,
    });
  } catch (err) {
    logger.error("Failed to send email", { err, to, subject });
  }
}
