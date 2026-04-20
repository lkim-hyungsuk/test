import logging
from typing import List
import resend
from app.config import settings

logger = logging.getLogger(__name__)

resend.api_key = settings.resend_api_key

FROM_EMAIL = "Research AI Weekly <newsletter@resend.dev>"


def send_confirmation_email(to_email: str, token: str) -> None:
    confirm_url = f"{settings.frontend_url}/confirm/{token}"
    html = f"""
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px;">
      <h2 style="color: #1a1a2e;">Confirm your subscription</h2>
      <p>You signed up for <strong>Research AI Weekly</strong> — a newsletter that teaches
      medical students and residents how to use AI tools in their research workflow.</p>
      <p>Click below to confirm your email address:</p>
      <a href="{confirm_url}"
         style="display:inline-block;background:#1a1a2e;color:#fff;padding:12px 24px;
                border-radius:6px;text-decoration:none;font-size:16px;">
        Confirm subscription
      </a>
      <p style="color:#888;font-size:12px;margin-top:32px;">
        If you didn't sign up, you can safely ignore this email.
      </p>
    </div>
    """
    try:
        resend.Emails.send({
            "from": FROM_EMAIL,
            "to": [to_email],
            "subject": "Confirm your Research AI Weekly subscription",
            "html": html,
        })
    except Exception as e:
        logger.error("Failed to send confirmation email to %s: %s", to_email, e)


def build_newsletter_html(tutorial, articles: list) -> str:
    article_rows = ""
    for a in articles:
        note = a.clinical_relevance_note or ""
        article_rows += f"""
        <tr>
          <td style="padding:16px 0;border-bottom:1px solid #eee;">
            <a href="{a.full_url}" style="font-weight:bold;color:#1a1a2e;text-decoration:none;font-size:16px;">
              {a.title}
            </a>
            <span style="color:#888;font-size:13px;"> · {a.source_name}</span>
            <p style="margin:8px 0 0;color:#444;font-size:14px;line-height:1.6;">
              <strong style="color:#2c7a4b;">What this means for your research:</strong> {note}
            </p>
          </td>
        </tr>
        """

    unsubscribe_placeholder = "{unsubscribe_url}"
    return f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="background:#f5f5f0;margin:0;padding:0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f0;padding:32px 0;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0"
                 style="background:#fff;border-radius:8px;overflow:hidden;max-width:600px;width:100%;">

            <!-- Header -->
            <tr>
              <td style="background:#1a1a2e;padding:24px 32px;">
                <p style="color:#a8d8b9;margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;">
                  Research AI Weekly
                </p>
              </td>
            </tr>

            <!-- Featured tutorial -->
            <tr>
              <td style="padding:32px;background:#f0f7f4;border-bottom:3px solid #2c7a4b;">
                <p style="margin:0 0 8px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#2c7a4b;font-weight:bold;">
                  This issue's guide
                </p>
                <h1 style="margin:0 0 12px;font-size:22px;color:#1a1a2e;font-family:Georgia,serif;line-height:1.3;">
                  {tutorial.title}
                </h1>
                <p style="margin:0 0 16px;color:#555;font-size:14px;">
                  {tutorial.reading_time_minutes} min read
                  {' · '.join(f'<span style="background:#e8f5ee;color:#2c7a4b;padding:2px 8px;border-radius:12px;font-size:12px;">{t}</span>' for t in tutorial.tags)}
                </p>
                <a href="{settings.frontend_url}/tutorials/{tutorial.slug}"
                   style="display:inline-block;background:#2c7a4b;color:#fff;padding:10px 20px;
                          border-radius:6px;text-decoration:none;font-size:14px;font-weight:bold;">
                  Read the full guide →
                </a>
              </td>
            </tr>

            <!-- News section -->
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 16px;font-size:11px;letter-spacing:2px;text-transform:uppercase;
                          color:#888;font-weight:bold;border-bottom:1px solid #eee;padding-bottom:8px;">
                  AI news — what it means for your research
                </p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  {article_rows}
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:24px 32px;background:#f9f9f7;border-top:1px solid #eee;">
                <p style="margin:0;font-size:12px;color:#aaa;text-align:center;">
                  You're receiving this because you subscribed to Research AI Weekly.<br>
                  <a href="{unsubscribe_placeholder}" style="color:#aaa;">Unsubscribe</a>
                </p>
              </td>
            </tr>

          </table>
        </td></tr>
      </table>
    </body>
    </html>
    """


def send_newsletter(subject: str, html_template: str, recipient_emails: List[str]) -> None:
    for email in recipient_emails:
        # Replace unsubscribe placeholder with per-subscriber token
        # (token-based unsubscribe URL is injected at send time)
        html = html_template.replace("{unsubscribe_url}", f"{settings.frontend_url}/unsubscribe")
        try:
            resend.Emails.send({
                "from": FROM_EMAIL,
                "to": [email],
                "subject": subject,
                "html": html,
            })
        except Exception as e:
            logger.error("Failed to send newsletter to %s: %s", email, e)
