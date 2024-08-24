import Bus from "../models/bus.js";
import BusService from "../models/busService.js";

// Get next bus service id
const getNextBusServiceId = async () => {
  try {
    const result = await BusService.aggregate([
      { $group: { _id: null, maxId: { $max: "$serviceId" } } },
    ]);
    return result.length > 0 ? result[0].maxId + 1 : 1;
  } catch (err) {
    throw new Error("Error fetching next bus service ID"); // Throw a specific error message
  }
};

// Add new bus service
const addBusService = async (req, res) => {
  try {
    const id = await getNextBusServiceId();
    const { name, contactInformation } = req.body;

    if (!name || !contactInformation) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newBusService = new BusService({
      serviceId: id,
      name,
      contactInformation,
    });

    const savedBusService = await newBusService.save(); // Save the new bus service document
    return res.status(201).json(savedBusService);
  } catch (err) {
    console.error("Error Details: ", err); // Log the error for debugging
    return res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
};

// get bus services
const getBusServices = async (req, res) => {
  try {
    const busServices = await BusService.find();
    if (!busServices || busServices.length === 0) {
      return res.status(404).json({ error: "bus services not found" });
    }
    return res.status(200).json(busServices);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", err });
  }
};

// get bus service
const getBusService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await BusService.findById(id);
    if (!service) {
      return res.status(404).json({ error: "service not found" });
    }
    return res.status(200).json(service);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//delete bus service
const deleteBusService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await BusService.findById(id);
    if (!service) {
      return res.status(404).json({ error: "service not found" });
    }
    const busses = await Bus.find({ serviceId: id });
    if (busses.length > 0) {
      await Bus.deleteMany({ serviceId: id });
    }
    await service.delete();
    return res.status(201).json({ message: "service deleted" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//add new contact detail
const addNewContactDetailsInService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await BusService.findById(id);
    if (!service) {
      return res.status(404).json({ message: "service not found" });
    }
    const { contactInformation } = req.body;
    if (!contactInformation) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    service.contactInformation = [
      ...service.contactInformation,
      contactInformation,
    ];
    await service.save();
    return res.status(201).json({ message: "new contact added" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//delete one contact from list
const deleteOneConactFromService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await BusService.findById(id);
    if (!service) {
      return res.status(404).json({ message: "service not found" });
    }
    const { contactInformation } = req.body;
    if (!contactInformation) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    service.contactInformation = service.contactInformation.filter(
      (c) => c !== contactInformation
    );
    await service.save();
    return res.status(201).json({ message: "Deleted Conact from service" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export {
  addBusService,
  getBusServices,
  getBusService,
  deleteBusService,
  addNewContactDetailsInService,
  deleteOneConactFromService,
};
