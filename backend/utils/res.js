const sendsuccess = (res, message = "Success", data = {}) => {
  return res.status(200).json({
    success: true,
    message,
    data,
  });
};

const sendcreated = (
  res,
  message = "Created successfully",
  data = {}
) => {
  return res.status(201).json({
    success: true,
    message,
    data,
  });
};

const sendNotfound = (res, message = "Not Found") => {
  return res.status(404).json({
    success: false,
    message,
  });
};

const sendBadrequest = (res, message = "Bad Request") => {
  return res.status(400).json({
    success: false,
    message,
  });
};

const sendConflict = (res, message = "Duplicate Error") => {
  return res.status(409).json({
    success: false,
    message,
  });
};

const sendOk = (res, message = "Success") => {
  return res.status(200).json({
    success: true,
    message,
  });
};

const sendServerError = (
  res,
  message = "Internal Server Error"
) => {
  return res.status(500).json({
    success: false,
    message,
  });
};

module.exports = {
  sendsuccess,
  sendcreated,
  sendNotfound,
  sendBadrequest,
  sendConflict,
  sendOk,
  sendServerError,
};