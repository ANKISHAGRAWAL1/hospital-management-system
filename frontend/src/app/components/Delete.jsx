"use client";

import Swal from "sweetalert2";
import { Trash2 } from "lucide-react";
import { client, notify } from "./healper";

export default function Delete({ id, endpoint }) {
  const Deletebtn = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0000FF",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await client.delete(`${endpoint}/${id}`);

      notify(
        response.data.message,
        response.data.success
      );

      if (response.data.success) {
        await Swal.fire({
          title: "Deleted!",
          text: "Department has been deleted.",
          icon: "success",
          confirmButtonColor: "#0000FF",
        });

        window.location.reload();
      }
    } catch (error) {
      console.error("Delete Error:", error);

      notify(
        error.response?.data?.message ||
          "Internal Server Error",
        false
      );
    }
  };

  return (
    <button
      type="button"
      onClick={Deletebtn}
      title="Delete Department"
      className="
        rounded-lg
        bg-red-100
        p-2
        text-red-600
        transition
        hover:bg-red-200
      "
    >
      <Trash2 size={17} />
    </button>
  );
}