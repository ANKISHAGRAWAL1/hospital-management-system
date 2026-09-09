"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { notify } from "@/app/components/healper";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Status({ value, id, field, endpoint }) {
  const [status, setStatus] = useState(Boolean(value));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStatus(Boolean(value));
  }, [value]);

  const statusHandler = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const newStatus = !status;

      const response = await axios.patch(
        `${API_URL}${endpoint}/${id}/status`,
        {
          status: newStatus,
        },
        {
          withCredentials: true,
        }
      );

      notify(
        response.data?.message || "Status updated successfully",
        response.data?.success
      );

      if (response.data?.success) {
        setStatus(newStatus);
      }
    } catch (error) {
      console.error("Status Update Error:", error);

      notify(
        error.response?.data?.message ||
          "Unable to update department status",
        false
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={statusHandler}
      disabled={loading}
      className={`
        min-w-[90px]
        h-8
        px-3
        rounded-lg
        text-[11px]
        font-semibold
        border
        transition-all
        duration-200
        hover:shadow-md
        active:scale-95
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${
          status
            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
            : "bg-rose-50 border-rose-200 text-rose-600"
        }
      `}
    >
      <div className="flex items-center justify-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${
            status ? "bg-emerald-500" : "bg-rose-500"
          }`}
        />

        {status ? "Active" : "Inactive"}
      </div>
    </button>
  );
}