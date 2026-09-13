import { client } from "@/app/components/healper";

// Create Appointment
export const createAppointment = async (data) => {
  try {
    const response = await client.post(
      "appointments",
      data
    );

    return response.data;
  } catch (error) {
    console.error(
      "CREATE APPOINTMENT ERROR:",
      error
    );

    throw (
      error.response?.data || {
        success: false,
        message: "Failed to create appointment",
      }
    );
  }
};


// Get My Appointments
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


// Get Appointment By ID
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


// Cancel Appointment
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