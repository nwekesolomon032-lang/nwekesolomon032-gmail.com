export interface EmailConfigStatus {
  configured: boolean;
  provider: 'resend' | 'webhook' | 'none';
  details: string;
}

export function getEmailConfigStatus(): EmailConfigStatus {
  const resendKey = process.env.RESEND_API_KEY?.trim();
  const webhookUrl = process.env.ENQUIRY_WEBHOOK_URL?.trim();

  if (resendKey) {
    return {
      configured: true,
      provider: 'resend',
      details: 'Resend API key detected (RESEND_API_KEY).',
    };
  }
  if (webhookUrl) {
    return {
      configured: true,
      provider: 'webhook',
      details: 'Notification webhook detected (ENQUIRY_WEBHOOK_URL).',
    };
  }
  return {
    configured: false,
    provider: 'none',
    details:
      'No email or webhook provider configured. Set RESEND_API_KEY (and RESEND_FROM_EMAIL) or ENQUIRY_WEBHOOK_URL in environment variables to enable automated client notifications.',
  };
}

export async function sendClientDecisionEmail(params: {
  to: string;
  clientName: string;
  referenceNumber: string;
  decision: 'Accepted' | 'Rejected';
  service: string;
  customMessage?: string;
}): Promise<{sent: boolean; provider: string; error?: string}> {
  const status = getEmailConfigStatus();
  if (!status.configured) {
    return {
      sent: false,
      provider: 'none',
      error: status.details,
    };
  }

  const subject =
    params.decision === 'Accepted'
      ? `SOLMONIX STUDIO — Project Application Accepted (${params.referenceNumber})`
      : `SOLMONIX STUDIO — Update on Your Project Application (${params.referenceNumber})`;

  const defaultBody =
    params.decision === 'Accepted'
      ? `Hello ${params.clientName},\n\nWe are pleased to share that your project application (${params.referenceNumber}) for ${params.service} has been accepted by SOLMONIX STUDIO.\n\nOur team will follow up shortly with onboarding steps and a kickoff schedule.\n\nWarm regards,\nSOLMONIX STUDIO`
      : `Hello ${params.clientName},\n\nThank you for submitting your project application (${params.referenceNumber}) to SOLMONIX STUDIO.\n\nAfter careful review, we are unable to take on this engagement at the moment. We appreciate your interest and wish you every success with your initiative.\n\nWarm regards,\nSOLMONIX STUDIO`;

  const bodyText = params.customMessage?.trim() || defaultBody;

  if (status.provider === 'resend') {
    const apiKey = process.env.RESEND_API_KEY!.trim();
    const fromEmail =
      process.env.RESEND_FROM_EMAIL?.trim() || 'SOLMONIX STUDIO <onboarding@resend.dev>';

    try {
      const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [params.to],
          subject,
          text: bodyText,
        }),
      });

      if (!resp.ok) {
        const errText = await resp.text();
        return {
          sent: false,
          provider: 'resend',
          error: `Resend API error (${resp.status}): ${errText.slice(0, 200)}`,
        };
      }
      return {sent: true, provider: 'resend'};
    } catch (err) {
      return {
        sent: false,
        provider: 'resend',
        error: err instanceof Error ? err.message : 'Network error sending email via Resend.',
      };
    }
  }

  // Webhook fallback
  try {
    const webhookUrl = process.env.ENQUIRY_WEBHOOK_URL!.trim();
    const resp = await fetch(webhookUrl, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Accept: 'application/json'},
      body: JSON.stringify({
        event: 'application_decision_notification',
        to: params.to,
        subject,
        message: bodyText,
        referenceNumber: params.referenceNumber,
        decision: params.decision,
      }),
    });
    if (!resp.ok) {
      return {
        sent: false,
        provider: 'webhook',
        error: `Webhook returned HTTP ${resp.status}.`,
      };
    }
    return {sent: true, provider: 'webhook'};
  } catch (err) {
    return {
      sent: false,
      provider: 'webhook',
      error: err instanceof Error ? err.message : 'Network error calling notification webhook.',
    };
  }
}
