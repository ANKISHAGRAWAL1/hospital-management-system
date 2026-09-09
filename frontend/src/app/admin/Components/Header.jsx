 
"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bell,
  Search,
  ChevronDown,
  UserRound,
  Settings,
  LogOut,
  UserCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  /* =====================================================
     CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  ===================================================== */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =====================================================
     PROFILE
  ===================================================== */

  const handleProfile = () => {
    setProfileOpen(false);
    router.push("/admin/profile");
  };

  /* =====================================================
     SETTINGS
  ===================================================== */

  const handleSettings = () => {
    setProfileOpen(false);
    router.push("/admin/settings");
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    setProfileOpen(false);

    /*
      Yahan apna logout API / cookie clear logic
      add kar sakte ho.
    */

    router.push("/admin/login");
  };

  return (
    <header
      className="
        sticky top-0 z-30
        h-[72px]
        border-b border-slate-200
        bg-white
        shadow-[0_2px_12px_rgba(15,23,42,0.06)]
      "
    >
      <div
        className="
          flex h-full items-center justify-between
          px-4 sm:px-6 lg:px-7
        "
      >
        {/* =================================================
            LEFT
        ================================================= */}

        <div className="min-w-0">
          <h1
            className="
              truncate
              text-[17px]
              font-semibold
              tracking-tight
              text-slate-800
            "
          >
            Admin Dashboard
          </h1>

          <p
            className="
              mt-0.5
              text-[11px]
              font-medium
              text-slate-500
            "
          >
            Hospital management overview
          </p>
        </div>

        {/* =================================================
            RIGHT
        ================================================= */}

        <div
          className="
            flex items-center
            gap-2 sm:gap-3
          "
        >
          {/* =================================================
              SEARCH
          ================================================= */}

          <div
            className="
              hidden lg:flex
              h-10
              w-[260px] xl:w-[300px]
              items-center
              gap-2.5
              rounded-xl
              border border-slate-200
              bg-slate-50
              px-3.5
              transition-all duration-200
              focus-within:border-emerald-400
              focus-within:bg-white
              focus-within:ring-4
              focus-within:ring-emerald-500/10
            "
          >
            <Search
              size={17}
              strokeWidth={2}
              className="shrink-0 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search patients, doctors..."
              className="
                w-full
                bg-transparent
                text-[12px]
                font-medium
                text-slate-700
                outline-none
                placeholder:text-slate-400
              "
            />

            <span
              className="
                hidden xl:block
                shrink-0
                rounded-md
                border border-slate-200
                bg-white
                px-1.5 py-0.5
                text-[9px]
                font-semibold
                text-slate-400
              "
            >
              ⌘ K
            </span>
          </div>

          {/* =================================================
              MOBILE SEARCH
          ================================================= */}

          <button
            type="button"
            title="Search"
            aria-label="Search"
            className="
              flex lg:hidden
              h-10 w-10
              items-center
              justify-center
              rounded-xl
              border border-slate-200
              bg-white
              text-slate-600
              transition-all duration-200
              hover:border-emerald-200
              hover:bg-emerald-50
              hover:text-emerald-600
            "
          >
            <Search
              size={19}
              strokeWidth={2}
            />
          </button>

          {/* =================================================
              NOTIFICATION
          ================================================= */}

          <button
            type="button"
            title="Notifications"
            aria-label="Notifications"
            className="
              relative
              flex h-10 w-10
              items-center
              justify-center
              rounded-xl
              border border-slate-200
              bg-white
              text-slate-600
              transition-all duration-200
              hover:border-emerald-200
              hover:bg-emerald-50
              hover:text-emerald-600
            "
          >
            <Bell
              size={19}
              strokeWidth={2}
            />

            {/* Notification Badge */}

            <span
              className="
                absolute
                right-[8px]
                top-[7px]
                h-[8px]
                w-[8px]
                rounded-full
                bg-red-500
                ring-2
                ring-white
              "
            />
          </button>

          {/* =================================================
              DIVIDER
          ================================================= */}

          <div
            className="
              mx-1
              hidden sm:block
              h-8
              w-px
              bg-slate-200
            "
          />

          {/* =================================================
              ADMIN PROFILE
          ================================================= */}

          <div
            ref={profileRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() =>
                setProfileOpen(!profileOpen)
              }
              className="
                group
                flex items-center
                gap-2
                rounded-xl
                border border-transparent
                px-1.5 py-1.5
                sm:px-2
                transition-all duration-200
                hover:border-slate-200
                hover:bg-slate-50
              "
            >
              {/* Avatar */}

              <div
                className="
                  flex
                  h-9 w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-emerald-50
                  text-emerald-600
                  ring-1
                  ring-emerald-100
                "
              >
                <UserRound
                  size={17}
                  strokeWidth={2}
                />
              </div>

              {/* User Details */}

              <div
                className="
                  hidden
                  text-left
                  md:block
                "
              >
                <p
                  className="
                    text-[12px]
                    font-semibold
                    leading-none
                    text-slate-800
                  "
                >
                  Admin
                </p>

                <p
                  className="
                    mt-1
                    text-[10px]
                    font-medium
                    text-slate-500
                  "
                >
                  Administrator
                </p>
              </div>

              {/* Chevron */}

              <ChevronDown
                size={15}
                strokeWidth={2}
                className={`
                  ml-0.5
                  text-slate-400
                  transition-transform duration-200
                  ${
                    profileOpen
                      ? "rotate-180 text-emerald-600"
                      : ""
                  }
                `}
              />
            </button>

            {/* =================================================
                PROFILE DROPDOWN
            ================================================= */}

            {profileOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-[52px]
                  z-50
                  w-[230px]
                  overflow-hidden
                  rounded-2xl
                  border border-slate-200
                  bg-white
                  shadow-[0_12px_35px_rgba(15,23,42,0.12)]
                "
              >
                {/* Profile Header */}

                <div
                  className="
                    border-b
                    border-slate-100
                    px-4 py-4
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex
                        h-10 w-10
                        items-center
                        justify-center
                        rounded-full
                        bg-emerald-50
                        text-emerald-600
                      "
                    >
                      <UserRound
                        size={18}
                      />
                    </div>

                    <div className="min-w-0">
                      <p
                        className="
                          truncate
                          text-[13px]
                          font-semibold
                          text-slate-800
                        "
                      >
                        Admin
                      </p>

                      <p
                        className="
                          text-[10px]
                          font-medium
                          text-slate-500
                        "
                      >
                        Administrator
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dropdown Items */}

                <div className="p-2">
                  {/* My Profile */}

                  <button
                    type="button"
                    onClick={handleProfile}
                    className="
                      flex w-full
                      items-center
                      gap-3
                      rounded-xl
                      px-3 py-2.5
                      text-left
                      text-[12px]
                      font-medium
                      text-slate-600
                      transition-all
                      hover:bg-emerald-50
                      hover:text-emerald-700
                    "
                  >
                    <UserCircle
                      size={17}
                      strokeWidth={2}
                    />

                    <span>
                      My Profile
                    </span>
                  </button>

                  {/* Settings */}

                  <button
                    type="button"
                    onClick={handleSettings}
                    className="
                      flex w-full
                      items-center
                      gap-3
                      rounded-xl
                      px-3 py-2.5
                      text-left
                      text-[12px]
                      font-medium
                      text-slate-600
                      transition-all
                      hover:bg-emerald-50
                      hover:text-emerald-700
                    "
                  >
                    <Settings
                      size={17}
                      strokeWidth={2}
                    />

                    <span>
                      Settings
                    </span>
                  </button>
                </div>

                {/* Logout */}

                <div
                  className="
                    border-t
                    border-slate-100
                    p-2
                  "
                >
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      flex w-full
                      items-center
                      gap-3
                      rounded-xl
                      px-3 py-2.5
                      text-left
                      text-[12px]
                      font-medium
                      text-red-500
                      transition-all
                      hover:bg-red-50
                      hover:text-red-600
                    "
                  >
                    <LogOut
                      size={17}
                      strokeWidth={2}
                    />

                    <span>
                      Logout
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 