"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Pill,
  MessageSquare,
  CreditCard,
  Check,
  CheckCheck,
  Search,
  X,
  ChevronRight,
} from "lucide-react";

const initialNotifications = [
  {
    id: 1,
    type: "appointment",
    title: "Appointment Reminder",
    message:
      "Your appointment with Dr. Rahul Sharma is tomorrow at 10:30 AM.",
    date: "25 Aug 2026",
    time: "10:20 AM",
    unread: true,
    priority: "High",
  },
  {
    id: 2,
    type: "report",
    title: "Lab Report Available",
    message:
      "Your Complete Blood Count (CBC) report is now available to view.",
    date: "25 Aug 2026",
    time: "08:45 AM",
    unread: true,
    priority: "Normal",
  },
  {
    id: 3,
    type: "prescription",
    title: "Prescription Updated",
    message:
      "Dr. Rahul Sharma has added a new prescription to your medical record.",
    date: "24 Aug 2026",
    time: "04:30 PM",
    unread: true,
    priority: "Normal",
  },
  {
    id: 4,
    type: "doctor",
    title: "Message from Doctor",
    message:
      "Dr. Amit Verma has added a follow-up note to your consultation.",
    date: "23 Aug 2026",
    time: "02:15 PM",
    unread: false,
    priority: "Normal",
  },
  {
    id: 5,
    type: "billing",
    title: "Payment Receipt",
    message:
      "Your payment of ₹800 for consultation AP-20260818-1024 was successful.",
    date: "22 Aug 2026",
    time: "11:40 AM",
    unread: false,
    priority: "Normal",
  },
  {
    id: 6,
    type: "appointment",
    title: "Appointment Confirmed",
    message:
      "Your appointment with Dr. Neha Gupta has been successfully confirmed.",
    date: "20 Aug 2026",
    time: "05:10 PM",
    unread: false,
    priority: "Normal",
  },
  {
    id: 7,
    type: "report",
    title: "Radiology Report Processing",
    message:
      "Your MRI Brain report is currently being reviewed by the radiology department.",
    date: "19 Aug 2026",
    time: "01:20 PM",
    unread: false,
    priority: "Normal",
  },
];

const filterOptions = [
  { label: "All", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Appointments", value: "appointment" },
  { label: "Reports", value: "report" },
  { label: "Prescriptions", value: "prescription" },
  { label: "Messages", value: "doctor" },
  { label: "Billing", value: "billing" },
];

export default function PatientNotificationsPage() {
  const [notifications, setNotifications] =
    useState(initialNotifications);

  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedNotification, setSelectedNotification] =
    useState(null);

  const unreadCount = notifications.filter(
    (item) => item.unread
  ).length;

  const filteredNotifications = useMemo(() => {
    const query = search.toLowerCase().trim();

    return notifications.filter((notification) => {
      let matchesFilter = true;

      if (activeFilter === "unread") {
        matchesFilter = notification.unread;
      } else if (activeFilter !== "all") {
        matchesFilter =
          notification.type === activeFilter;
      }

      const matchesSearch =
        !query ||
        notification.title
          .toLowerCase()
          .includes(query) ||
        notification.message
          .toLowerCase()
          .includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [notifications, activeFilter, search]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) =>
      prev.filter(
        (notification) => notification.id !== id
      )
    );

    setSelectedNotification(null);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="p-4 sm:p-6">

        {/* PAGE HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center">
                <Bell
                  size={19}
                  className="text-gray-400"
                />
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-semibold">
                  Notifications
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Stay updated with your appointments,
                  reports and account activity.
                </p>
              </div>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-800 text-sm text-gray-400 hover:text-white hover:bg-gray-900 transition"
            >
              <CheckCheck size={16} />
              Mark all as read
            </button>
          )}
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <SummaryCard
            title="Total Notifications"
            value={notifications.length}
            icon={Bell}
          />

          <SummaryCard
            title="Unread"
            value={unreadCount}
            icon={Clock3}
          />

          <SummaryCard
            title="Read"
            value={notifications.length - unreadCount}
            icon={CheckCircle2}
          />
        </div>

        {/* MAIN */}
        <div className="border border-gray-800 bg-[#080808] rounded-xl">

          {/* SEARCH */}
          <div className="p-4 sm:p-6 border-b border-gray-800">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search notifications..."
                className="w-full bg-black border border-gray-800 rounded-lg pl-10 pr-10 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-gray-600"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* FILTERS */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-800 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {filterOptions.map((filter) => {
                const count =
                  filter.value === "all"
                    ? notifications.length
                    : filter.value === "unread"
                    ? unreadCount
                    : notifications.filter(
                        (item) =>
                          item.type === filter.value
                      ).length;

                return (
                  <button
                    key={filter.value}
                    onClick={() =>
                      setActiveFilter(filter.value)
                    }
                    className={`px-3 py-2 rounded-lg text-xs border transition ${
                      activeFilter === filter.value
                        ? "bg-white text-black border-white"
                        : "bg-black text-gray-500 border-gray-800 hover:text-white hover:bg-gray-900"
                    }`}
                  >
                    {filter.label}

                    <span
                      className={`ml-2 ${
                        activeFilter === filter.value
                          ? "text-black"
                          : "text-gray-700"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* LIST */}
          <div className="p-4 sm:p-6">
            {filteredNotifications.length > 0 ? (
              <div className="space-y-3">
                {filteredNotifications.map(
                  (notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onRead={() =>
                        markAsRead(notification.id)
                      }
                      onView={() => {
                        markAsRead(notification.id);
                        setSelectedNotification(
                          notification
                        );
                      }}
                    />
                  )
                )}
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </main>

      {/* MODAL */}
      {selectedNotification && (
        <NotificationModal
          notification={selectedNotification}
          onClose={() =>
            setSelectedNotification(null)
          }
          onDelete={() =>
            deleteNotification(
              selectedNotification.id
            )
          }
        />
      )}
    </div>
  );
}

/* ================================= */
/* NOTIFICATION CARD */
/* ================================= */

function NotificationCard({
  notification,
  onRead,
  onView,
}) {
  const Icon = getNotificationIcon(
    notification.type
  );

  return (
    <div
      className={`border rounded-xl p-4 sm:p-5 transition ${
        notification.unread
          ? "border-gray-700 bg-gray-900/30"
          : "border-gray-800 bg-black"
      }`}
    >
      <div className="flex items-start gap-4">

        {/* ICON */}
        <div
          className={`w-11 h-11 rounded-lg border flex items-center justify-center shrink-0 ${
            notification.unread
              ? "bg-gray-900 border-gray-700"
              : "bg-black border-gray-800"
          }`}
        >
          <Icon
            size={19}
            className={
              notification.unread
                ? "text-gray-300"
                : "text-gray-600"
            }
          />
        </div>

        {/* CONTENT */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                {notification.unread && (
                  <span className="w-2 h-2 rounded-full bg-white" />
                )}

                <h3
                  className={`text-sm ${
                    notification.unread
                      ? "font-semibold text-white"
                      : "font-medium text-gray-400"
                  }`}
                >
                  {notification.title}
                </h3>
              </div>

              <p className="text-xs text-gray-500 mt-2 leading-5">
                {notification.message}
              </p>
            </div>

            {notification.priority === "High" && (
              <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] bg-red-500/10 text-red-400 border border-red-500/20">
                Important
              </span>
            )}
          </div>

          {/* META */}
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <span className="flex items-center gap-1.5 text-[11px] text-gray-600">
              <CalendarDays size={12} />
              {notification.date}
            </span>

            <span className="flex items-center gap-1.5 text-[11px] text-gray-600">
              <Clock3 size={12} />
              {notification.time}
            </span>

            <span className="text-[10px] px-2 py-1 rounded-full bg-gray-900 border border-gray-800 text-gray-600 capitalize">
              {getTypeLabel(notification.type)}
            </span>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={onView}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-800 text-xs text-gray-400 hover:text-white hover:bg-gray-900 transition"
            >
              View Details
              <ChevronRight size={13} />
            </button>

            {notification.unread && (
              <button
                onClick={onRead}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-800 text-xs text-gray-500 hover:text-white hover:bg-gray-900 transition"
              >
                <Check size={13} />
                Mark as read
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================= */
/* MODAL */
/* ================================= */

function NotificationModal({
  notification,
  onClose,
  onDelete,
}) {
  const Icon = getNotificationIcon(
    notification.type
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#080808] border border-gray-800 rounded-xl overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center">
              <Icon
                size={17}
                className="text-gray-400"
              />
            </div>

            <div>
              <h2 className="text-sm font-semibold">
                Notification Details
              </h2>

              <p className="text-[10px] text-gray-600 mt-1">
                {getTypeLabel(notification.type)}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-900"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5">
          <div className="border border-gray-800 rounded-xl p-5">
            <h3 className="text-base font-semibold">
              {notification.title}
            </h3>

            <p className="text-sm text-gray-400 mt-3 leading-6">
              {notification.message}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <InfoBox
              label="Date"
              value={notification.date}
            />

            <InfoBox
              label="Time"
              value={notification.time}
            />

            <InfoBox
              label="Type"
              value={getTypeLabel(
                notification.type
              )}
            />

            <InfoBox
              label="Priority"
              value={notification.priority}
            />
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            <button
              onClick={onDelete}
              className="flex-1 py-2.5 rounded-lg border border-red-500/20 text-red-400 text-sm hover:bg-red-500/10 transition"
            >
              Delete Notification
            </button>

            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-gray-200 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================= */
/* SUMMARY CARD */
/* ================================= */

function SummaryCard({
  title,
  value,
  icon: Icon,
}) {
  return (
    <div className="border border-gray-800 bg-[#080808] rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <p className="text-2xl font-semibold mt-2">
            {value}
          </p>
        </div>

        <div className="w-10 h-10 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center">
          <Icon
            size={19}
            className="text-gray-400"
          />
        </div>
      </div>
    </div>
  );
}

/* ================================= */
/* INFO BOX */
/* ================================= */

function InfoBox({ label, value }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
      <p className="text-[10px] text-gray-600">
        {label}
      </p>

      <p className="text-xs text-gray-300 mt-1">
        {value}
      </p>
    </div>
  );
}

/* ================================= */
/* EMPTY STATE */
/* ================================= */

function EmptyState() {
  return (
    <div className="py-16 text-center">
      <div className="w-14 h-14 mx-auto rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center">
        <Bell
          size={25}
          className="text-gray-600"
        />
      </div>

      <h3 className="text-sm font-medium mt-4">
        No notifications found
      </h3>

      <p className="text-xs text-gray-600 mt-2">
        You don't have any notifications matching
        this filter.
      </p>
    </div>
  );
}

/* ================================= */
/* HELPERS */
/* ================================= */

function getNotificationIcon(type) {
  switch (type) {
    case "appointment":
      return CalendarDays;

    case "report":
      return FileText;

    case "prescription":
      return Pill;

    case "doctor":
      return MessageSquare;

    case "billing":
      return CreditCard;

    default:
      return Bell;
  }
}

function getTypeLabel(type) {
  switch (type) {
    case "appointment":
      return "Appointment";

    case "report":
      return "Medical Report";

    case "prescription":
      return "Prescription";

    case "doctor":
      return "Doctor Message";

    case "billing":
      return "Billing";

    default:
      return "General";
  }
}