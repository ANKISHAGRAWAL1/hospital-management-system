import { client } from "@/app/components/healper";

export const getPatientProfile = async () => {
  try {
    const response = await client.get("/auth/patient/profile");

    if (!response.data?.success) {
      throw new Error(
        response.data?.message || "Failed to fetch patient profile"
      );
    }

    return response.data;
  } catch (error) {
    console.log(
      "GET PATIENT PROFILE ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export const updatePatientProfile = async (formData) => {
  try {
    const response = await client.put(
      "/auth/patient/profile",
      formData
    );

    if (!response.data?.success) {
      throw new Error(
        response.data?.message || "Failed to update patient profile"
      );
    }

    return response.data;
  } catch (error) {
    console.log(
      "UPDATE PATIENT PROFILE ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};