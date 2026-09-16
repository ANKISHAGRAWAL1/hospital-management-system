 
require("dotenv").config();

const nodemailer = require("nodemailer");

// ======================================================
// ENVIRONMENT VARIABLES
// ======================================================

const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASS = process.env.MAIL_PASS;

console.log("MAIL_USER loaded:", !!MAIL_USER);
console.log("MAIL_PASS loaded:", !!MAIL_PASS);

// ======================================================
// ENVIRONMENT VALIDATION
// ======================================================

if (!MAIL_USER || !MAIL_PASS) {
  console.warn("⚠️ MAIL_USER or MAIL_PASS is missing in .env");
}

// ======================================================
// SMTP TRANSPORTER
// ======================================================

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,

  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

// ======================================================
// SEND OTP EMAIL
// ======================================================

const sendOtpEmail = async (email, otp) => {
  try {
    if (!email) {
      throw new Error("Email is required");
    }

    if (!otp) {
      throw new Error("OTP is required");
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanOtp = String(otp).trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      throw new Error("Invalid email address");
    }

    if (!/^\d{6}$/.test(cleanOtp)) {
      throw new Error("OTP must be 6 digits");
    }

    console.log("==========================================");
    console.log("📧 SENDING OTP EMAIL");
    console.log("Email:", cleanEmail);
    console.log("OTP:", cleanOtp);
    console.log("==========================================");

    const mailOptions = {
      from: `"Yash Hospital | Account Verification" <${MAIL_USER}>`,
      to: cleanEmail,
      subject: "Yash Hospital - Doctor Verification Code",

      text: `
Yash Hospital

Doctor Account Verification

Your verification code is:

${cleanOtp}

This OTP is valid for 5 minutes.

Please do not share this OTP with anyone.

If you did not request this verification code, please ignore this email.

© ${new Date().getFullYear()} Yash Hospital. All rights reserved.
      `.trim(),

      html: `
<!DOCTYPE html>
<html lang="en">

<head>

  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <meta
    name="x-apple-disable-message-reformatting"
  />

  <title>Yash Hospital - Verification Code</title>

  <style>

    html,
    body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      background: #f5f7fa;
    }

    body {
      font-family: Arial, Helvetica, sans-serif;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }

    table {
      border-spacing: 0;
      border-collapse: collapse;
    }

    @media only screen and (max-width: 600px) {

      .email-wrapper {
        padding: 20px 10px !important;
      }

      .email-container {
        width: 100% !important;
        border-radius: 8px !important;
      }

      .email-header {
        padding: 22px 20px !important;
      }

      .email-content {
        padding: 30px 20px !important;
      }

      .otp-box {
        font-size: 28px !important;
        letter-spacing: 6px !important;
      }

      .email-footer {
        padding: 20px !important;
      }

    }

  </style>

</head>

<body>

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  role="presentation"
  style="
    width:100%;
    background:#f5f7fa;
  "
>

  <tr>

    <td
      align="center"
      class="email-wrapper"
      style="
        padding:40px 16px;
      "
    >

      <table
        width="620"
        cellpadding="0"
        cellspacing="0"
        border="0"
        role="presentation"
        class="email-container"
        style="
          width:100%;
          max-width:620px;
          background:#ffffff;
          border:1px solid #e5e7eb;
          border-radius:10px;
          overflow:hidden;
        "
      >

        <!-- HEADER -->

        <tr>

          <td
            class="email-header"
            style="
              padding:28px 36px;
              background:#ffffff;
              border-bottom:1px solid #e5e7eb;
            "
          >

            <div
              style="
                font-size:22px;
                line-height:28px;
                font-weight:700;
                color:#0f766e;
              "
            >
              Yash Hospital
            </div>

            <div
              style="
                margin-top:4px;
                font-size:11px;
                line-height:17px;
                color:#64748b;
                letter-spacing:0.5px;
              "
            >
              HEALTHCARE MANAGEMENT SYSTEM
            </div>

          </td>

        </tr>

        <!-- CONTENT -->

        <tr>

          <td
            class="email-content"
            style="
              padding:40px 36px 36px;
            "
          >

            <p
              style="
                margin:0 0 10px;
                font-size:12px;
                line-height:18px;
                font-weight:700;
                color:#0f766e;
                text-transform:uppercase;
                letter-spacing:0.8px;
              "
            >
              Account Verification
            </p>

            <h1
              style="
                margin:0 0 18px;
                font-size:26px;
                line-height:34px;
                color:#111827;
              "
            >
              Verification Code
            </h1>

            <p
              style="
                margin:0;
                font-size:15px;
                line-height:25px;
                color:#4b5563;
              "
            >
              Use the verification code below to continue
              with your Yash Hospital doctor account.
            </p>

            <!-- OTP -->

            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
              role="presentation"
              style="
                width:100%;
                margin-top:30px;
                background:#f0fdfa;
                border:1px solid #ccfbf1;
                border-radius:8px;
              "
            >

              <tr>

                <td
                  align="center"
                  style="
                    padding:28px 20px;
                  "
                >

                  <div
                    style="
                      font-size:12px;
                      color:#64748b;
                      margin-bottom:12px;
                    "
                  >
                    YOUR VERIFICATION CODE
                  </div>

                  <div
                    class="otp-box"
                    style="
                      font-size:32px;
                      line-height:40px;
                      font-weight:700;
                      letter-spacing:8px;
                      color:#0f766e;
                    "
                  >
                    ${cleanOtp}
                  </div>

                  <div
                    style="
                      margin-top:14px;
                      font-size:12px;
                      color:#64748b;
                    "
                  >
                    Valid for 5 minutes
                  </div>

                </td>

              </tr>

            </table>

            <p
              style="
                margin:28px 0 0;
                font-size:13px;
                line-height:21px;
                color:#6b7280;
              "
            >
              For security reasons, please do not share this
              verification code with anyone.
            </p>

          </td>

        </tr>

        <!-- FOOTER -->

        <tr>

          <td
            class="email-footer"
            style="
              padding:22px 36px;
              background:#f8fafc;
              border-top:1px solid #e5e7eb;
            "
          >

            <p
              style="
                margin:0;
                font-size:12px;
                line-height:19px;
                color:#6b7280;
              "
            >
              This is an automated message from Yash Hospital
              Healthcare Management System.
            </p>

            <p
              style="
                margin:7px 0 0;
                font-size:11px;
                line-height:17px;
                color:#9ca3af;
              "
            >
              © ${new Date().getFullYear()}
              Yash Hospital. All rights reserved.
            </p>

          </td>

        </tr>

      </table>

    </td>

  </tr>

</table>

</body>
</html>
      `,
    };

    console.log("📨 Calling SMTP sendMail...");

    const info = await transporter.sendMail(mailOptions);

    console.log("==========================================");
    console.log("✅ OTP EMAIL SENT SUCCESSFULLY");
    console.log("Message ID:", info.messageId);
    console.log("==========================================");

    return {
      success: true,
      messageId: info.messageId,
    };

  } catch (error) {

    console.error("==========================================");
    console.error("❌ OTP EMAIL ERROR");
    console.error("Name:", error.name);
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Command:", error.command);
    console.error("==========================================");

    throw error;
  }
};

// ======================================================
// SEND DOCTOR LOGIN CREDENTIALS EMAIL
// ======================================================

const sendDoctorCredentialsEmail = async (
  email,
  doctorName,
  temporaryPassword
) => {

  try {

    if (!email) {
      throw new Error("Doctor email is required");
    }

    if (!doctorName) {
      throw new Error("Doctor name is required");
    }

    if (!temporaryPassword) {
      throw new Error("Temporary password is required");
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanDoctorName = String(doctorName).trim();
    const cleanPassword = String(temporaryPassword).trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      throw new Error("Invalid doctor email address");
    }

    if (cleanPassword.length < 8) {
      throw new Error(
        "Temporary password must be at least 8 characters"
      );
    }

    const loginUrl =
      process.env.FRONTEND_URL?.replace(/\/$/, "") ||
      "http://localhost:3000";

    const doctorLoginUrl = `${loginUrl}/doctor/login`;

    // ==================================================
    // CONSOLE LOGIN CREDENTIALS
    // ==================================================

    console.log("");
    console.log("==========================================");
    console.log("🩺 DOCTOR LOGIN CREDENTIALS");
    console.log("==========================================");
    console.log("Doctor:", cleanDoctorName);
    console.log("Email:", cleanEmail);
    console.log("Temporary Password:", cleanPassword);
    console.log("Login URL:", doctorLoginUrl);
    console.log("==========================================");
    console.log("");

    // ==================================================
    // EMAIL OPTIONS
    // ==================================================

    const mailOptions = {

      from:
        `"Yash Hospital | Doctor Portal" <${MAIL_USER}>`,

      to: cleanEmail,

      subject:
        "Yash Hospital - Doctor Portal Login Credentials",

      text: `
Yash Hospital

Doctor Portal Access

Dear Dr. ${cleanDoctorName},

Your doctor account has been successfully created by the Yash Hospital Administration.

You can now access the Doctor Portal using the credentials below.

Login Email:
${cleanEmail}

Temporary Password:
${cleanPassword}

Doctor Portal:
${doctorLoginUrl}

Important:
This is a temporary password. Please change your password after your first successful login.

Please keep your login credentials confidential.

If you were not expecting this account, please contact the Yash Hospital Administration.

© ${new Date().getFullYear()} Yash Hospital. All rights reserved.
      `.trim(),

      html: `
<!DOCTYPE html>

<html lang="en">

<head>

  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <meta
    name="x-apple-disable-message-reformatting"
  />

  <title>
    Yash Hospital - Doctor Portal
  </title>

  <style>

    html,
    body {

      margin: 0 !important;
      padding: 0 !important;

      width: 100% !important;

      background: #f5f7fa;

    }

    body {

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;

    }

    table {

      border-spacing: 0;
      border-collapse: collapse;

    }

    img {

      border: 0;
      outline: none;
      text-decoration: none;

      display: block;

      max-width: 100%;

    }

    a {

      text-decoration: none;

    }

    @media only screen and (max-width: 600px) {

      .email-wrapper {

        padding: 20px 10px !important;

      }

      .email-container {

        width: 100% !important;

        border-radius: 8px !important;

      }

      .email-header {

        padding: 22px 20px !important;

      }

      .email-content {

        padding: 30px 20px !important;

      }

      .email-footer {

        padding: 20px !important;

      }

      .hospital-name {

        font-size: 20px !important;

        line-height: 26px !important;

      }

      .portal-label {

        font-size: 11px !important;

      }

      .account-title {

        font-size: 23px !important;

        line-height: 30px !important;

      }

      .intro-text {

        font-size: 14px !important;

        line-height: 23px !important;

      }

      .credential-card {

        margin-top: 24px !important;

      }

      .credential-inner {

        padding: 18px !important;

      }

      .credential-label,
      .credential-value {

        display: block !important;

        width: 100% !important;

      }

      .credential-label {

        padding: 7px 0 3px !important;

      }

      .credential-value {

        padding: 3px 0 10px !important;

        word-break: break-all !important;

      }

      .login-button {

        display: block !important;

        width: 100% !important;

        box-sizing: border-box !important;

        text-align: center !important;

        padding: 14px 16px !important;

      }

      .security-box {

        margin-top: 24px !important;

      }

      .security-text {

        font-size: 12px !important;

        line-height: 19px !important;

      }

      .support-text {

        font-size: 12px !important;

        line-height: 20px !important;

      }

    }

  </style>

</head>

<body>

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  role="presentation"
  style="
    width:100%;
    background:#f5f7fa;
  "
>

  <tr>

    <td
      align="center"
      class="email-wrapper"
      style="
        padding:40px 16px;
      "
    >

      <table
        width="620"
        cellpadding="0"
        cellspacing="0"
        border="0"
        role="presentation"
        class="email-container"
        style="
          width:100%;
          max-width:620px;
          background:#ffffff;
          border:1px solid #e5e7eb;
          border-radius:10px;
          overflow:hidden;
        "
      >

        <!-- HEADER -->

        <tr>

          <td
            class="email-header"
            style="
              padding:28px 36px;
              background:#ffffff;
              border-bottom:1px solid #e5e7eb;
            "
          >

            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
              role="presentation"
            >

              <tr>

                <td
                  valign="middle"
                  style="
                    vertical-align:middle;
                  "
                >

                  <div
                    class="hospital-name"
                    style="
                      font-size:22px;
                      line-height:28px;
                      font-weight:700;
                      color:#0f766e;
                    "
                  >
                    Yash Hospital
                  </div>

                  <div
                    class="portal-label"
                    style="
                      margin-top:4px;
                      font-size:11px;
                      line-height:17px;
                      color:#64748b;
                      letter-spacing:0.5px;
                    "
                  >
                    HEALTHCARE MANAGEMENT SYSTEM
                  </div>

                </td>

                <td
                  align="right"
                  valign="middle"
                  style="
                    vertical-align:middle;
                    font-size:12px;
                    color:#64748b;
                    white-space:nowrap;
                  "
                >
                  Doctor Portal
                </td>

              </tr>

            </table>

          </td>

        </tr>

        <!-- CONTENT -->

        <tr>

          <td
            class="email-content"
            style="
              padding:40px 36px 36px;
            "
          >

            <p
              style="
                margin:0 0 10px;
                font-size:12px;
                line-height:18px;
                font-weight:700;
                color:#0f766e;
                text-transform:uppercase;
                letter-spacing:0.8px;
              "
            >
              Account Created
            </p>

            <h1
              class="account-title"
              style="
                margin:0 0 18px;
                font-size:26px;
                line-height:34px;
                font-weight:700;
                color:#111827;
              "
            >
              Welcome, Dr. ${cleanDoctorName}
            </h1>

            <p
              class="intro-text"
              style="
                margin:0;
                font-size:15px;
                line-height:25px;
                color:#4b5563;
              "
            >
              Your doctor account has been created successfully.
              You can now access the Yash Hospital Doctor Portal
              using the login credentials provided below.
            </p>

            <!-- CREDENTIAL CARD -->

            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
              role="presentation"
              class="credential-card"
              style="
                width:100%;
                margin-top:30px;
                border:1px solid #dbe4e8;
                border-radius:8px;
                background:#f8fafb;
              "
            >

              <tr>

                <td
                  class="credential-inner"
                  style="
                    padding:24px;
                  "
                >

                  <p
                    style="
                      margin:0 0 18px;
                      font-size:14px;
                      line-height:20px;
                      font-weight:700;
                      color:#111827;
                    "
                  >
                    Your Login Credentials
                  </p>

                  <!-- EMAIL -->

                  <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    role="presentation"
                  >

                    <tr>

                      <td
                        width="150"
                        class="credential-label"
                        style="
                          width:150px;
                          padding:10px 0;
                          font-size:13px;
                          line-height:19px;
                          color:#64748b;
                          vertical-align:top;
                        "
                      >
                        Email Address
                      </td>

                      <td
                        class="credential-value"
                        style="
                          padding:10px 0;
                          font-size:14px;
                          line-height:20px;
                          font-weight:600;
                          color:#111827;
                          vertical-align:top;
                          word-break:break-word;
                          overflow-wrap:anywhere;
                        "
                      >
                        ${cleanEmail}
                      </td>

                    </tr>

                    <!-- PASSWORD -->

                    <tr>

                      <td
                        width="150"
                        class="credential-label"
                        style="
                          width:150px;
                          padding:10px 0;
                          font-size:13px;
                          line-height:19px;
                          color:#64748b;
                          vertical-align:top;
                        "
                      >
                        Temporary Password
                      </td>

                      <td
                        class="credential-value"
                        style="
                          padding:10px 0;
                          font-size:15px;
                          line-height:21px;
                          font-weight:700;
                          color:#0f766e;
                          letter-spacing:0.5px;
                          vertical-align:top;
                          word-break:break-all;
                          overflow-wrap:anywhere;
                        "
                      >
                        ${cleanPassword}
                      </td>

                    </tr>

                  </table>

                </td>

              </tr>

            </table>

            <!-- LOGIN BUTTON -->

            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
              role="presentation"
              style="
                width:100%;
                margin-top:28px;
              "
            >

              <tr>

                <td align="left">

                  <a
                    href="${doctorLoginUrl}"
                    target="_blank"
                    class="login-button"
                    style="
                      display:inline-block;
                      padding:13px 24px;
                      background:#0f766e;
                      color:#ffffff;
                      text-decoration:none;
                      border-radius:6px;
                      font-size:14px;
                      line-height:20px;
                      font-weight:600;
                    "
                  >
                    Access Doctor Portal
                  </a>

                </td>

              </tr>

            </table>

            <!-- SECURITY NOTICE -->

            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
              role="presentation"
              class="security-box"
              style="
                width:100%;
                margin-top:30px;
                border-left:3px solid #d97706;
                background:#fffbeb;
              "
            >

              <tr>

                <td
                  style="
                    padding:14px 16px;
                  "
                >

                  <p
                    class="security-text"
                    style="
                      margin:0;
                      font-size:13px;
                      line-height:20px;
                      color:#78350f;
                    "
                  >

                    <strong>Important:</strong>

                    This is a temporary password.
                    Please change your password after your
                    first successful login and keep your
                    credentials confidential.

                  </p>

                </td>

              </tr>

            </table>

            <!-- SUPPORT -->

            <p
              class="support-text"
              style="
                margin:28px 0 0;
                font-size:13px;
                line-height:21px;
                color:#6b7280;
              "
            >
              If you were not expecting this account or believe
              these credentials were sent to you by mistake,
              please contact the hospital administration.
            </p>

          </td>

        </tr>

        <!-- FOOTER -->

        <tr>

          <td
            class="email-footer"
            style="
              padding:22px 36px;
              background:#f8fafc;
              border-top:1px solid #e5e7eb;
            "
          >

            <p
              style="
                margin:0;
                font-size:12px;
                line-height:19px;
                color:#6b7280;
              "
            >
              This is an automated message from Yash Hospital
              Healthcare Management System.
            </p>

            <p
              style="
                margin:7px 0 0;
                font-size:11px;
                line-height:17px;
                color:#9ca3af;
              "
            >
              © ${new Date().getFullYear()}
              Yash Hospital. All rights reserved.
            </p>

          </td>

        </tr>

      </table>

    </td>

  </tr>

</table>

</body>

</html>
      `,
    };

    // ==================================================
    // SEND EMAIL
    // ==================================================

    console.log("📨 Calling SMTP sendMail...");

    const info = await transporter.sendMail(mailOptions);

    console.log("");
    console.log("==========================================");
    console.log("✅ DOCTOR CREDENTIAL EMAIL SENT");
    console.log("==========================================");
    console.log("Doctor:", cleanDoctorName);
    console.log("Email:", cleanEmail);
    console.log("Temporary Password:", cleanPassword);
    console.log("Login URL:", doctorLoginUrl);
    console.log("Message ID:", info.messageId);
    console.log("==========================================");
    console.log("");

    return {
      success: true,
      messageId: info.messageId,
    };

  } catch (error) {

    console.error("");
    console.error("==========================================");
    console.error("❌ DOCTOR CREDENTIAL EMAIL ERROR");
    console.error("==========================================");
    console.error("Name:", error.name);
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Command:", error.command);
    console.error("==========================================");
    console.error("");

    throw error;
  }
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  sendOtpEmail,
  sendDoctorCredentialsEmail,
};
 