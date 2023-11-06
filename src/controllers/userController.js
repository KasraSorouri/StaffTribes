const userServices = require('../services/userServices');

// get all users
const getAllUsers = async (req, res) => {
  const users = await userServices.getAllUsers();
  res.status(200).json({ users });
};

// get a user by id
const getUser = async (req, res) => {
  const { id: userId } = req.params;
  try {
    const user = await userServices.getUser(userId);
    res.status(200).json({ user });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// create a new user
const createUser = async (req, res) => {
  const user = req.body;
  try {
    const newUser = await userServices.createUser(user);
    res.status(201).json({ newUser });
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

// edit a user by id
const editUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = req.body;
  try {
    const updatedUser = await userServices.editUser(userId, user);
    res.status(200).json({ updatedUser });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// read availibility of a user by user id
const getUserAvailability = async (req, res) => {
  const { id: userId } = req.params;
  const weekNo = req.query.weekNo;
  try {
    const availability = await userServices.getUserAvailability(userId, weekNo);
    res.status(200).json({ availability });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// set availibility of a user by user id
const setUserAvailability = async (req, res) => {
  const { id: userId } = req.params;
  const availability = req.body.availability;
  try {
    const updatedAvailability = await userServices.setUserAvailability(userId, availability);
    res.status(200).json({ updatedAvailability });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// read availibility of friend of a user by user id
const getUserFriendsAvailability = async (req, res) => {
  const { id: userId } = req.params;
  const weekNo = req.query.weekNo;
  try {
    const availability = await userServices.getUserFriendsAvailability(userId,weekNo);
    res.status(200).json({ availability });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  editUser,
  getUserAvailability,
  setUserAvailability,
  getUserFriendsAvailability
};