import User from "../models/user.js";

// Get next user id
const getNextUserId = async () => {
  try {
    const result = await User.aggregate([
      { $group: { _id: null, maxId: { $max: "$userId" } } },
    ]);
    return result.length > 0 ? result[0].maxId + 1 : 1;
  } catch (err) {
    throw new Error("Error fetching next user ID"); // Throw a specific error message
  }
};

// Add new user
const addUser = async (req, res) => {
  try {
    const id = await getNextUserId();
    const {
      name,
      email,
      image,
      password,
      phoneNumber,
      RFIDCardNumber,
      travelHistory,
      paymentInformation,
    } = req.body;

    // Ensure all required fields are present
    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newUser = new User({
      userId: id,
      name,
      email,
      image,
      password,
      phoneNumber,
      RFIDCardNumber: RFIDCardNumber || undefined,
      travelHistory,
      paymentInformation,
    });
    // Save the new user
    const savedUser = await newUser.save();
    return res.status(201).json(savedUser);
  } catch (err) {
    if (err.name === "MongoError") {
      if (err.code === 11000) {
        const duplicateField = Object.keys(err.keyPattern)[0];
        const duplicateValue = err.keyValue[duplicateField];
        console.error(`Duplicate ${duplicateField} value '${duplicateValue}'`);
        return res.status(400).json({
          error: `Duplicate ${duplicateField} value '${duplicateValue}'. ${duplicateField} must be unique.`,
        });
      }
      return res.status(500).json({ error: "MongoDB Error: " + err.message });
    }

    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      console.error("Validation Errors: ", errors);
      return res
        .status(400)
        .json({ error: "Validation Error: " + errors.join(", ") });
    }

    return res
      .status(500)
      .json({ error: "Unexpected error occurred: " + err.message });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No user found" });
    }
    return res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    return res
      .status(500)
      .json({ error: "Error fetching users: " + err.message });
  }
};

//get user
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send("user not found");
    }
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send("user not found");
    }
    await user.delete();
    return res.status(200).send("user deleted");
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send("user not found");
    }
    const {
      name,
      email,
      image,
      oldPassword,
      password,
      phoneNumber,
      paymentInformation,
    } = req.body;
    if (
      !name &&
      !email &&
      !image &&
      !password &&
      !phoneNumber &&
      !paymentInformation
    ) {
      return res.status(400).send("missing required fields");
    }
    if (name) user.name = name;
    if (email) user.email = email;
    if (image) user.image = image;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (paymentInformation) user.paymentInformation = paymentInformation;
    if (password) {
      if (!oldPassword) {
        return res.status(400).send("enter the last password");
      }
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Last password is incorrect" });
      }
      user.password = password;
    }
    await user.save();
    return res.status(200).send("updated successfully");
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export { addUser, getUsers, getUser, deleteUser, updateUser };
