import { client } from "@/app/components/healper";

const SERVER_URL = process.env.NEXT_PUBLIC_API_BASE_URL.replace(
  "/api/",
  ""
);

export const createDoctor = async (formData) => {
  try {
    const response = await client.post("doctors", formData);

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to create doctor",
      }
    );
  }
};

export const getDoctors = async () => {
  try {
    const response = await client.get("doctors");

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch doctors",
      }
    );
  }
};

export const getDoctorById = async (id) => {
  try {
    const response = await client.get(`doctors/${id}`);

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch doctor",
      }
    );
  }
};

export const getDoctorImageUrl = (imagePath) => {
  if (!imagePath) return "";

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  return `${SERVER_URL}${imagePath}`;
};