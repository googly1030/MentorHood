import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Optional
import os
from dotenv import load_dotenv

load_dotenv()

class EmailSender:
    def __init__(self):
        self.email = os.getenv("EMAIL_USER")
        self.password = os.getenv("EMAIL_APP_PASSWORD")
        self.smtp_server = "smtp.gmail.com"
        self.smtp_port = 587

    def send_email(
        self,
        to_email: str,
        subject: str,
        body: str,
        cc: Optional[List[str]] = None,
        bcc: Optional[List[str]] = None
    ) -> bool:
        try:
            # Create message
            msg = MIMEMultipart()
            msg['From'] = self.email
            msg['To'] = to_email
            msg['Subject'] = subject

            # Add CC if provided
            if cc:
                msg['Cc'] = ', '.join(cc)

            # Add body
            msg.attach(MIMEText(body, 'html'))

            # Create SMTP session
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.email, self.password)

                # Prepare recipients
                recipients = [to_email]
                if cc:
                    recipients.extend(cc)
                if bcc:
                    recipients.extend(bcc)

                # Send email
                server.sendmail(self.email, recipients, msg.as_string())
                return True

        except Exception as e:
            print(f"Error sending email: {str(e)}")
            return False

    def send_welcome_email(self, to_email: str, username: str) -> bool:
        subject = "Welcome to MentorHood!"
        body = f"""
        <html>
            <body>
                <h2>Welcome to MentorHood, {username}!</h2>
                <p>Thank you for joining our community. We're excited to have you on board!</p>
                <p>Best regards,<br>The MentorHood Team</p>
            </body>
        </html>
        """
        return self.send_email(to_email, subject, body)

    def send_password_reset_email(self, to_email: str, reset_token: str) -> bool:
        subject = "Password Reset Request"
        reset_link = f"http://localhost:5173/reset-password?token={reset_token}"
        body = f"""
        <html>
            <body>
                <h2>Password Reset Request</h2>
                <p>You have requested to reset your password. Click the link below to proceed:</p>
                <p><a href="{reset_link}">Reset Password</a></p>
                <p>If you didn't request this, please ignore this email.</p>
                <p>Best regards,<br>The MentorHood Team</p>
            </body>
        </html>
        """
        return self.send_email(to_email, subject, body)

# Create a singleton instance
email_sender = EmailSender() 