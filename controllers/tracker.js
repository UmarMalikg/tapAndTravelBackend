import Bus from "../models/bus.js";
import Tracker from "../models/tracker.js";

// Get next Tracker id
const getNextTrackerId = async () => {
  try {
    const result = await Tracker.aggregate([
      { $group: { _id: null, maxId: { $max: "$trackerId" } } },
    ]);
    return result.length > 0 ? result[0].maxId + 1 : 1;
  } catch (err) {
    throw new Error("Error fetching next admin ID");
  }
};

// add new tracker
const addTracker = async (req, res) => {
  try {
    const id = await getNextTrackerId();
    const busId = req.body;
    if (!busId) {
      return res.status(400).json({ message: "Bus id required " });
    }

    const bus = await Bus.findById(busId);
    if (!bus || bus.length === 0) {
      return res
        .status(404)
        .json({ message: "Bus with this id does not exists" });
    }
    const newTracker = new Tracker({
      trackerId: id,
      busId,
    });
    const savedTracker = await newTracker.save();
    return res.status(201).json(savedTracker);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// get trackers
const getTrackers = async (req, res) => {
  try {
    const trackers = await Tracker.find();
    if (!trackers || trackers.length === 0) {
      return res.status(404).json({ message: "trackers not found" });
    }
    return res.status(200).json(trackers);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//get tracker by id
const getTracker = async (req, res) => {
  try {
    const { id } = req.params;
    const tracker = await Tracker.findById(id);
    if (!tracker) {
      return res.status(404).json({ message: "tracker not found" });
    }
    return res.status(200).json(tracker);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// delete tracker
const deleteTracker = async (req, res) => {
  try {
    const { id } = req.params;
    const tracker = await Tracker.findById(id);
    if (!tracker) {
      return res.status(404).json({ message: "tracker not found" });
    }
    await Tracker.findByIdAndDelete(id);
    return res.status(201).send("deleted successfully");
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// update tracker
const updateTracker = async (req, res) => {
  try {
    const { id } = req.params;
    const tracker = await Tracker.findById(id);
    if (!tracker) {
      return res.status(404).send("tracker not found");
    }
    const { busId } = req.body;
    if (!busId) {
      return res.status(404).send("Missing required fields");
    }
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).send("bus not found");
    }
    tracker.busId = busId;
    await tracker.save();
    return res.status(200).send("updated successfully");
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export { addTracker, getTrackers, getTracker, deleteTracker, updateTracker };
