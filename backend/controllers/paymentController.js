const Razorpay = require("razorpay");
const crypto = require("crypto");
const mongoose = require("mongoose");

const Appointment = require("../models/Appointment");
const Payment = require("../models/Payment.js");
const Doctor = require("../models/Doctor");
const Department = require("../models/Departments");

const {
  createAppointmentRecord,
} = require("./appointmentController");

const SERVICE_FEE = 50;
const PAYMENT_HOLD_MINUTES = 10;

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =====================================================
// HELPERS
// =====================================================

const isValidTime = (time) => {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
};

const timeToMinutes = (time) => {
  const [hours, minutes] = time
    .split(":")
    .map(Number);

  return hours * 60 + minutes;
};

const normalizeId = (value) => {
  return (
    value?._id?.toString?.() ||
    value?.toString?.()
  );
};

const normalizeDate = (dateValue) => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  date.setHours(0, 0, 0, 0);

  return date;
};

// =====================================================
// VALIDATE BOOKING DATA
// =====================================================

const validateBookingData = async ({
  patientId,
  doctor,
  department,
  appointmentType,
  appointmentDate,
  startTime,
  endTime,
}) => {
  if (
    !patientId ||
    !doctor ||
    !department ||
    !appointmentType ||
    !appointmentDate ||
    !startTime ||
    !endTime
  ) {
    throw new Error(
      "Doctor, department, appointment type, date and time slot are required"
    );
  }

  const normalizedPatientId =
    normalizeId(patientId);

  const normalizedDoctorId =
    normalizeId(doctor);

  const normalizedDepartmentId =
    normalizeId(department);

  if (
    !mongoose.isValidObjectId(
      normalizedPatientId
    )
  ) {
    throw new Error("Invalid patient ID");
  }

  if (
    !mongoose.isValidObjectId(
      normalizedDoctorId
    )
  ) {
    throw new Error("Invalid doctor ID");
  }

  if (
    !mongoose.isValidObjectId(
      normalizedDepartmentId
    )
  ) {
    throw new Error(
      "Invalid department ID"
    );
  }

  if (
    !["hospital", "video"].includes(
      appointmentType
    )
  ) {
    throw new Error(
      "Appointment type must be hospital or video"
    );
  }

  const selectedDate =
    normalizeDate(appointmentDate);

  if (!selectedDate) {
    throw new Error(
      "Invalid appointment date"
    );
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    throw new Error(
      "Appointment date cannot be in the past"
    );
  }

  if (
    !isValidTime(startTime) ||
    !isValidTime(endTime)
  ) {
    throw new Error(
      "Time must be in HH:mm format"
    );
  }

  const startMinutes =
    timeToMinutes(startTime);

  const endMinutes =
    timeToMinutes(endTime);

  if (startMinutes >= endMinutes) {
    throw new Error(
      "End time must be after start time"
    );
  }

  const doctorData =
    await Doctor.findById(
      normalizedDoctorId
    );

  if (!doctorData) {
    throw new Error(
      "Doctor not found"
    );
  }

  if (!doctorData.status) {
    throw new Error(
      "Selected doctor is currently unavailable"
    );
  }

  const departmentData =
    await Department.findById(
      normalizedDepartmentId
    );

  if (!departmentData) {
    throw new Error(
      "Department not found"
    );
  }

  if (!departmentData.status) {
    throw new Error(
      "Selected department is currently unavailable"
    );
  }

  if (
    !doctorData.department ||
    doctorData.department.toString() !==
      departmentData._id.toString()
  ) {
    throw new Error(
      "Selected doctor does not belong to this department"
    );
  }

  const dayName =
    selectedDate.toLocaleDateString(
      "en-US",
      {
        weekday: "long",
      }
    );

  const availability =
    doctorData.availability?.find(
      (item) => item.day === dayName
    );

  if (!availability) {
    throw new Error(
      `Doctor is not available on ${dayName}`
    );
  }

  const typeAvailability =
    appointmentType === "hospital"
      ? availability.hospital
      : availability.video;

  if (!typeAvailability?.enabled) {
    throw new Error(
      `Doctor does not provide ${appointmentType} consultation on ${dayName}`
    );
  }

  const appointmentDuration =
    Number(
      doctorData.appointmentDuration
    );

  if (
    !appointmentDuration ||
    ![15, 30, 45, 60].includes(
      appointmentDuration
    )
  ) {
    throw new Error(
      "Doctor appointment duration is not configured correctly"
    );
  }

  const selectedDuration =
    endMinutes - startMinutes;

  if (
    selectedDuration !==
    appointmentDuration
  ) {
    throw new Error(
      `Appointment duration must be ${appointmentDuration} minutes`
    );
  }

  const selectedSlot =
    typeAvailability.slots?.find(
      (slot) => {
        if (
          !slot.startTime ||
          !slot.endTime
        ) {
          return false;
        }

        if (
          !isValidTime(
            slot.startTime
          ) ||
          !isValidTime(
            slot.endTime
          )
        ) {
          return false;
        }

        const slotStart =
          timeToMinutes(
            slot.startTime
          );

        const slotEnd =
          timeToMinutes(
            slot.endTime
          );

        return (
          startMinutes >=
            slotStart &&
          endMinutes <= slotEnd
        );
      }
    );

  if (!selectedSlot) {
    throw new Error(
      "Selected time slot is outside doctor's available hours"
    );
  }

  const workingStart =
    timeToMinutes(
      selectedSlot.startTime
    );

  if (
    (startMinutes -
      workingStart) %
      appointmentDuration !==
    0
  ) {
    throw new Error(
      "Selected time is not a valid appointment slot"
    );
  }

  return {
    patientId: normalizedPatientId,
    doctorId: normalizedDoctorId,
    departmentId:
      normalizedDepartmentId,
    appointmentType,
    appointmentDate:
      selectedDate,
    startTime,
    endTime,
    doctorData,
    departmentData,
  };
};

// =====================================================
// CHECK EXISTING APPOINTMENT
// =====================================================

const checkExistingAppointment = async ({
  doctorId,
  appointmentDate,
  startTime,
  endTime,
}) => {
  const appointment =
    await Appointment.findOne({
      doctor: doctorId,
      appointmentDate,
      status: {
        $nin: [
          "cancelled",
          "no-show",
        ],
      },
      startTime: {
        $lt: endTime,
      },
      endTime: {
        $gt: startTime,
      },
    });

  return appointment;
};

// =====================================================
// CHECK ACTIVE ONLINE PAYMENT HOLD
// =====================================================

const checkPaymentHold = async ({
  doctorId,
  appointmentDate,
  startTime,
  endTime,
  excludePaymentId = null,
}) => {
  const expiresAt = new Date(
    Date.now() -
      1000 * 60 * PAYMENT_HOLD_MINUTES
  );

  const query = {
    paymentMethod: "online",

    status: {
      $in: [
        "created",
        "pending",
      ],
    },

    createdAt: {
      $gt: expiresAt,
    },

    "bookingData.doctor": doctorId,

    "bookingData.startTime": startTime,

    "bookingData.endTime": endTime,
  };

  const startOfDay =
    new Date(appointmentDate);

  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay =
    new Date(startOfDay);

  endOfDay.setDate(
    endOfDay.getDate() + 1
  );

  query["bookingData.appointmentDate"] = {
    $gte: startOfDay.toISOString(),
    $lt: endOfDay.toISOString(),
  };

  if (
    excludePaymentId &&
    mongoose.isValidObjectId(
      excludePaymentId
    )
  ) {
    query._id = {
      $ne: excludePaymentId,
    };
  }

  return Payment.findOne(query);
};

// =====================================================
// CREATE RAZORPAY ORDER
// =====================================================

const createPaymentOrder = async (req, res) => {
  try {
    

    console.log("USER:", req.user?._id);

    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const {
      doctor,
      department,
      appointmentType,
      appointmentDate,
      startTime,
      endTime,
    } = req.body;

    const patientId = req.user._id;

    const booking = await validateBookingData({
      patientId,
      doctor,
      department,
      appointmentType,
      appointmentDate,
      startTime,
      endTime,
    });

    const existingAppointment =
      await checkExistingAppointment({
        doctorId: booking.doctorId,
        appointmentDate:
          booking.appointmentDate,
        startTime: booking.startTime,
        endTime: booking.endTime,
      });

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        message:
          "This appointment slot has already been booked. Please select another available time.",
      });
    }

    const existingHold = await checkPaymentHold({
      doctorId: booking.doctorId,
      appointmentDate:
        booking.appointmentDate,
      startTime: booking.startTime,
      endTime: booking.endTime,
    });

    if (existingHold) {
      const holdPatientId =
        existingHold.patient?._id ||
        existingHold.patient;

      const isSamePatient =
        holdPatientId &&
        String(holdPatientId) ===
          String(patientId);

      if (!isSamePatient) {
        return res.status(409).json({
          success: false,
          message:
            "This slot is temporarily reserved while another patient completes payment. Please select another available slot.",
        });
      }

      console.log(
        "ACTIVE PAYMENT HOLD BELONGS TO SAME PATIENT"
      );
    }

    const consultationFee =
      Number(
        booking.doctorData?.consultationFee ??
          booking.doctorData?.fee ??
          0
      ) || 0;

    const totalAmount =
      consultationFee + SERVICE_FEE;

    if (totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid appointment amount.",
      });
    }

    const bookingData = {
      doctor: booking.doctorId,
      department: booking.departmentId,
      appointmentType:
        booking.appointmentType,
      appointmentDate:
        booking.appointmentDate.toISOString(),
      startTime: booking.startTime,
      endTime: booking.endTime,
    };

    const order =
      await razorpay.orders.create({
        amount: Math.round(
          totalAmount * 100
        ),
        currency: "INR",
        receipt: `booking_${Date.now()}`,
        notes: {
          patientId:
            patientId.toString(),

          doctor:
            booking.doctorId.toString(),

          department:
            booking.departmentId.toString(),

          appointmentType:
            booking.appointmentType,

          appointmentDate:
            booking.appointmentDate.toISOString(),

          startTime:
            booking.startTime,

          endTime:
            booking.endTime,
        },
      });

    console.log(
      "RAZORPAY ORDER:",
      order.id
    );

    const payment =
      await Payment.create({
        appointment: null,

        patient: patientId,

        amount: totalAmount,

        currency: "INR",

        orderId: order.id,

        paymentMethod: "online",

        status: "created",

        bookingData,
      });

    return res.status(201).json({
      success: true,

      message:
        "Payment order created successfully",

      keyId:
        process.env.RAZORPAY_KEY_ID,

      orderId: order.id,

      amount: order.amount,

      currency: order.currency,

      paymentId: payment._id,

      booking: {
        doctor:
          booking.doctorId,

        department:
          booking.departmentId,

        appointmentType:
          booking.appointmentType,

        appointmentDate:
          booking.appointmentDate,

        startTime:
          booking.startTime,

        endTime:
          booking.endTime,

        consultationFee,

        serviceFee:
          SERVICE_FEE,

        totalAmount,
      },
    });
  } catch (error) {
    console.error(
      "Create Payment Order Error:",
      error
    );

    if (error.statusCode) {
      return res.status(
        error.statusCode
      ).json({
        success: false,
        message:
          error.message,
      });
    }

    if (
      error.name ===
      "ValidationError"
    ) {
      return res.status(400).json({
        success: false,
        message:
          Object.values(
            error.errors
          )
            .map(
              (err) =>
                err.message
            )
            .join(", "),
      });
    }

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to create payment order",
    });
  }
};

// =====================================================
// VERIFY RAZORPAY PAYMENT
// =====================================================

const verifyPayment = async (
  req,
  res
) => {
  try {
    console.log(
      "========== VERIFY PAYMENT =========="
    );

    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment verification details are required",
      });
    }

    // --------------------------------------------------
    // 1. Find payment
    // --------------------------------------------------

    const payment =
      await Payment.findOne({
        orderId:
          razorpay_order_id,

        patient:
          req.user._id,

        paymentMethod:
          "online",
      });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message:
          "Payment record not found",
      });
    }

    // --------------------------------------------------
    // 2. Already paid
    // --------------------------------------------------

    if (
      payment.status ===
      "paid"
    ) {
      let appointment = null;

      if (payment.appointment) {
        appointment =
          await Appointment.findById(
            payment.appointment
          )
            .populate(
              "doctor",
              "firstName lastName name specialization profileImage consultationFee"
            )
            .populate(
              "department",
              "name code"
            );
      }

      return res.status(200).json({
        success: true,
        message:
          "Payment already verified",
        payment,
        appointment,
      });
    }

    // --------------------------------------------------
    // 3. Validate booking data
    // --------------------------------------------------

    if (!payment.bookingData) {
      return res.status(400).json({
        success: false,
        message:
          "Booking information is missing from payment",
      });
    }

    const booking =
      await validateBookingData({
        patientId:
          req.user._id,

        doctor:
          payment.bookingData
            .doctor,

        department:
          payment.bookingData
            .department,

        appointmentType:
          payment.bookingData
            .appointmentType,

        appointmentDate:
          payment.bookingData
            .appointmentDate,

        startTime:
          payment.bookingData
            .startTime,

        endTime:
          payment.bookingData
            .endTime,
      });

    // --------------------------------------------------
    // 4. Verify Razorpay signature
    // --------------------------------------------------

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env
            .RAZORPAY_KEY_SECRET
        )
        .update(
          `${razorpay_order_id}|${razorpay_payment_id}`
        )
        .digest("hex");

    const signaturesMatch =
      crypto.timingSafeEqual(
        Buffer.from(
          generatedSignature
        ),
        Buffer.from(
          razorpay_signature
        )
      );

    if (!signaturesMatch) {
      payment.status =
        "failed";

      payment.failureReason =
        "Invalid payment signature";

      await payment.save();

      return res.status(400).json({
        success: false,
        message:
          "Payment verification failed",
      });
    }

    // --------------------------------------------------
    // 5. Fetch Razorpay order
    // --------------------------------------------------

    const order =
      await razorpay.orders.fetch(
        razorpay_order_id
      );

    // --------------------------------------------------
    // 6. Verify amount
    // --------------------------------------------------

    const expectedAmount =
      Math.round(
        Number(payment.amount) *
          100
      );

    if (
      Number(order.amount) !==
      expectedAmount
    ) {
      payment.status =
        "failed";

      payment.failureReason =
        "Payment amount mismatch";

      await payment.save();

      return res.status(400).json({
        success: false,
        message:
          "Payment amount verification failed",
      });
    }

    // --------------------------------------------------
    // 7. Check actual appointment again
    // --------------------------------------------------

    const existingAppointment =
      await checkExistingAppointment({
        doctorId:
          booking.doctorId,

        appointmentDate:
          booking.appointmentDate,

        startTime:
          booking.startTime,

        endTime:
          booking.endTime,
      });

    if (existingAppointment) {
      payment.status =
        "failed";

      payment.failureReason =
        "Appointment slot was booked before payment confirmation";

      await payment.save();

      return res.status(409).json({
        success: false,
        message:
          "Sorry, this slot was just booked by another patient. Your appointment could not be confirmed.",
      });
    }

    // --------------------------------------------------
    // 8. Check another active payment hold
    // --------------------------------------------------

    const anotherHold =
      await checkPaymentHold({
        doctorId:
          booking.doctorId,

        appointmentDate:
          booking.appointmentDate,

        startTime:
          booking.startTime,

        endTime:
          booking.endTime,

        excludePaymentId:
          payment._id,
      });

    if (anotherHold) {
      payment.status =
        "failed";

      payment.failureReason =
        "Another payment hold exists for this slot";

      await payment.save();

      return res.status(409).json({
        success: false,
        message:
          "Sorry, this slot is no longer available. Your appointment could not be confirmed.",
      });
    }

    // --------------------------------------------------
    // 9. Create appointment ONLY AFTER payment success
    // --------------------------------------------------

    const appointment =
      await createAppointmentRecord({
        patientId:
          req.user._id,

        doctor:
          booking.doctorId,

        department:
          booking.departmentId,

        appointmentType:
          booking.appointmentType,

        appointmentDate:
          booking.appointmentDate,

        startTime:
          booking.startTime,

        endTime:
          booking.endTime,

        status:
          "confirmed",

        paymentStatus:
          "paid",
      });

    // --------------------------------------------------
    // 10. Update payment
    // --------------------------------------------------

    payment.appointment =
      appointment._id;

    payment.paymentId =
      razorpay_payment_id;

    payment.signature =
      razorpay_signature;

    payment.status =
      "paid";

    payment.paidAt =
      new Date();

    await payment.save();

    // --------------------------------------------------
    // 11. Response
    // --------------------------------------------------

    console.log(
      "PAYMENT SUCCESS:",
      payment._id
    );

    console.log(
      "APPOINTMENT CREATED:",
      appointment._id
    );

    return res.status(200).json({
      success: true,

      message:
        "Payment successful and appointment confirmed",

      payment,

      appointment,
    });
  } catch (error) {
    console.error(
      "Verify Payment Error:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Payment verification failed",
    });
  }
};

// =====================================================
// CREATE CASH PAYMENT
// =====================================================

const createCashPayment = async (req, res) => {
  try {
    console.log("========== CASH PAYMENT START ==========");

    console.log("1. USER:", req.user?._id);

    if (!req.user?._id) {
      console.log("AUTH FAILED");

      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    console.log("2. BODY:", req.body);

    const {
      doctor,
      department,
      appointmentType,
      appointmentDate,
      startTime,
      endTime,
    } = req.body;

    if (appointmentType !== "hospital") {
      console.log("INVALID APPOINTMENT TYPE");

      return res.status(400).json({
        success: false,
        message:
          "Pay at Hospital is available only for hospital visits",
      });
    }

    console.log("3. BEFORE validateBookingData");

    const booking = await validateBookingData({
      patientId: req.user._id,
      doctor,
      department,
      appointmentType,
      appointmentDate,
      startTime,
      endTime,
    });

    console.log("4. AFTER validateBookingData");
    console.log("BOOKING:", booking);

    console.log("5. BEFORE checkExistingAppointment");

    const existingAppointment = await checkExistingAppointment({
      doctorId: booking.doctorId,
      appointmentDate: booking.appointmentDate,
      startTime: booking.startTime,
      endTime: booking.endTime,
    });

    console.log("6. AFTER checkExistingAppointment");
    console.log("EXISTING APPOINTMENT:", existingAppointment);

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        message:
          "This appointment slot has already been booked. Please select another available time.",
      });
    }

    console.log("7. BEFORE checkPaymentHold");

    const existingHold = await checkPaymentHold({
      doctorId: booking.doctorId,
      appointmentDate: booking.appointmentDate,
      startTime: booking.startTime,
      endTime: booking.endTime,
    });

    console.log("8. AFTER checkPaymentHold");
    console.log("EXISTING HOLD:", existingHold);

    if (existingHold) {
      return res.status(409).json({
        success: false,
        message:
          "This slot is temporarily reserved while another patient completes payment. Please select another available slot.",
      });
    }

    console.log("9. BEFORE AMOUNT CALCULATION");

    const consultationFee =
      Number(booking.doctorData?.consultationFee) || 0;

    const amount = consultationFee + SERVICE_FEE;

    console.log("10. CONSULTATION FEE:", consultationFee);
    console.log("11. SERVICE FEE:", SERVICE_FEE);
    console.log("12. TOTAL AMOUNT:", amount);

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment amount",
      });
    }

    console.log("13. BEFORE createAppointmentRecord");

    const appointment = await createAppointmentRecord({
      patientId: req.user._id,
      doctor: booking.doctorId,
      department: booking.departmentId,
      appointmentType: booking.appointmentType,
      appointmentDate: booking.appointmentDate,
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: "confirmed",
      paymentStatus: "unpaid",
    });

    console.log("14. AFTER createAppointmentRecord");
    console.log("APPOINTMENT:", appointment?._id);

    console.log("15. BEFORE Payment.create");

    const payment = await Payment.create({
      appointment: appointment._id,
      patient: req.user._id,
      amount,
      currency: "INR",
      orderId: null,
      paymentId: null,
      paymentMethod: "cash",
      status: "pending",

      bookingData: {
        doctor: booking.doctorId,
        department: booking.departmentId,
        appointmentType: booking.appointmentType,
        appointmentDate: booking.appointmentDate.toISOString(),
        startTime: booking.startTime,
        endTime: booking.endTime,
      },
    });

    console.log("16. AFTER Payment.create");
    console.log("PAYMENT:", payment?._id);

    console.log("17. SENDING SUCCESS RESPONSE");

    return res.status(201).json({
      success: true,
      message:
        "Your appointment has been confirmed successfully. Payment will be collected at the hospital.",
      payment,
      appointment,
    });
  } catch (error) {
    console.error("========== CASH PAYMENT ERROR ==========");
    console.error(error);

    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((err) => err.message)
          .join(", "),
      });
    }

    return res.status(400).json({
      success: false,
      message:
        error.message || "Failed to create cash payment",
    });
  }
};
// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  createPaymentOrder,
  verifyPayment,
  createCashPayment,
};