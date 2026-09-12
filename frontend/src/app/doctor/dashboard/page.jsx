 
"use client";

import { useEffect, useState } from "react";

import {
  Users,
  CalendarDays,
  Clock3,
  CircleCheck,
  Stethoscope,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import { toast } from "react-toastify";

import { client } from "@/app/components/healper";

export default function DoctorDashboardPage() {
  // ==========================================
  // DASHBOARD STATE
  // ==========================================

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ==========================================
  // FETCH DASHBOARD
  // ==========================================

  const fetchDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await client.get("/doctor/dashboard");

      console.log("DOCTOR DASHBOARD RESPONSE:", response.data);

      if (!response?.data?.success) {
        throw new Error(
          response?.data?.message ||
            "Failed to fetch dashboard"
        );
      }

      setDashboard(response.data.data);
    } catch (error) {
      console.error(
        "DOCTOR DASHBOARD ERROR:",
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

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load dashboard"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==========================================
  // LOAD DASHBOARD
  // ==========================================

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw
            size={30}
            className="animate-spin text-blue-600"
          />

          <p className="text-sm font-medium text-slate-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD ERROR
  // ==========================================

  if (!dashboard) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <AlertCircle
              size={28}
              className="text-red-500"
            />
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-900">
            Unable to load dashboard
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Something went wrong while fetching
            your dashboard data.
          </p>

          <button
            type="button"
            onClick={() => fetchDashboard()}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <RefreshCw size={16} />
            Try again
          </button>

        </div>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD CARDS
  // ==========================================

  const stats = [
    {
      title: "Total Patients",
      value: dashboard.totalPatients ?? 0,
      icon: Users,
      description: "Patients under your care",
    },
    {
      title: "Today's Appointments",
      value: dashboard.todayAppointments ?? 0,
      icon: CalendarDays,
      description: "Appointments scheduled today",
    },
    {
      title: "Pending Appointments",
      value: dashboard.pendingAppointments ?? 0,
      icon: Clock3,
      description: "Appointments waiting",
    },
    {
      title: "Completed",
      value: dashboard.completedAppointments ?? 0,
      icon: CircleCheck,
      description: "Completed consultations",
    },
  ];

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="space-y-6">

      {/* ======================================
          HEADER
      ======================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <div className="flex items-center gap-2">
            <Stethoscope
              size={22}
              className="text-blue-600"
            />

            <h1 className="text-2xl font-bold text-slate-900">
              Doctor Dashboard
            </h1>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Overview of your patients and appointments.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchDashboard(true)}
          disabled={refreshing}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}
        </button>

      </div>

      {/* ======================================
          STAT CARDS
      ======================================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                  <Icon
                    size={21}
                    className="text-blue-600"
                  />
                </div>

              </div>

              <p className="mt-4 text-xs text-slate-400">
                {stat.description}
              </p>

            </div>
          );
        })}

      </div>

      {/* ======================================
          TODAY'S OVERVIEW
      ======================================= */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* ====================================
            APPOINTMENT SUMMARY
        ===================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Today's Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Quick summary of your appointments.
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <CalendarDays
                size={19}
                className="text-blue-600"
              />
            </div>

          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500">
                Today's Appointments
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {dashboard.todayAppointments ?? 0}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500">
                Pending
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {dashboard.pendingAppointments ?? 0}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500">
                Completed
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {dashboard.completedAppointments ?? 0}
              </p>
            </div>

          </div>

        </div>

        {/* ====================================
            QUICK STATUS
        ===================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-bold text-slate-900">
            Practice Summary
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your current patient overview.
          </p>

          <div className="mt-6 flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
              <Users
                size={25}
                className="text-blue-600"
              />
            </div>

            <div>
              <p className="text-2xl font-bold text-slate-900">
                {dashboard.totalPatients ?? 0}
              </p>

              <p className="text-sm text-slate-500">
                Total patients
              </p>
            </div>

          </div>

          <div className="mt-6 border-t border-slate-100 pt-5">

            <div className="flex items-center justify-between text-sm">

              <span className="text-slate-500">
                Completed consultations
              </span>

              <span className="font-semibold text-slate-900">
                {dashboard.completedAppointments ?? 0}
              </span>

            </div>

            <div className="mt-4 flex items-center justify-between text-sm">

              <span className="text-slate-500">
                Pending appointments
              </span>

              <span className="font-semibold text-slate-900">
                {dashboard.pendingAppointments ?? 0}
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================
          TEMPORARY NOTICE
      ======================================= */}

      <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-5">

        <AlertCircle
          size={20}
          className="mt-0.5 shrink-0 text-blue-600"
        />

        <div>
          <p className="text-sm font-semibold text-blue-900">
            Dashboard API is currently using temporary data
          </p>

          <p className="mt-1 text-xs leading-5 text-blue-700">
            These statistics are coming from the temporary
            dashboard backend. Later we will connect
            patients and appointments with MongoDB to show
            real-time hospital data.
          </p>
        </div>

      </div>

    </div>
  );
}

