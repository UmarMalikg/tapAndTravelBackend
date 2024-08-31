import Ticket from "../models/ticket.js";
import Bus from "../models/bus.js";
import Route from "../models/route.js";

// Get next ticket id
const getNextTicketId = async () => {
  try {
    const result = await Ticket.aggregate([
      { $group: { _id: null, maxId: { $max: "$ticketId" } } },
    ]);
    return result.length > 0 ? result[0].maxId + 1 : 1;
  } catch (err) {
    throw new Error("Error fetching next ticket ID"); // Throw a specific error message
  }
};

// Add new ticket
const addTicket = async (req, res) => {
  try {
    const id = await getNextTicketId();
    const { busId, routeId, fare } = req.body;

    // Ensure all required fields are present
    if (!busId || !routeId || fare === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    // is bus exists
    const isBusExists = await Bus.findById(busId);
    if (!isBusExists) {
      return res.status(404).json({ error: "Bus with this id not exists" });
    }
    // is oute exists
    const isRouteExists = await Route.findById(routeId);
    if (!isRouteExists) {
      return res.status(404).json({ error: "Route with this id not exists" });
    }

    // Create a new ticket instance
    const newTicket = new Ticket({
      ticketId: id,
      busId,
      routeId,
      fare,
    });
    // Save the new ticket document
    const savedTicket = await newTicket.save();
    return res.status(201).json(savedTicket);
  } catch (err) {
    console.error("Error Details: ", err); // Log the error for debugging
    return res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
};

//get all tickets
const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find();
    if (!tickets || tickets.length === 0) {
      return res.status(404).json({ error: "ticket not found" });
    }
    return res.status(200).json(tickets);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//get ticket by id
const getTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ error: "ticket not found" });
    }
    return res.status(200).json(ticket);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//delete ticket by id
const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ error: "ticket not found" });
    }
    await Ticket.findByIdAndDelete(id);
    return res.status(201).send("deleted successfully");
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// update ticket data
const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: "ticket not found" });
    }
    const { busId, routeId, fare } = req.body;
    if (busId) ticket.busId = busId;
    if (routeId) ticket.routeId = routeId;
    if (fare) ticket.fare = fare;
    await ticket.save();
    return res.status(201).send("updated successfully");
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export { addTicket, getTickets, getTicket, deleteTicket, updateTicket };
