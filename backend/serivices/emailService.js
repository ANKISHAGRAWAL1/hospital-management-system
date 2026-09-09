 
require("dotenv").config();

const nodemailer = require("nodemailer");

console.log("MAIL_USER loaded:", !!process.env.MAIL_USER);
console.log("MAIL_PASS loaded:", !!process.env.MAIL_PASS);

// ==========================================
// NODEMAILER TRANSPORTER
// ==========================================

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// ==========================================
// GENERATE OTP
// ==========================================

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ==========================================
// SEND OTP EMAIL
// ==========================================

const sendOtpEmail = async (email) => {
  try {
    const otp = generateOtp();

    const info = await transporter.sendMail({
      from: `"Yash Hospital | Account Verification" <${process.env.MAIL_USER}>`,

      to: email,

      subject: "Yash Hospital - Verification Code",

      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Yash Hospital Verification</title>
        </head>

        <body style="
          margin: 0;
          padding: 0;
          background: #f4f7f6;
          font-family: Arial, Helvetica, sans-serif;
        ">

          <div style="
            max-width: 520px;
            margin: 35px auto;
            background: #ffffff;
            border: 1px solid #e2e8e5;
            border-radius: 12px;
            overflow: hidden;
          ">

            <!-- HEADER -->
            <div style="
              background: #0f3d35;
              padding: 25px;
              text-align: center;
              color: #ffffff;
            ">

              <h1 style="
                margin: 0;
                font-size: 25px;
              ">
                Yash Hospital
              </h1>

              <p style="
                margin: 8px 0 0;
                color: #c8ded9;
                font-size: 13px;
              ">
                Secure Healthcare Portal
              </p>

            </div>

            <!-- CONTENT -->
            <div style="padding: 30px;">

              <h2 style="
                margin-top: 0;
                color: #17211b;
                font-size: 20px;
              ">
                Verify Your Account
              </h2>

              <p style="
                color: #46534b;
                line-height: 1.6;
                font-size: 14px;
              ">
                Hello,
              </p>

              <p style="
                color: #46534b;
                line-height: 1.6;
                font-size: 14px;
              ">
                We received a request to verify your account
                on the Yash Hospital Healthcare Portal.
              </p>

              <p style="
                color: #46534b;
                line-height: 1.6;
                font-size: 14px;
              ">
                Please use the one-time verification code below
                to continue.
              </p>

              <!-- OTP BOX -->
              <div style="
                background: #ecfdf5;
                border: 1px solid #a7f3d0;
                border-radius: 10px;
                padding: 22px;
                margin: 25px 0;
                text-align: center;
              ">

                <p style="
                  margin: 0 0 10px;
                  color: #047857;
                  font-size: 12px;
                  font-weight: bold;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                ">
                  Verification Code
                </p>

                <div style="
                  font-size: 36px;
                  font-weight: bold;
                  letter-spacing: 8px;
                  color: #064e3b;
                ">
                  ${otp}
                </div>

              </div>

              <p style="
                color: #66736b;
                font-size: 13px;
                line-height: 1.5;
              ">
                This verification code is valid for
                <strong>5 minutes</strong>.
              </p>

              <!-- SECURITY NOTICE -->
              <div style="
                background: #f8faf9;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
              ">

                <p style="
                  margin: 0;
                  color: #46534b;
                  font-size: 13px;
                  line-height: 1.5;
                ">
                  <strong>Security Notice:</strong><br>
                  Never share this verification code with
                  anyone, including hospital staff.
                </p>

              </div>

              <p style="
                color: #66736b;
                font-size: 13px;
                line-height: 1.5;
              ">
                If you did not request this verification code,
                you can safely ignore this email.
              </p>

              <hr style="
                border: 0;
                border-top: 1px solid #e2e8e5;
                margin: 25px 0;
              ">

              <!-- FOOTER -->
              <p style="
                text-align: center;
                color: #66736b;
                font-size: 12px;
                line-height: 1.5;
                margin: 0;
              ">
                Yash Hospital<br>
                Secure Healthcare Portal
              </p>

              <p style="
                text-align: center;
                color: #94a19a;
                font-size: 11px;
                margin-top: 15px;
              ">
                This is an automated email. Please do not reply.
              </p>

            </div>

          </div>

        </body>
        </html>
      `,
    });

    console.log("OTP email sent:", info.messageId);
    console.log("Generated OTP:", otp);

    return {
      success: true,
      messageId: info.messageId,
      otp: otp,
    };

  } catch (error) {
    console.error("OTP email error:", error);
    throw error;
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  sendOtpEmail,
};

