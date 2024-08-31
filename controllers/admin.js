import Admin from "../models/admin.js";
import bcrypt from "bcryptjs";

// Get next Admin id
const getNextAdminId = async () => {
  try {
    const result = await Admin.aggregate([
      { $group: { _id: null, maxId: { $max: "$adminId" } } },
    ]);
    return result.length > 0 ? result[0].maxId + 1 : 1;
  } catch (err) {
    throw new Error("Error fetching next admin ID"); // Throw a specific error message
  }
};

// Add new admin
const addAdmin = async (req, res) => {
  try {
    const id = await getNextAdminId();
    const { name, email, image, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newAdmin = new Admin({
      adminId: id,
      name,
      email,
      image,
      password,
      role,
    });

    const savedAdmin = await newAdmin.save();
    return res.status(201).json(savedAdmin);
  } catch (err) {
    console.error("Error Details: ", err);

    if (err.name === "MongoError" && err.code === 11000) {
      const duplicateField = Object.keys(err.keyPattern)[0];
      const duplicateValue = err.keyValue[duplicateField];
      console.error(
        `Error: Duplicate ${duplicateField} value '${duplicateValue}'`
      );
      return res.status(400).json({
        error: `Duplicate ${duplicateField} value '${duplicateValue}'. ${duplicateField} must be unique.`,
      });
    }

    return res.status(500).json({ error: "Error creating a new admin" });
  }
};

// Get all admins
const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    if (!admins || admins.length === 0) {
      return res.status(404).json({ error: "No admins found" });
    }
    return res.status(200).json(admins);
  } catch (err) {
    console.error("Error fetching admins:", err);
    return res.status(500).json({ error: "Error fetching admins" });
  }
};

//get admin
const getAdmin = async (req, res) => {
  try {
    const id = req.params;
    const admin = await Admin.findById(id);
    if (!admin || admin.length === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }
    return res.status(200).json(admin);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//delete admin
const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    await Admin.findByIdAndDelete(id);
    return res.status(200).send( "Admin deleted successfully");
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// update admin
const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const { name, email, image, password, lastPassword } = req.body;

    // Check if at least one field is provided
    if (!name && !email && !password && !image) {
      return res.status(400).json({ message: "No fields provided for update" });
    }

    // Update admin fields
    if (name) admin.name = name;
    if (email) admin.email = email;
    if (image) admin.image = image;

    // Handle password update
    if (password) {
      if (!lastPassword) {
        return res
          .status(400)
          .json({ message: "Last password is required to update password" });
      }

      // Check if the provided lastPassword matches the stored hashed password
      const isMatch = await bcrypt.compare(lastPassword, admin.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Last password is incorrect" });
      }

      // Hash the new password and update it

      admin.password = password;
    }

    // Save the updated admin
    await admin.save();
    return res.status(200).send("Updated Successfully");
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export { addAdmin, getAdmins, getAdmin, deleteAdmin, updateAdmin };
