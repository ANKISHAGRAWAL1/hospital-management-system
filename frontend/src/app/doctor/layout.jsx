import DoctorSidebar from "@/components/doctor/DoctorSidebar";
import DoctorHeader from "@/components/doctor/DoctorHeader";

export default function DoctorLayout({ children }) {
  return (
    <div className="min-h-screen bg-black">

      <DoctorSidebar />

      <DoctorHeader />

      <main className="ml-64 pt-16 min-h-screen bg-black">
        {children}
      </main>

    </div>
  );
}