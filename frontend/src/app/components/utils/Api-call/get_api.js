 
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
    const response = await client.post("departments", data);

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to create department"
      );
    }

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

