require("dotenv").config();

const nodemailer = require("nodemailer");

// ==========================================
// ENVIRONMENT VARIABLES
// ==========================================

const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASS = process.env.MAIL_PASS;

console.log("MAIL_USER loaded:", !!MAIL_USER);
console.log("MAIL_PASS loaded:", !!MAIL_PASS);

// ==========================================
// ENV VALIDATION
// ==========================================

if (!MAIL_USER || !MAIL_PASS) {
  console.error(
    "❌ MAIL_USER or MAIL_PASS is missing from environment variables."
  );
}

// ==========================================
// SMTP TRANSPORTER
// ==========================================

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

// ==========================================
// SMTP CONNECTION TEST
// ==========================================

transporter.verify((error) => {
  if (error) {
    console.error("❌ SMTP CONNECTION ERROR:");
    console.error(error);
  } else {
    console.log("✅ SMTP SERVER READY");
  }
});

// ==========================================
// SEND OTP EMAIL
// ==========================================

const sendOtpEmail = async (email, otp) => {
  try {
    // --------------------------------------
    // BASIC VALIDATION
    // --------------------------------------

    if (!email) {
      throw new Error("Email is required");
    }

    if (!otp) {
      throw new Error("OTP is required");
    }

    // --------------------------------------
    // CLEAN VALUES
    // --------------------------------------

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanOtp = String(otp).trim();

    // --------------------------------------
    // EMAIL VALIDATION
    // --------------------------------------

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      throw new Error("Invalid email address");
    }

    // --------------------------------------
    // OTP VALIDATION
    // --------------------------------------

    if (!/^\d{6}$/.test(cleanOtp)) {
      throw new Error("OTP must be exactly 6 digits");
    }

    // --------------------------------------
    // DEBUG LOG
    // --------------------------------------

    console.log("==========================================");
    console.log("📧 SENDING DOCTOR OTP EMAIL");
    console.log("To:", cleanEmail);
    console.log("OTP:", cleanOtp);
    console.log("==========================================");

    // --------------------------------------
    // MAIL OPTIONS
    // --------------------------------------

    const mailOptions = {
      from: `"Yash Hospital | Account Verification" <${MAIL_USER}>`,
      to: cleanEmail,
      subject: "Yash Hospital - Doctor Verification Code",

      text: `
Yash Hospital

Doctor Account Verification

Your verification code is: ${cleanOtp}

This verification code is valid for 5 minutes.

If you did not request this verification code,
please ignore this email.

© ${new Date().getFullYear()} Yash Hospital.
      `.trim(),

      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>Yash Hospital OTP</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#f5f7f8;
    font-family:Arial,Helvetica,sans-serif;
  "
>

  <div
    style="
      max-width:600px;
      margin:40px auto;
      background:#ffffff;
      border-radius:12px;
      overflow:hidden;
      border:1px solid #e2e8e4;
    "
  >

    <!-- HEADER -->

    <div
      style="
        background:#064e3b;
        padding:25px;
        text-align:center;
      "
    >

      <h1
        style="
          margin:0;
          color:#ffffff;
          font-size:24px;
        "
      >
        Yash Hospital
      </h1>

      <p
        style="
          margin:8px 0 0;
          color:#d1fae5;
          font-size:14px;
        "
      >
        Doctor Account Verification
      </p>

    </div>

    <!-- CONTENT -->

    <div
      style="
        padding:35px 30px;
      "
    >

      <h2
        style="
          margin:0 0 15px;
          color:#17211b;
          font-size:22px;
        "
      >
        Verify Your Account
      </h2>

      <p
        style="
          color:#46534b;
          font-size:15px;
          line-height:1.6;
        "
      >
        We received a request to verify your doctor account.
        Please use the verification code below.
      </p>

      <!-- OTP BOX -->

      <div
        style="
          margin:30px 0;
          padding:20px;
          background:#ecfdf5;
          border:1px solid #6ee7b7;
          border-radius:10px;
          text-align:center;
        "
      >

        <p
          style="
            margin:0 0 8px;
            color:#66736b;
            font-size:13px;
          "
        >
          Your verification code
        </p>

        <div
          style="
            font-size:34px;
            font-weight:bold;
            letter-spacing:8px;
            color:#064e3b;
          "
        >
          ${cleanOtp}
        </div>

      </div>

      <p
        style="
          color:#66736b;
          font-size:14px;
          line-height:1.6;
        "
      >
        This verification code is valid for
        <strong>5 minutes</strong>.
      </p>

      <p
        style="
          color:#66736b;
          font-size:14px;
          line-height:1.6;
        "
      >
        If you did not request this verification code,
        please ignore this email.
      </p>

    </div>

    <!-- FOOTER -->

    <div
      style="
        background:#f8faf9;
        padding:20px;
        text-align:center;
        border-top:1px solid #edf1ee;
      "
    >

      <p
        style="
          margin:0;
          color:#94a19a;
          font-size:12px;
        "
      >
        © ${new Date().getFullYear()} Yash Hospital.
        All rights reserved.
      </p>

    </div>

  </div>

</body>
</html>
      `,
    };

    // --------------------------------------
    // SEND EMAIL
    // --------------------------------------

    console.log("📨 Calling SMTP sendMail...");

    const info = await transporter.sendMail(mailOptions);

    // --------------------------------------
    // SUCCESS
    // --------------------------------------
 
    console.log(" OTP EMAIL SENT SUCCESSFULLY");
    console.log("Message ID:", info.messageId);
   

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    // --------------------------------------
    // ERROR
    // --------------------------------------

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

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  sendOtpEmail,
};