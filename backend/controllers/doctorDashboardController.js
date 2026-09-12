const getDoctorDashboard = async (req, res) => {
  try {
    // Temporary dashboard data
    const dashboardData = {
      totalPatients: 24,
      todayAppointments: 6,
      pendingAppointments: 3,
      completedAppointments: 12,
    };

    return res.status(200).json({
      success: true,
      message: "Doctor dashboard data fetched successfully",
      data: dashboardData,
    });
  } catch (error) {
    console.error("DOCTOR DASHBOARD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctor dashboard",
    });
  }
};

module.exports = {
  getDoctorDashboard,
};