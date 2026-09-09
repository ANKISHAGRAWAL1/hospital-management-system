import { client } from "@/app/components/healper";

// Get admin profile
export const getAdminProfile = async () => {
  const response = await client.get("admin/profile");
  return response.data;
};

// Update admin profile
export const updateAdminProfile = async (data) => {
  const response = await client.put("admin/profile", data);
  return response.data;
};

// Upload profile image
export const uploadAdminProfileImage = async (formData) => {
  const response = await client.post(
    "admin/profile/image",
    formData
  );

  return response.data;
};

// Remove profile image
export const removeAdminProfileImage = async () => {
  const response = await client.delete(
    "admin/profile/image"
  );

  return response.data;
};

// Change password
export const changeAdminPassword = async (data) => {
  const response = await client.put(
    "admin/profile/password",
    data
  );

  return response.data;
};