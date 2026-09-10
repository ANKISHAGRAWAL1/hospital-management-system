import { client } from "@/app/components/healper";

// =====================================================
// DOCTOR AUTH APIs
// =====================================================

// =====================================================
// SEND DOCTOR OTP
// =====================================================

export const sendDoctorOtp = async (email) => {
  try {
    const response = await client.post(
      "auth/doctor/send-otp",
      {
        email: String(email).trim().toLowerCase(),
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Send Doctor OTP Error:",
      error.response?.data || error.message
    );

    throw (
      error.response?.data || {
        success: false,
        message: "Failed to send OTP",
      }
    );
  }
};

// =====================================================
// RESEND DOCTOR OTP
// =====================================================

export const resendDoctorOtp = async (email) => {
  try {
    const response = await client.post(
      "auth/doctor/resend-otp",
      {
        email: String(email).trim().toLowerCase(),
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Resend Doctor OTP Error:",
      error.response?.data || error.message
    );

    throw (
      error.response?.data || {
        success: false,
        message: "Failed to resend OTP",
      }
    );
  }
};

// =====================================================
// VERIFY DOCTOR OTP
// =====================================================

export const verifyDoctorOtp = async (
  email,
  otp
) => {
  try {
    const response = await client.post(
      "auth/doctor/verify-otp",
      {
        email: String(email).trim().toLowerCase(),
        otp: String(otp).trim(),
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Verify Doctor OTP Error:",
      error.response?.data || error.message
    );

    throw (
      error.response?.data || {
        success: false,
        message: "Failed to verify OTP",
      }
    );
  }
};

// =====================================================
// SET DOCTOR CREDENTIALS
// =====================================================

export const setDoctorCredentials = async (
  data
) => {
  try {
    const response = await client.post(
      "auth/doctor/set-credentials",
      {
        setupToken: data.setupToken,
        password: data.password,
        confirmPassword: data.confirmPassword,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Set Doctor Credentials Error:",
      error.response?.data || error.message
    );

    throw (
      error.response?.data || {
        success: false,
        message:
          "Failed to create doctor account",
      }
    );
  }
};

// =====================================================
// ADMIN AUTH APIs
// =====================================================

// =====================================================
// ADMIN LOGIN
// =====================================================

export const adminLogin = async (data) => {
  try {
    const payload = {
      email: String(data?.email || "").trim().toLowerCase(),
      password: String(data?.password || ""),
    };

    console.log("========== ADMIN LOGIN ==========");
    console.log("Payload:", {
      email: payload.email,
      passwordReceived: Boolean(payload.password),
    });

    if (!payload.email || !payload.password) {
      return {
        success: false,
        message: "Email and password are required",
      };
    }

    const response = await client.post(
      "auth/admin/login",
      payload
    );

    console.log("Admin Login Response:", response.data);

    return response.data;
  } catch (error) {
    console.error("========== ADMIN LOGIN ERROR ==========");
    console.error("Status:", error.response?.status);
    console.error("Backend Response:", error.response?.data);
    console.error("Error Message:", error.message);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Admin login failed",
    };
  }
};

// =====================================================
// GET ADMIN ME
// =====================================================

export const getAdminMe = async () => {
  try {
    const response = await client.get(
      "auth/admin/me"
    );

    return response.data;
  } catch (error) {
    console.error(
      "Get Admin Me Error:",
      error.response?.data || error.message
    );

    throw (
      error.response?.data || {
        success: false,
        message: "Authentication failed",
      }
    );
  }
};


// =====================================================
// DOCTOR LOGIN
// =====================================================

export const doctorLogin = async (data) => {
  try {
    const payload = {
      email: String(data?.email || "")
        .trim()
        .toLowerCase(),

      password: String(data?.password || ""),
    };

    console.log("========== DOCTOR LOGIN ==========");
    console.log("Payload:", {
      email: payload.email,
      passwordReceived: Boolean(payload.password),
    });

    if (!payload.email || !payload.password) {
      return {
        success: false,
        message: "Email and password are required",
      };
    }

    const response = await client.post(
      "auth/doctor/login",
      payload
    );

    console.log(
      "DOCTOR LOGIN RESULT:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      "========== DOCTOR LOGIN ERROR =========="
    );

    console.error(
      "Status:",
      error.response?.status
    );

    console.error(
      "Backend Response:",
      error.response?.data
    );

    console.error(
      "Error Message:",
      error.message
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Doctor login failed",
    };
  }
};
// =====================================================
// GET ADMIN PROFILE
// =====================================================

export const getAdminProfile = async () => {
  try {
    const response = await client.get(
      "auth/admin/me"
    );

    return response.data;
  } catch (error) {
    console.error(
      "Get Admin Profile Error:",
      error.response?.data || error.message
    );

    throw (
      error.response?.data || {
        success: false,
        message:
          "Failed to fetch admin profile",
      }
    );
  }
};






 

// =====================================================
// DOCTOR FORGOT PASSWORD - SEND OTP
// =====================================================

export const forgotDoctorPassword = async (email) => {
  try {
    const response = await client.post(
      "auth/doctor/forgot-password",
      {
        email: String(email).trim().toLowerCase(),
      }
    );

    return response.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Unable to send password reset OTP",
    };
  }
};


// =====================================================
// DOCTOR FORGOT PASSWORD - VERIFY OTP
// =====================================================

export const verifyDoctorResetOtp = async (
  email,
  otp
) => {
  try {
    const response = await client.post(
      "auth/doctor/forgot-password/verify-otp",
      {
        email: String(email).trim().toLowerCase(),
        otp: String(otp).trim(),
      }
    );

    return response.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Unable to verify OTP",
      remainingAttempts:
        error.response?.data?.remainingAttempts,
    };
  }
};


// =====================================================
// DOCTOR RESET PASSWORD
// =====================================================

export const resetDoctorPassword = async (
  data
) => {
  try {
    const response = await client.post(
      "auth/doctor/reset-password",
      {
        resetToken: data.resetToken,
        password: data.password,
        confirmPassword: data.confirmPassword,
      }
    );

    return response.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Unable to reset password",
    };
  }
};
// =====================================================
// UPDATE ADMIN PROFILE
// =====================================================

export const updateAdminProfile = async (
  data
) => {
  try {
    const response = await client.put(
      "auth/admin/profile",
      data
    );

    return response.data;
  } catch (error) {
    console.error(
      "Update Admin Profile Error:",
      error.response?.data || error.message
    );

    throw (
      error.response?.data || {
        success: false,
        message:
          "Failed to update admin profile",
      }
    );
  }
};