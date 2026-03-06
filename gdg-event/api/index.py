from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import urllib.parse
import os

app = Flask(__name__)
# Allow React frontend to safely call this API
CORS(app) 

# ==========================================
# 🛑 VERCEL CONFIGURATION:
# Uses Environment Variables for security
# ==========================================
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "neotechsru@gmail.com")
SENDER_PASSWORD = os.environ.get("SENDER_PASSWORD", "wnuemwhukucdgaxz")

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

@app.route('/api/send-ticket', methods=['POST'])
@app.route('/send-ticket', methods=['POST'])
def send_ticket():
    data = request.json
    
    recipient_email = data.get('email')
    student_name = data.get('name')
    ticket_id = data.get('ticketId')
    qr_url = data.get('qrUrl')
    
    if not recipient_email or not ticket_id:
        return jsonify({"error": "Missing required details"}), 400

    subject = f"IWD 2026 Confirmation - {ticket_id}"
    
    # Use the full ticket URL for the QR code to match the digital pass
    qr_data = qr_url if qr_url else ticket_id
    encoded_qr_data = urllib.parse.quote_plus(qr_data)
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            .google-blue {{ color: #4285F4; }}
        </style>
    </head>
    <body style="margin: 0; padding: 40px 0; background-color: #f0f2f5; font-family: 'Segoe UI', Roboto, Arial, sans-serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #e8eaed;">
            <!-- Google Stripes -->
            <tr>
                <td>
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="height: 6px;">
                        <tr>
                            <td bgcolor="#4285F4" style="width: 25%;"></td>
                            <td bgcolor="#EA4335" style="width: 25%;"></td>
                            <td bgcolor="#FBBC05" style="width: 25%;"></td>
                            <td bgcolor="#34A853" style="width: 25%;"></td>
                        </tr>
                    </table>
                </td>
            </tr>

            <!-- Content Area -->
            <tr>
                <td style="padding: 30px;">
                    <!-- Top Section: Logo & ID -->
                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                            <td valign="top">
                                <img src="https://raw.githubusercontent.com/GhanshyamDewangan/GDG_Event/main/public/gdg_logo.png" alt="GDG Raipur" height="38" style="display: block; margin-bottom: 8px; filter: drop-shadow(0px 0px 1px #ffffff) drop-shadow(0px 0px 1px #ffffff);">
                                <div style="font-size: 11px; color: #5f6368; letter-spacing: 0.5px; font-weight: 600;">SRU Raipur | Neo Tech Club</div>
                            </td>
                            <td align="right" valign="top">
                                <div style="font-size: 10px; text-transform: uppercase; color: #5f6368; letter-spacing: 1px; margin-bottom: 2px;">ID Code</div>
                                <div style="font-size: 14px; font-weight: 700; font-family: 'Courier New', monospace; color: #202124;">{ticket_id}</div>
                            </td>
                        </tr>
                    </table>

                    <!-- Event Title -->
                    <div style="margin: 35px 0 30px 0;">
                        <h1 style="margin: 0; font-size: 38px; font-weight: 900; color: #202124; letter-spacing: -1.5px; line-height: 1.1;">IWD 2026</h1>
                        <div style="font-size: 13px; font-weight: 700; color: #4285F4; margin-top: 8px; text-transform: uppercase; letter-spacing: 1.5px;">International Women's Day</div>
                    </div>

                    <!-- Date & Time -->
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                        <tr>
                            <td width="50%">
                                <div style="font-size: 10px; text-transform: uppercase; color: #5f6368; letter-spacing: 1px; margin-bottom: 4px;">Date</div>
                                <div style="font-size: 15px; font-weight: 600; color: #202124;">March 7, 2026</div>
                            </td>
                            <td>
                                <div style="font-size: 10px; text-transform: uppercase; color: #5f6368; letter-spacing: 1px; margin-bottom: 4px;">Time</div>
                                <div style="font-size: 15px; font-weight: 600; color: #202124;">09:30 AM</div>
                            </td>
                        </tr>
                    </table>

                    <!-- Participant Card -->
                    <div style="background-color: #f8f9fa; border-radius: 16px; padding: 20px; margin-bottom: 25px;">
                        <div style="margin-bottom: 12px;">
                            <div style="font-size: 10px; text-transform: uppercase; color: #5f6368; letter-spacing: 1px; margin-bottom: 4px;">Participant</div>
                            <div style="font-size: 18px; font-weight: 700; color: #4285F4;">{student_name}</div>
                        </div>
                        <div style="font-size: 14px; color: #5f6368; line-height: 1.4;">
                            Ticket ID: <strong>{ticket_id}</strong>
                        </div>
                    </div>

                    <!-- Important Information Box -->
                    <div style="background-color: #fff9e6; border-left: 4px solid #FBBC05; border-radius: 8px; padding: 15px; margin-bottom: 30px;">
                        <div style="font-size: 12px; font-weight: 700; color: #9c6e00; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">⚠️ Important</div>
                        <div style="font-size: 14px; color: #664d00; line-height: 1.5;">
                            Carry your <b>College ID</b> and <b>Laptop</b> for the event.
                        </div>
                    </div>

                    <!-- Perforation -->
                    <div style="border-top: 2px dashed #e8eaed; margin: 0 -30px 30px -30px;"></div>

                    <!-- QR Code Section -->
                    <div style="text-align: center; padding-bottom: 10px;">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data={encoded_qr_data}" alt="QR Entry" style="border: 1px solid #e8eaed; padding: 10px; border-radius: 12px; background: white;">
                        <div style="margin-top: 15px; font-size: 12px; color: #5f6368; font-weight: 500;">Please show this QR at the venue entrance</div>
                    </div>
                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td bgcolor="#f8f9fa" style="padding: 15px 30px; border-top: 1px solid #f1f3f4; text-align: center;">
                    <div style="font-size: 13px; font-weight: 600; color: #202124;">
                        📍 Venue: SRU Campus, Raipur
                    </div>
                    <div style="display: inline-block; width: 60px; height: 3px; background-color: #4285F4; border-radius: 2px; margin-top: 10px;"></div>
                </td>
            </tr>
        </table>
        
        <div style="text-align: center; margin-top: 25px; font-size: 12px; color: #5f6368; padding: 0 20px;">
            © 2026 Google Developer Group Raipur X SRU Raipur X Neo Tech Club Collaboration.<br>
        </div>
    </body>
    </html>
    """
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = f"Neo Tech Club SRU <{SENDER_EMAIL}>"
    msg['To'] = recipient_email
    msg.attach(MIMEText(html_content, 'html'))
    
    try:
        # Use Port 465 with SMTP_SSL for better reliability in modern environments
        print(f"Connecting to SMTP SSL server {SMTP_SERVER}:465...")
        server = smtplib.SMTP_SSL(SMTP_SERVER, 465, timeout=15)
        print("Logging in...")
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        print("Sending email...")
        server.sendmail(SENDER_EMAIL, recipient_email, msg.as_string())
        server.quit()
        print(f"SUCCESS: Email sent to {recipient_email}")
        return jsonify({"message": "Email sent successfully"}), 200
    except Exception as e:
        print(f"CRITICAL SMTP ERROR: {str(e)}")
        # Try fallback to 587 if 465 fails
        try:
            print("Trying fallback to Port 587...")
            server = smtplib.SMTP(SMTP_SERVER, 587, timeout=15)
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, recipient_email, msg.as_string())
            server.quit()
            return jsonify({"message": "Email sent via fallback"}), 200
        except Exception as fallback_e:
            print(f"FALLBACK ALSO FAILED: {str(fallback_e)}")
            return jsonify({"error": f"SMTP Error: {str(e)} | Fallback Error: {str(fallback_e)}"}), 500

# Vercel needs the app object
if __name__ == '__main__':
    app.run()
