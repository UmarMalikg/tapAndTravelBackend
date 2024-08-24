import Bus from "../models/bus.js";
import Route from "../models/route.js";

// Get next route id
const getNextRouteId = async () => {
  try {
    const result = await Route.aggregate([
      { $group: { _id: null, maxId: { $max: "$routeId" } } },
    ]);
    return result.length > 0 ? result[0].maxId + 1 : 1;
  } catch (err) {
    throw new Error("Error fetching next route ID"); // Throw a specific error message
  }
};

// Add new route
const addRoute = async (req, res) => {
  try {
    const id = await getNextRouteId();
    const { startLocation, endLocation, schedule } = req.body;

    if (!startLocation || !endLocation) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newRoute = new Route({
      routeId: id,
      startLocation,
      endLocation,
      schedule,
    });

    const savedRoute = await newRoute.save(); // Save the new route document
    return res.status(201).json(savedRoute);
  } catch (err) {
    console.error("Error Details: ", err); // Log the error for debugging
    return res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
};

// Get all routes
const getRoutes = async (req, res) => {
  try {
    const routes = await Route.find();

    if (!routes || routes.length === 0) {
      return res.status(404).json({ error: "No routes found" });
    }

    return res.status(200).json(routes);
  } catch (err) {
    console.error("Error Details: ", err); // Log the error for debugging
    return res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
};

//get route
const getRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const route = await Route.findByID(id);
    if (!route) {
      return res.status(404).send("route not found");
    }
    return res.status(200).json(route);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// delete route
const deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const route = await Route.findByID(id);
    if (!route) {
      return res.status(404).send("route not found");
    }
    const busses = await Bus.find({ routeId: id });
    if (busses.length > 0) {
      return res
        .status(403)
        .send(
          "this route is linked with busses, please delete those busses and then try again"
        );
    }
    await route.delete();
    return res.status(201).send("route deleted");
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// update route
const updateRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const route = await Route.findByID(id);
    if (!route) {
      return res.status(404).send("route not found");
    }
    const { startLocation, endLocation, schedule } = req.body;
    if (startLocation || endLocation) {
      const busses = await Bus.find({ routeId: id });
      const serviceIds = [...new Set(busses.map((bus) => bus.serviceId))];
      const services = await BusService.find({ _id: { $in: serviceIds } });
      const oldPattern = `${route.startLocation}-${route.endLocation}`;
      const newPattern = "";
      if (startLocation && endLocation) {
        newPattern = `${startLocation}-${endLocation}`;
        route.startLocation = startLocation;
        route.endLocation = endLocation;
      } else if (startLocation) {
        newPattern = `${startLocation}-${route.endLocation}`;
        route.startLocation = startLocation;
      } else {
        newPattern = `${route.startLocation}-${endLocation}`;
        route.endLocation = endLocation;
      }
      services.forEach((service) => {
        service.scheduleInformation = service.scheduleInformation.replace(
          oldPattern,
          newPattern
        );
      });
      await Promise.all(services.map((service) => service.save()));
    }
    if (schedule) route.schedule = schedule;
    await route.save();
    return res.status(201).send("updated successfully");
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export { addRoute, getRoutes, getRoute, deleteRoute, updateRoute };
