 
import { client } from "@/app/components/healper";

// GET ALL DEPARTMENTS
export const getdepartment = async () => {
  try {
    const response = await client.get("departments");

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to fetch departments"
      );
    }

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// CREATE DEPARTMENT
export const createDepartment = async (data) => {
  try {
    console.log("🔥 API CALL START");

    const response = await client.post("departments", data);

    console.log("🔥 API RESPONSE RECEIVED");
    console.log("STATUS:", response.status);
    console.log("DATA:", response.data);

    return response.data;
  } catch (error) {
    console.error("🔥 CREATE DEPARTMENT API ERROR");
    console.error("ERROR:", error);
    console.error("RESPONSE:", error?.response?.data);

    throw error;
  }
};

