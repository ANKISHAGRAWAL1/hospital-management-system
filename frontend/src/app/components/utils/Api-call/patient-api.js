import { client } from "@/app/components/healper";

export const getPatientDashboard = async () => {
  try {
    const response = await client.get(
      "/patient/dashboard"
    );

    if (!response.data?.success) {
      throw new Error(
        response.data?.message ||
          "Failed to fetch patient dashboard"
      );
    }

    return response.data;
  } catch (error) {
    console.error(
      "Get Patient Dashboard Error:",
      error
    );

    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch patient dashboard"
    );
  }
};

export const getPatientAppointments = async () => {
  try {
    const response = await client.get(
      "/patient/dashboard/appointments"
    );

    if (!response.data?.success) {
      throw new Error(
        response.data?.message ||
          "Failed to fetch patient appointments"
      );
    }

    return response.data;
  } catch (error) {
    console.error(
      "Get Patient Appointments Error:",
      error
    );

    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch patient appointments"
    );
  }
};

export const getPatientAppointmentById = async (
  appointmentId
) => {
  try {
    const response = await client.get(
      `/patient/dashboard/appointments/${appointmentId}`
    );

    if (!response.data?.success) {
      throw new Error(
        response.data?.message ||
          "Failed to fetch appointment"
      );
    }

    return response.data;
  } catch (error) {
    console.error(
      "Get Patient Appointment Error:",
      error
    );

    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch appointment"
    );
  }
};

export const cancelPatientAppointment = async (
  appointmentId,
  cancellationReason = ""
) => {
  try {
    const response = await client.patch(
      `/patient/dashboard/appointments/${appointmentId}/cancel`,
      {
        cancellationReason,
      }
    );

    if (!response.data?.success) {
      throw new Error(
        response.data?.message ||
          "Failed to cancel patient appointment"
      );
    }

    return response.data;
  } catch (error) {
    console.error(
      "Cancel Patient Appointment Error:",
      error
    );

    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to cancel patient appointment"
    );
  }
};

export const getPatientPrescriptions = async () => {
  try {
    const response = await client.get(
      "/patient/prescriptions"
    );

    if (!response.data?.success) {
      throw new Error(
        response.data?.message ||
          "Failed to fetch patient prescriptions"
      );
    }

    return response.data;
  } catch (error) {
    console.error(
      "Get Patient Prescriptions Error:",
      error
    );

    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch patient prescriptions"
    );
  }
};

export const getPatientProfile = async () => {
  try {
    const response = await client.get(
      "/patient/profile"
    );

    if (!response.data?.success) {
      throw new Error(
        response.data?.message ||
          "Failed to fetch patient profile"
      );
    }

    return response.data;
  } catch (error) {
    console.error(
      "Get Patient Profile Error:",
      error
    );

    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch patient profile"
    );
  }
};

export const updatePatientProfile = async (
  data
) => {
  try {
    const response = await client.put(
      "/patient/profile",
      data
    );

    if (!response.data?.success) {
      throw new Error(
        response.data?.message ||
          "Failed to update patient profile"
      );
    }

    return response.data;
  } catch (error) {
    console.error(
      "Update Patient Profile Error:",
      error
    );

    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to update patient profile"
    );
  }
};

export const getPatientNotifications = async () => {
  try {
    const response = await client.get(
      "/patient/notifications"
    );

    if (!response.data?.success) {
      throw new Error(
        response.data?.message ||
          "Failed to fetch patient notifications"
      );
    }

    return response.data;
  } catch (error) {
    console.error(
      "Get Patient Notifications Error:",
      error
    );

    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch patient notifications"
    );
  }
};