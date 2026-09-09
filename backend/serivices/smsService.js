const axios = require("axios");

const sendOtpSms = async (phone, otp) => {
  try {
    const response = await axios.post(
      "https://control.msg91.com/api/v5/otp",
      {
        template_id: process.env.MSG91_TEMPLATE_ID,
        mobile: `91${phone}`,
        otp: otp,
      },
      {
        headers: {
          authkey: process.env.MSG91_AUTH_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("MSG91 RESPONSE:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "MSG91 ERROR:",
      error.response?.data || error.message
    );

    throw new Error("OTP could not be sent");
  }
};

module.exports = {
  sendOtpSms,
};