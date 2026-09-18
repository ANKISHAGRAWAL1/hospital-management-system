import { client } from "@/app/components/healper";

// =====================================================
// CREATE APPOINTMENT
// =====================================================

export const createAppointment = async (data) => {
  try {
    console.log("CREATE APPOINTMENT DATA:", data);

    const response = await client.post("appointments", data);

    console.log("CREATE APPOINTMENT RESPONSE:", response.data);

    return response.data;
  } catch (error) {
    console.error("CREATE APPOINTMENT ERROR:", error);
    console.error(
      "BACKEND ERROR:",
      error.response?.data
    );
    console.error(
      "STATUS:",
      error.response?.status
    );

    throw (
      error.response?.data || {
        success: false,
        message: "Failed to create appointment",
      }
    );
  }
};

// =====================================================
// GET MY APPOINTMENTS
// =====================================================

export const getMyAppointments = async () => {
  try {
    const response = await client.get(
      "appointments/my"
    );

    return response.data;
  } catch (error) {
    console.error(
      "GET MY APPOINTMENTS ERROR:",
      error
    );

    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch appointments",
      }
    );
  }
};

// =====================================================
// GET APPOINTMENT BY ID
// =====================================================

export const getAppointmentById = async (id) => {
  try {
    const response = await client.get(
      `appointments/${id}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "GET APPOINTMENT ERROR:",
      error
    );

    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch appointment",
      }
    );
  }
};

// =====================================================
// CANCEL APPOINTMENT
// =====================================================

export const cancelAppointment = async (
  id,
  cancellationReason
) => {
  try {
    const response = await client.patch(
      `appointments/${id}/cancel`,
      {
        cancellationReason,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "CANCEL APPOINTMENT ERROR:",
      error
    );

    throw (
      error.response?.data || {
        success: false,
        message: "Failed to cancel appointment",
      }
    );
  }
};

// =====================================================
// COMPLETE FIRST-TIME PATIENT PROFILE
// =====================================================

export const completePatientProfile = async (data) => {
  try {
    const response = await client.post(
      "auth/patient/complete-profile",
      {
        signupToken: data.signupToken || "",
        name: data.name,
        email: data.email,
        dateOfBirth: data.dateOfBirth,
        phone: data.phone,
      }
    );

    if (!response.data?.success) {
      throw new Error(
        response.data?.message ||
          "Failed to complete patient profile"
      );
    }

    return response.data;
  } catch (error) {
    console.error(
      "COMPLETE PATIENT PROFILE API ERROR:",
      error
    );

    throw (
      error.response?.data || {
        success: false,
        message: "Failed to complete patient profile",
      }
    );
  }
};

// =====================================================
// CREATE PATIENT DEPENDENT
// =====================================================

export const createPatientDependent = async (data) => {
  try {
    const response = await client.post(
      "auth/patient/dependent",
      {
        name: data.name,
        email: data.email,
        dateOfBirth: data.dateOfBirth,
        phone: data.phone,
      }
    );

    if (!response.data?.success) {
      throw new Error(
        response.data?.message ||
          "Failed to add new patient"
      );
    }

    return response.data;
  } catch (error) {
    console.error(
      "CREATE PATIENT DEPENDENT API ERROR:",
      error
    );

    throw (
      error.response?.data || {
        success: false,
        message: "Failed to add new patient",
      }
    );
  }
};

// =====================================================
// GET MY PATIENTS
// =====================================================

export const getMyPatients = async () => {
  try {
    const response = await client.get(
      "auth/patient/my-patients"
    );

    if (!response.data?.success) {
      throw new Error(
        response.data?.message ||
          "Failed to fetch patients"
      );
    }

    return response.data;
  } catch (error) {
    console.error(
      "GET MY PATIENTS API ERROR:",
      error
    );

    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch patients",
      }
    );
  }
};