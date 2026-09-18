import { client } from "@/app/components/healper";

export const createPaymentOrder = async (booking) => {
  try {
    const response = await client.post(
      "payment/create-order",
      booking
    );

    return response.data;
  } catch (error) {
    console.error(
      "PAYMENT ORDER ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export const verifyPayment = async (paymentData) => {
  try {
    const response = await client.post(
      "payment/verify",
      paymentData
    );

    return response.data;
  } catch (error) {
    console.error(
      "PAYMENT VERIFY ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export const createCashPayment = async (booking) => {
  try {
    const response = await client.post(
      "payment/cash",
      booking
    );

    return response.data;
  } catch (error) {
    console.error(
      "CASH PAYMENT ERROR:",
      error.response?.data || error.message
    );

    console.error(
      "CASH PAYMENT STATUS:",
      error.response?.status
    );

    console.error(
      "CASH PAYMENT RESPONSE:",
      error.response?.data
    );

    console.error(
      "CASH PAYMENT REQUEST:",
      error.config?.data
    );

    throw error;
  }
};