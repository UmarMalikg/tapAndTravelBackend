import Payment from "../models/payment.js";
import Ticket from "../models/ticket.js";
import User from "../models/user.js";

//  get next payment id
const getNextPaymentId = async () => {
  try {
    const result = await Payment.aggregate([
      { $group: { _id: null, maxId: { $max: "$paymentId" } } },
    ]);
    return result.length > 0 ? result[0].maxId + 1 : 1;
  } catch (err) {
    throw new Error("Error fetching next admin ID"); // Throw a specific error message
  }
};

// add new payment
const addPayment = async (req, res) => {
  try {
    const id = await getNextPaymentId();
    const { userId, ticketId, transactionStatus } = req.body;
    if (!userId || !ticketId) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ error: "User with this id does not exist" });
    }
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res
        .status(404)
        .json({ error: "Ticket with this id does not exist" });
    }
    const amount = ticket.fare;
    const newPayment = new Payment({
      paymentId: id,
      userId,
      ticketId,
      amount,
      transactionStatus,
    });
    const savedPayment = await newPayment.save();
    return res.status(201).json(savedPayment);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//get all payments
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    if (!payments || payments.length === 0) {
      return res.status(404).send("payment not found");
    }
    return res.status(200).json(payments);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//get payment
const getPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).send("payment not found");
    }
    return res.status(200).json(payment);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Count total payment
const countPayment = async (req, res) => {
  try {
    // Fetch all payments
    const payments = await Payment.find();

    // Initialize total payment variable
    let tPayment = 0;

    // Calculate total payment if payments are found
    if (payments && Array.isArray(payments)) {
      payments.forEach((p) => {
        if (p.amount) {
          // Ensure 'amount' exists on each payment
          tPayment += p.amount;
        }
      });
    }

    // Return the total payment in an object
    return res.status(200).json(tPayment);
  } catch (err) {
    // Log error for debugging
    console.error("Error calculating total payment:", err.message);

    // Return a formatted error message
    return res.status(500).json({ message: "Error calculating total payment" });
  }
};

export { addPayment, getNextPaymentId, getPayments, getPayment, countPayment };
