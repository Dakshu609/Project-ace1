"use server";

import { sendEmail, EMAIL_CONFIG } from "@/server/config/email";

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(to: string, name: string, role: string) {
  const subject = `Welcome to ${EMAIL_CONFIG.appName}!`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>Welcome to Project Ace, ${name}!</h1>
      <p>You've successfully joined as a <strong>${role}</strong>.</p>
      <p>Get started:</p>
      <ul>
        ${
          role === "client"
            ? `
          <li>Post your first job</li>
          <li>Browse verified freelancers</li>
          <li>Set up secure payments</li>
        `
            : `
          <li>Complete your profile</li>
          <li>Add portfolio items</li>
          <li>Start bidding on projects</li>
        `
        }
      </ul>
      <a href="${EMAIL_CONFIG.appUrl}/dashboard" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin-top: 16px;">
        Go to Dashboard
      </a>
      <p style="margin-top: 32px; color: #6b7280; font-size: 14px;">
        Need help? Reply to this email or visit our support center.
      </p>
    </div>
  `;

  return await sendEmail({ to, subject, html });
}

/**
 * Send notification when a new message is received
 */
export async function sendNewMessageNotification(
  to: string,
  senderName: string,
  messagePreview: string
) {
  const subject = `New message from ${senderName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>You have a new message from ${senderName}</h2>
      <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p style="margin: 0;">${messagePreview.substring(0, 150)}${messagePreview.length > 150 ? "..." : ""}</p>
      </div>
      <a href="${EMAIL_CONFIG.appUrl}/messages" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px;">
        View Message
      </a>
    </div>
  `;

  return await sendEmail({ to, subject, html });
}

/**
 * Send notification when a proposal is accepted
 */
export async function sendProposalAcceptedEmail(
  to: string,
  freelancerName: string,
  jobTitle: string,
  amount: number
) {
  const subject = `Your proposal was accepted!`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>🎉 Congratulations!</h2>
      <p>Your proposal for <strong>${jobTitle}</strong> has been accepted.</p>
      <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p style="margin: 0;"><strong>Project:</strong> ${jobTitle}</p>
        <p style="margin: 8px 0 0;"><strong>Amount:</strong> $${amount.toFixed(2)}</p>
      </div>
      <p>Next steps:</p>
      <ol>
        <li>Review the contract details</li>
        <li>Start working on the project</li>
        <li>Communicate with the client</li>
      </ol>
      <a href="${EMAIL_CONFIG.appUrl}/dashboard/freelancer" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px;">
        View Contract
      </a>
    </div>
  `;

  return await sendEmail({ to, subject, html });
}

/**
 * Send notification when payment is released
 */
export async function sendPaymentReleasedEmail(
  to: string,
  projectTitle: string,
  amount: number
) {
  const subject = `Payment released for ${projectTitle}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>💰 Payment Released!</h2>
      <p>Great news! Your payment for <strong>${projectTitle}</strong> has been released.</p>
      <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p style="margin: 0;"><strong>Amount:</strong> $${amount.toFixed(2)}</p>
        <p style="margin: 8px 0 0; color: #6b7280; font-size: 14px;">Funds will arrive in 2-5 business days</p>
      </div>
      <a href="${EMAIL_CONFIG.appUrl}/dashboard/freelancer" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px;">
        View Earnings
      </a>
    </div>
  `;

  return await sendEmail({ to, subject, html });
}
