"use client";

import { useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  CalendarDays,
  Stethoscope,
  Building2,
  GraduationCap,
  BriefcaseMedical,
  IdCard,
  MapPin,
  Clock3,
  IndianRupee,
  Camera,
  Pencil,
  Save,
  LockKeyhole,
} from "lucide-react";

export default function DoctorProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Dr. Rahul Sharma",
    email: "rahul.sharma@gmail.com",
    phone: "+91 98765 43210",
    gender: "Male",
    dob: "15 June 1988",
    doctorId: "DOC-1001",
    specialization: "Cardiologist",
    department: "Cardiology",
    qualification: "MBBS, MD",
    experience: "10 Years",
    registration: "RJ-MED-12345",
    hospital: "City Care Hospital",
    room: "Room 204",
    fee: "800",
    location: "Jaipur, Rajasthan",
    availableDays: "Monday, Tuesday, Wednesday, Friday",
    startTime: "10:00 AM",
    endTime: "04:00 PM",
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const inputClass =
    "w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-gray-500";

  const labelClass = "block text-sm text-gray-400 mb-2";

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">My Profile</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your personal and professional information
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center justify-center gap-2 bg-white text-black px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
          >
            <Pencil size={16} />
            Edit Profile
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-2 bg-white text-black px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
          >
            <Save size={16} />
            Save Changes
          </button>
        )}
      </div>

      {/* Profile Top Card */}
      <div className="bg-[#0b0b0b] border border-gray-800 rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Profile Image */}
          <div className="relative w-fit">
            <div className="w-28 h-28 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center overflow-hidden">
              <UserRound size={55} className="text-gray-500" />
            </div>

            {isEditing && (
              <button
                title="Change Profile Photo"
                className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200"
              >
                <Camera size={17} />
              </button>
            )}
          </div>

          {/* Doctor Basic Info */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{profile.name}</h2>

            <p className="text-gray-400 text-sm mt-1">
              {profile.specialization} • {profile.department}
            </p>

            <div className="flex flex-wrap gap-3 mt-4">
              <span className="flex items-center gap-2 text-xs text-gray-400 bg-black border border-gray-800 px-3 py-2 rounded-lg">
                <IdCard size={14} />
                {profile.doctorId}
              </span>

              <span className="flex items-center gap-2 text-xs text-gray-400 bg-black border border-gray-800 px-3 py-2 rounded-lg">
                <BriefcaseMedical size={14} />
                {profile.experience}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-[#0b0b0b] border border-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <UserRound size={20} className="text-gray-400" />
          <h2 className="text-lg font-semibold">Personal Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Name */}
          <div>
            <label className={labelClass}>Full Name</label>

            {isEditing ? (
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className={inputClass}
              />
            ) : (
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <UserRound size={17} className="text-gray-500" />
                {profile.name}
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className={labelClass}>Email Address</label>

            {isEditing ? (
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className={inputClass}
              />
            ) : (
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Mail size={17} className="text-gray-500" />
                {profile.email}
              </div>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className={labelClass}>Phone Number</label>

            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className={inputClass}
              />
            ) : (
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Phone size={17} className="text-gray-500" />
                {profile.phone}
              </div>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className={labelClass}>Gender</label>

            {isEditing ? (
              <select
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <div className="text-sm text-gray-300">{profile.gender}</div>
            )}
          </div>

          {/* DOB */}
          <div>
            <label className={labelClass}>Date of Birth</label>

            {isEditing ? (
              <input
                type="date"
                name="dob"
                value="1988-06-15"
                className={inputClass}
                readOnly
              />
            ) : (
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <CalendarDays size={17} className="text-gray-500" />
                {profile.dob}
              </div>
            )}
          </div>

          {/* Location */}
          <div>
            <label className={labelClass}>Location</label>

            {isEditing ? (
              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleChange}
                className={inputClass}
              />
            ) : (
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <MapPin size={17} className="text-gray-500" />
                {profile.location}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div className="bg-[#0b0b0b] border border-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Stethoscope size={20} className="text-gray-400" />
          <h2 className="text-lg font-semibold">
            Professional Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Doctor ID */}
          <div>
            <label className={labelClass}>Doctor ID</label>

            <div className="flex items-center gap-3 text-sm text-gray-300">
              <IdCard size={17} className="text-gray-500" />
              {profile.doctorId}
            </div>
          </div>

          {/* Specialization */}
          <div>
            <label className={labelClass}>Specialization</label>

            {isEditing ? (
              <input
                type="text"
                name="specialization"
                value={profile.specialization}
                onChange={handleChange}
                className={inputClass}
              />
            ) : (
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Stethoscope size={17} className="text-gray-500" />
                {profile.specialization}
              </div>
            )}
          </div>

          {/* Department */}
          <div>
            <label className={labelClass}>Department</label>

            {isEditing ? (
              <select
                name="department"
                value={profile.department}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Dermatology">Dermatology</option>
                <option value="General Medicine">General Medicine</option>
                <option value="Pediatrics">Pediatrics</option>
              </select>
            ) : (
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Building2 size={17} className="text-gray-500" />
                {profile.department}
              </div>
            )}
          </div>

          {/* Qualification */}
          <div>
            <label className={labelClass}>Qualification</label>

            {isEditing ? (
              <input
                type="text"
                name="qualification"
                value={profile.qualification}
                onChange={handleChange}
                className={inputClass}
              />
            ) : (
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <GraduationCap size={17} className="text-gray-500" />
                {profile.qualification}
              </div>
            )}
          </div>

          {/* Experience */}
          <div>
            <label className={labelClass}>Experience</label>

            {isEditing ? (
              <input
                type="text"
                name="experience"
                value={profile.experience}
                onChange={handleChange}
                className={inputClass}
              />
            ) : (
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <BriefcaseMedical size={17} className="text-gray-500" />
                {profile.experience}
              </div>
            )}
          </div>

          {/* Registration */}
          <div>
            <label className={labelClass}>Registration Number</label>

            {isEditing ? (
              <input
                type="text"
                name="registration"
                value={profile.registration}
                onChange={handleChange}
                className={inputClass}
              />
            ) : (
              <div className="text-sm text-gray-300">
                {profile.registration}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hospital Information */}
      <div className="bg-[#0b0b0b] border border-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Building2 size={20} className="text-gray-400" />
          <h2 className="text-lg font-semibold">Hospital Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Hospital */}
          <div>
            <label className={labelClass}>Hospital / Clinic</label>

            {isEditing ? (
              <input
                type="text"
                name="hospital"
                value={profile.hospital}
                onChange={handleChange}
                className={inputClass}
              />
            ) : (
              <div className="text-sm text-gray-300">
                {profile.hospital}
              </div>
            )}
          </div>

          {/* Room */}
          <div>
            <label className={labelClass}>Room Number</label>

            {isEditing ? (
              <input
                type="text"
                name="room"
                value={profile.room}
                onChange={handleChange}
                className={inputClass}
              />
            ) : (
              <div className="text-sm text-gray-300">{profile.room}</div>
            )}
          </div>

          {/* Fee */}
          <div>
            <label className={labelClass}>Consultation Fee</label>

            {isEditing ? (
              <input
                type="number"
                name="fee"
                value={profile.fee}
                onChange={handleChange}
                className={inputClass}
              />
            ) : (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <IndianRupee size={16} className="text-gray-500" />
                {profile.fee}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="bg-[#0b0b0b] border border-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Clock3 size={20} className="text-gray-400" />
          <h2 className="text-lg font-semibold">Availability</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Available Days */}
          <div className="md:col-span-1">
            <label className={labelClass}>Available Days</label>

            {isEditing ? (
              <input
                type="text"
                name="availableDays"
                value={profile.availableDays}
                onChange={handleChange}
                className={inputClass}
              />
            ) : (
              <div className="text-sm text-gray-300">
                {profile.availableDays}
              </div>
            )}
          </div>

          {/* Start Time */}
          <div>
            <label className={labelClass}>Start Time</label>

            {isEditing ? (
              <input
                type="text"
                name="startTime"
                value={profile.startTime}
                onChange={handleChange}
                className={inputClass}
              />
            ) : (
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Clock3 size={17} className="text-gray-500" />
                {profile.startTime}
              </div>
            )}
          </div>

          {/* End Time */}
          <div>
            <label className={labelClass}>End Time</label>

            {isEditing ? (
              <input
                type="text"
                name="endTime"
                value={profile.endTime}
                onChange={handleChange}
                className={inputClass}
              />
            ) : (
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Clock3 size={17} className="text-gray-500" />
                {profile.endTime}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-[#0b0b0b] border border-gray-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <LockKeyhole size={20} className="text-gray-400" />
          <h2 className="text-lg font-semibold">Account Settings</h2>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium text-white">
              Change Password
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              Update your account password for better security.
            </p>
          </div>

          <button
            onClick={() => alert("Change password page coming soon")}
            className="border border-gray-700 px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white hover:text-black transition"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}