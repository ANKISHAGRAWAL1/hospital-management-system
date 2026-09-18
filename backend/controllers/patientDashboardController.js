const mongoose = require("mongoose");

const User = require("../models/user");
const Appointment = require("../models/Appointment");
const Payment = require("../models/Payment");
const Prescription = require("../models/Prescription");
const Notification = require("../models/Notification");

const getPatientId = (req) => {
  return req.user?._id || req.user?.id;
};

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const getPatientDashboard = async (req, res) => {
  try {
    const patientId = getPatientId(req);

    if (!patientId) {
      return res.status(401).json({
        success: false,
        message: "Patient authentication required.",
      });
    }

    if (!isValidObjectId(patientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient authentication.",
      });
    }

    const patient = await User.findOne({
      _id: patientId,
      role: "patient",
    })
      .select(
        "name email phone dateOfBirth role isActive parentPatient isDependent"
      )
      .lean();

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    if (!patient.isActive) {
      return res.status(403).json({
        success: false,
        message: "Patient account is inactive.",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalAppointments,
      upcomingAppointmentsCount,
      completedAppointments,
      cancelledAppointments,
      prescriptionCount,
      paymentSummary,
      upcomingAppointments,
      recentAppointments,
      recentPayments,
      recentPrescriptions,
      notifications,
      unreadNotifications,
    ] = await Promise.all([
      Appointment.countDocuments({
        patient: patientId,
      }),

      Appointment.countDocuments({
        patient: patientId,
        appointmentDate: {
          $gte: today,
        },
        status: {
          $in: ["pending", "confirmed"],
        },
      }),

      Appointment.countDocuments({
        patient: patientId,
        status: "completed",
      }),

      Appointment.countDocuments({
        patient: patientId,
        status: "cancelled",
      }),

      Prescription.countDocuments({
        patient: patientId,
      }),

      Payment.aggregate([
        {
          $match: {
            patient: new mongoose.Types.ObjectId(patientId),
            status: "paid",
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: {
              $sum: "$amount",
            },
          },
        },
      ]),

      Appointment.find({
        patient: patientId,
        appointmentDate: {
          $gte: today,
        },
        status: {
          $in: ["pending", "confirmed"],
        },
      })
        .populate(
          "doctor",
          "firstName lastName profileImage specialization consultationFee"
        )
        .populate(
          "department",
          "name code image"
        )
        .sort({
          appointmentDate: 1,
          startTime: 1,
        })
        .limit(5)
        .lean(),

      Appointment.find({
        patient: patientId,
      })
        .populate(
          "doctor",
          "firstName lastName profileImage specialization consultationFee"
        )
        .populate(
          "department",
          "name code image"
        )
        .sort({
          appointmentDate: -1,
          createdAt: -1,
        })
        .limit(5)
        .lean(),

      Payment.find({
        patient: patientId,
      })
        .populate({
          path: "appointment",
          populate: [
            {
              path: "doctor",
              select:
                "firstName lastName profileImage specialization",
            },
            {
              path: "department",
              select: "name code",
            },
          ],
        })
        .sort({
          createdAt: -1,
        })
        .limit(5)
        .lean(),

      Prescription.find({
        patient: patientId,
      })
        .populate(
          "doctor",
          "firstName lastName profileImage specialization"
        )
        .populate(
          "department",
          "name code"
        )
        .populate(
          "appointment",
          "appointmentDate startTime endTime appointmentType"
        )
        .sort({
          createdAt: -1,
        })
        .limit(5)
        .lean(),

      Notification.find({
        user: patientId,
      })
        .populate(
          "appointment",
          "appointmentDate startTime endTime appointmentType status"
        )
        .populate(
          "payment",
          "amount paymentMethod status paymentId"
        )
        .populate(
          "prescription",
          "diagnosis status createdAt"
        )
        .sort({
          createdAt: -1,
        })
        .limit(10)
        .lean(),

      Notification.countDocuments({
        user: patientId,
        isRead: false,
      }),
    ]);

    const totalPayments =
      paymentSummary.length > 0
        ? Number(paymentSummary[0].totalAmount || 0)
        : 0;

    return res.status(200).json({
      success: true,
      message:
        "Patient dashboard fetched successfully.",
      data: {
        patient,
        stats: {
          totalAppointments,
          upcomingAppointments:
            upcomingAppointmentsCount,
          completedAppointments,
          cancelledAppointments,
          prescriptions: prescriptionCount,
          totalPayments,
          unreadNotifications,
        },
        upcomingAppointments,
        recentAppointments,
        recentPayments,
        recentPrescriptions,
        notifications,
      },
    });
  } catch (error) {
    console.error(
      "Get Patient Dashboard Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch patient dashboard.",
    });
  }
};

const getPatientAppointments = async (req, res) => {
  try {
    const patientId = getPatientId(req);

    if (!patientId) {
      return res.status(401).json({
        success: false,
        message: "Patient authentication required.",
      });
    }

    if (!isValidObjectId(patientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient authentication.",
      });
    }

    const {
      status,
      appointmentType,
      fromDate,
      toDate,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {
      patient: patientId,
    };

    const allowedStatuses = [
      "pending",
      "confirmed",
      "completed",
      "cancelled",
      "no-show",
    ];

    const allowedAppointmentTypes = [
      "hospital",
      "video",
    ];

    if (status) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid appointment status.",
        });
      }

      filter.status = status;
    }

    if (appointmentType) {
      if (
        !allowedAppointmentTypes.includes(
          appointmentType
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid appointment type. Allowed values are hospital and video.",
        });
      }

      filter.appointmentType = appointmentType;
    }

    if (fromDate || toDate) {
      filter.appointmentDate = {};

      if (fromDate) {
        const startDate = new Date(fromDate);

        if (Number.isNaN(startDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid fromDate.",
          });
        }

        startDate.setHours(0, 0, 0, 0);

        filter.appointmentDate.$gte =
          startDate;
      }

      if (toDate) {
        const endDate = new Date(toDate);

        if (Number.isNaN(endDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid toDate.",
          });
        }

        endDate.setHours(
          23,
          59,
          59,
          999
        );

        filter.appointmentDate.$lte =
          endDate;
      }

      if (
        filter.appointmentDate.$gte &&
        filter.appointmentDate.$lte &&
        filter.appointmentDate.$gte >
          filter.appointmentDate.$lte
      ) {
        return res.status(400).json({
          success: false,
          message:
            "fromDate cannot be greater than toDate.",
        });
      }
    }

    const parsedPage = Number.parseInt(
      page,
      10
    );

    const parsedLimit = Number.parseInt(
      limit,
      10
    );

    if (
      !Number.isInteger(parsedPage) ||
      parsedPage < 1
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Page must be a positive number.",
      });
    }

    if (
      !Number.isInteger(parsedLimit) ||
      parsedLimit < 1 ||
      parsedLimit > 50
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Limit must be between 1 and 50.",
      });
    }

    const skip =
      (parsedPage - 1) *
      parsedLimit;

    const [
      appointments,
      totalAppointments,
      upcomingCount,
      completedCount,
      cancelledCount,
    ] = await Promise.all([
      Appointment.find(filter)
        .populate(
          "doctor",
          "firstName lastName profileImage specialization qualification experience consultationFee"
        )
        .populate(
          "department",
          "name code image description location"
        )
        .sort({
          appointmentDate: -1,
          startTime: -1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(parsedLimit)
        .lean(),

      Appointment.countDocuments(filter),

      Appointment.countDocuments({
        patient: patientId,
        appointmentDate: {
          $gte: new Date(),
        },
        status: {
          $in: ["pending", "confirmed"],
        },
      }),

      Appointment.countDocuments({
        patient: patientId,
        status: "completed",
      }),

      Appointment.countDocuments({
        patient: patientId,
        status: "cancelled",
      }),
    ]);

    const totalPages = Math.ceil(
      totalAppointments / parsedLimit
    );

    return res.status(200).json({
      success: true,
      message:
        "Patient appointments fetched successfully.",
      data: appointments,
      pagination: {
        currentPage: parsedPage,
        limit: parsedLimit,
        totalAppointments,
        totalPages,
        hasNextPage:
          parsedPage < totalPages,
        hasPreviousPage:
          parsedPage > 1,
      },
      summary: {
        upcoming: upcomingCount,
        completed: completedCount,
        cancelled: cancelledCount,
      },
    });
  } catch (error) {
    console.error(
      "Get Patient Appointments Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch patient appointments.",
    });
  }
};

const getPatientAppointmentById = async (
  req,
  res
) => {
  try {
    const patientId = getPatientId(req);
    const { appointmentId } = req.params;

    if (!patientId) {
      return res.status(401).json({
        success: false,
        message: "Patient authentication required.",
      });
    }

    if (!isValidObjectId(patientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient authentication.",
      });
    }

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID is required.",
      });
    }

    if (!isValidObjectId(appointmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID.",
      });
    }

    const appointment =
      await Appointment.findOne({
        _id: appointmentId,
        patient: patientId,
      })
        .populate(
          "doctor",
          "firstName lastName email phone profileImage specialization qualification experience consultationFee"
        )
        .populate(
          "department",
          "name code image description location"
        )
        .lean();

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message:
          "Appointment not found or you are not authorized to access it.",
      });
    }

    const payments =
      await Payment.find({
        patient: patientId,
        appointment: appointmentId,
      })
        .select(
          "amount currency paymentMethod status orderId paymentId paidAt failureReason createdAt"
        )
        .sort({
          createdAt: -1,
        })
        .lean();

    return res.status(200).json({
      success: true,
      message:
        "Appointment details fetched successfully.",
      data: {
        appointment,
        payments,
      },
    });
  } catch (error) {
    console.error(
      "Get Patient Appointment Details Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch appointment details.",
    });
  }
};

const cancelPatientAppointment = async (
  req,
  res
) => {
  try {
    const patientId = getPatientId(req);
    const { appointmentId } = req.params;
    const { cancellationReason } =
      req.body || {};

    if (!patientId) {
      return res.status(401).json({
        success: false,
        message: "Patient authentication required.",
      });
    }

    if (!isValidObjectId(patientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient authentication.",
      });
    }

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID is required.",
      });
    }

    if (!isValidObjectId(appointmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID.",
      });
    }

    if (
      cancellationReason !== undefined &&
      cancellationReason !== null &&
      typeof cancellationReason !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Cancellation reason must be a valid text value.",
      });
    }

    const reason =
      typeof cancellationReason === "string"
        ? cancellationReason.trim()
        : "";

    if (reason.length > 500) {
      return res.status(400).json({
        success: false,
        message:
          "Cancellation reason cannot exceed 500 characters.",
      });
    }

    const appointment =
      await Appointment.findOne({
        _id: appointmentId,
        patient: patientId,
      });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message:
          "Appointment not found or you are not authorized to cancel it.",
      });
    }

    if (appointment.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message:
          "This appointment has already been cancelled.",
      });
    }

    if (appointment.status === "completed") {
      return res.status(400).json({
        success: false,
        message:
          "Completed appointments cannot be cancelled.",
      });
    }

    if (appointment.status === "no-show") {
      return res.status(400).json({
        success: false,
        message:
          "No-show appointments cannot be cancelled.",
      });
    }

    const appointmentDate = new Date(
      appointment.appointmentDate
    );

    if (
      Number.isNaN(
        appointmentDate.getTime()
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Appointment contains an invalid date.",
      });
    }

    const timeParts = String(
      appointment.startTime || ""
    ).split(":");

    if (timeParts.length !== 2) {
      return res.status(400).json({
        success: false,
        message:
          "Appointment contains an invalid start time.",
      });
    }

    const hours = Number(timeParts[0]);
    const minutes = Number(timeParts[1]);

    if (
      !Number.isInteger(hours) ||
      !Number.isInteger(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Appointment contains an invalid start time.",
      });
    }

    appointmentDate.setHours(
      hours,
      minutes,
      0,
      0
    );

    if (appointmentDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message:
          "Past or already started appointments cannot be cancelled.",
      });
    }

    appointment.status = "cancelled";
    appointment.cancelledAt = new Date();

    if (reason) {
      appointment.cancellationReason =
        reason;
    } else {
      appointment.cancellationReason =
        "Cancelled by patient.";
    }

    await appointment.save();

    return res.status(200).json({
      success: true,
      message:
        "Appointment cancelled successfully.",
      data: appointment,
    });
  } catch (error) {
    console.error(
      "Cancel Patient Appointment Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to cancel appointment.",
    });
  }
};

module.exports = {
  getPatientDashboard,
  getPatientAppointments,
  getPatientAppointmentById,
  cancelPatientAppointment,
};