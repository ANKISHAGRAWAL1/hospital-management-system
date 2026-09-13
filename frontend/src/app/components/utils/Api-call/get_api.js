 
import { client } from "@/app/components/healper";

// GET ALL DEPARTMENTS
export const getDepartment = async () => {
  try {
    console.log("🔥 GET DEPARTMENTS API CALL START");

    const response = await client.get("departments");

    console.log("🔥 GET DEPARTMENTS API RESPONSE");
    console.log("STATUS:", response.status);
    console.log("DATA:", response.data);

    if (!response.data?.success) {
      throw new Error(
        response.data?.message || "Failed to fetch departments"
      );
    }

    return response.data;
  } catch (error) {
    console.error("❌ GET DEPARTMENTS API ERROR:", error);
    console.error("STATUS:", error?.response?.status);
    console.error("RESPONSE:", error?.response?.data);

    throw error;
  }
};

// GET SINGLE DEPARTMENT
export const getDepartmentById = async (id) => {
  try {
    if (!id) {
      throw new Error("Department ID is required");
    }

    console.log("🔥 GET DEPARTMENT BY ID:", id);

    const response = await client.get(`departments/${id}`);

    console.log("STATUS:", response.status);
    console.log("DATA:", response.data);

    if (!response.data?.success) {
      throw new Error(
        response.data?.message || "Failed to fetch department"
      );
    }

    return response.data;
  } catch (error) {
    console.error("❌ GET DEPARTMENT BY ID ERROR:", error);
    console.error("STATUS:", error?.response?.status);
    console.error("RESPONSE:", error?.response?.data);

    throw error;
  }
};

// CREATE DEPARTMENT
export const createDepartment = async (data) => {
  try {
    console.log("🔥 CREATE DEPARTMENT API CALL START");

    const formData = new FormData();

    formData.append("name", data?.name || "");
    formData.append("code", data?.code || "");
    formData.append("description", data?.description || "");
    formData.append("location", data?.location || "");
    formData.append("headDoctor", data?.headDoctor || "");

    if (data?.image) {
      formData.append("image", data.image);
    }

    const response = await client.post(
      "departments/creat",
      formData
    );

    console.log("🔥 CREATE DEPARTMENT API RESPONSE");
    console.log("STATUS:", response.status);
    console.log("DATA:", response.data);

    if (!response.data?.success) {
      throw new Error(
        response.data?.message || "Failed to create department"
      );
    }

    return response.data;
  } catch (error) {
    console.error("❌ CREATE DEPARTMENT API ERROR:", error);
    console.error("STATUS:", error?.response?.status);
    console.error("RESPONSE:", error?.response?.data);

    throw error;
  }
};

// UPDATE DEPARTMENT
export const updateDepartment = async (id, data) => {
  try {
    if (!id) {
      throw new Error("Department ID is required");
    }

    console.log("🔥 UPDATE DEPARTMENT API CALL START");
    console.log("DEPARTMENT ID:", id);

    const formData = new FormData();

    formData.append("name", data?.name || "");
    formData.append("code", data?.code || "");
    formData.append("description", data?.description || "");
    formData.append("location", data?.location || "");
    formData.append("headDoctor", data?.headDoctor || "");

    if (data?.image) {
      formData.append("image", data.image);
    }

    const response = await client.put(
      `departments/${id}`,
      formData
    );

    console.log("🔥 UPDATE DEPARTMENT API RESPONSE");
    console.log("STATUS:", response.status);
    console.log("DATA:", response.data);

    if (!response.data?.success) {
      throw new Error(
        response.data?.message || "Failed to update department"
      );
    }

    return response.data;
  } catch (error) {
    console.error("❌ UPDATE DEPARTMENT API ERROR:", error);
    console.error("STATUS:", error?.response?.status);
    console.error("RESPONSE:", error?.response?.data);

    throw error;
  }
};

// DELETE DEPARTMENT
export const deleteDepartment = async (id) => {
  try {
    if (!id) {
      throw new Error("Department ID is required");
    }

    console.log("🔥 DELETE DEPARTMENT API CALL START");
    console.log("DEPARTMENT ID:", id);

    const response = await client.delete(
      `departments/${id}`
    );

    console.log("🔥 DELETE DEPARTMENT API RESPONSE");
    console.log("STATUS:", response.status);
    console.log("DATA:", response.data);

    if (!response.data?.success) {
      throw new Error(
        response.data?.message || "Failed to delete department"
      );
    }

    return response.data;
  } catch (error) {
    console.error("❌ DELETE DEPARTMENT API ERROR:", error);
    console.error("STATUS:", error?.response?.status);
    console.error("RESPONSE:", error?.response?.data);

    throw error;
  }
};

// UPDATE DEPARTMENT STATUS
export const updateDepartmentStatus = async (id, status) => {
  try {
    if (!id) {
      throw new Error("Department ID is required");
    }

    console.log("🔥 UPDATE DEPARTMENT STATUS");
    console.log("ID:", id);
    console.log("STATUS:", status);

    const response = await client.patch(
      `departments/${id}/status`,
      {
        status,
      }
    );

    console.log("🔥 UPDATE DEPARTMENT STATUS RESPONSE");
    console.log("STATUS:", response.status);
    console.log("DATA:", response.data);

    if (!response.data?.success) {
      throw new Error(
        response.data?.message ||
          "Failed to update department status"
      );
    }

    return response.data;
  } catch (error) {
    console.error(
      "❌ UPDATE DEPARTMENT STATUS ERROR:",
      error
    );

    console.error(
      "STATUS:",
      error?.response?.status
    );

    console.error(
      "RESPONSE:",
      error?.response?.data
    );

    throw error;
  }
};

