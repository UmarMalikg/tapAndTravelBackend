import Bus from "../models/bus.js";
import BusService from "../models/busService.js";
import Route from "../models/route.js";

// Get next bus id
const getNextBusId = async () => {
  try {
    const result = await Bus.aggregate([
      { $group: { _id: null, maxId: { $max: "$busId" } } },
    ]);
    return result.length > 0 ? result[0].maxId + 1 : 1;
  } catch (err) {
    throw new Error("Error fetching next bus ID"); // Throw a specific error message
  }
};

// Add new Bus
const addBus = async (req, res) => {
  try {
    const id = await getNextBusId();
    const { serviceId, capacity, routeId } = req.body;

    if (!serviceId || !capacity || !routeId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ error: "No route exists with this id" });
    }

    const service = await BusService.findById(serviceId);
    if (!service) {
      return res.status(404).json({ error: "No service exists with this id" });
    }

    service.busFleetDetails = [...service.busFleetDetails, `BusID: ${id}`];
    service.scheduleInformation = [
      ...service.scheduleInformation,
      `${route.startLocation}-${route.endLocation}`,
    ];

    await service.save(); // Save the updated service document

    const newBus = new Bus({
      busId: id,
      serviceId,
      capacity,
      routeId,
    });

    const savedBus = await newBus.save(); // Save the new bus document
    return res.status(201).json(savedBus);
  } catch (err) {
    console.error("Error Details: ", err); // Log the error for debugging

    return res
      .status(500)
      .json({ error: "Internal server error", err: err.message });
  }
};

//get buses
const getBusses = async (req, res) => {
  try {
    const busses = await Bus.find();
    if (!busses || busses.length === 0) {
      return res.status(404).json({ error: "no bus found" });
    }
    return res.status(200).json(busses);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//get bus by id
const getBus = async (req, res) => {
  try {
    const { id } = req.params;
    const bus = await Bus.findById(id);
    if (!bus) {
      return res.status(404).json({ error: "bus not found" });
    }
    return res.status(200).json(bus);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//delete bus
const deleteBus = async (req, res) => {
  try {
    const { id } = req.params;
    const bus = await Bus.findById(id);
    if (!bus) {
      return res.status(404).json({ error: "Bus not found" });
    }
    const busIdString = `BusID: ${bus.busId}`;
    const route = await Route.findById(bus.routeId);
    const scheduleInformationString = `${route.startLocation}-${route.endLocation}`;
    const service = await BusService.findById(bus.serviceId);
    service.busFleetDetails = await service.busFleetDetails.filter(
      (item) => item !== busIdString
    );
    service.scheduleInformation = await service.scheduleInformation.filter(
      (item) => item !== scheduleInformationString
    );
    await service.save();
    await Bus.findByIdAndDelete(id);
    return res.status(200).json({ message: "Bus Deleted Successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//update bus data
const updateBus = async (req, res) => {
  try {
    const { id } = req.params;

    const bus = await Bus.findById(id); // finding the bus
    if (!bus) return res.status(404).json({ message: "Bus not found" }); // if bus does not exist

    const { serviceId, capacity, routeId } = req.body;

    // if service id provided
    if (serviceId) {
      const newService = await BusService.findById(serviceId); // finding the new service if serviceId provided
      if (!newService)
        return res.status(404).json({ message: "Service not found" }); // if there's no service with that id

      const oldService = await BusService.findById(bus.serviceId); //finding the old service
      if (!oldService)
        return res.status(404).json({ message: "Previous service not found" }); //if there's no service for that bus

      // Update old service
      oldService.busFleetDetails = oldService.busFleetDetails.filter(
        (item) => item !== `BusID: ${bus.busId}`
      );

      const oldRoute = await Route.findById(bus.routeId); //finding the old route
      // if route exists
      if (oldRoute) {
        // updating the schedule informatio field
        oldService.scheduleInformation = oldService.scheduleInformation.filter(
          (item) => item !== `${oldRoute.startLocation}-${oldRoute.endLocation}`
        );
      }

      await oldService.save(); //saving the old service

      // Update new service
      newService.busFleetDetails.push(`BusID: ${bus.busId}`);
      newService.scheduleInformation.push(
        `${(await Route.findById(routeId)).startLocation}-${
          (await Route.findById(routeId)).endLocation
        }`
      );
      await newService.save(); //saving the new service

      bus.serviceId = serviceId; //updating service id field in bus document
    }

    // if capacity provided
    if (capacity) {
      if (typeof capacity !== "number" || capacity <= 0) {
        return res.status(400).json({ message: "Invalid capacity" });
      }
      bus.capacity = capacity; //updating the capacity
    }

    // if route id provided
    if (routeId) {
      const newRoute = await Route.findById(routeId); //finding the new route
      if (!newRoute)
        return res.status(404).json({ message: "Route not found" }); //if no route on that id exists

      const oldRoute = await Route.findById(bus.routeId); //finding the old route
      if (!oldRoute)
        return res.status(404).json({ message: "Previous route not found" }); //if no route on that id exists

      const newService = await BusService.findById(bus.serviceId); // getting the new service for updating
      if (!newService)
        return res.status(404).json({ message: "Service not found" }); // if no service on that id exists

      const oldPattern = `${oldRoute.startLocation}-${oldRoute.endLocation}`; //old route info
      const newPattern = `${newRoute.startLocation}-${newRoute.endLocation}`; //new route info
      // Update schedule information in service
      if (newService.scheduleInformation.includes(oldPattern)) {
        newService.scheduleInformation = newService.scheduleInformation.replace(
          oldPattern,
          newPattern
        );
      }
      await newService.save(); //saving the newService

      bus.routeId = routeId; //updating the route id in bus document
    }

    await bus.save(); //saving the bus data
    return res.status(200).json({ message: "Updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { addBus, getBusses, getBus, deleteBus, updateBus };
