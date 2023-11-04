const User = require('../models/user');
const Availability = require('../models/availability');

// get all users
const getAllUsers = async () => {
  const users = await User.find();
  return users;
};

// get user by id
const getUser = async (id) => {
  const user = await User.findById(id).populate('friends');
  if (!user) throw new Error('User not found');
  return user;
};

// create a new user
const createUser = async (user) => {
  try {
    const newUser = new User(user);
    await newUser.save();
    return newUser;
  } catch (err) {
    throw new Error(err);
  }
};

// edit a user by id
const editUser = async (id, user) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
    return updatedUser;
  } catch (err) {
    throw new Error(err);
  }
};

// get user availability by id
const getUserAvailability = async (id) => {
  const availability = await Availability.find({ user: id });
  return availability;
};

// set user availability by id
const setUserAvailability = async (id, availability) => {

  // find existing availability for user
  const filter = { user: id, weekNo: availability.weekNo };
  const updatedData = { $set: { user: id, ...availability } };

  // update existing availability
  const updatedAvailability = await Availability.findOneAndUpdate(filter, updatedData,
    { upsert: true,
      new: true ,
      runValidators: true
    });

  return updatedAvailability;
};

// get user friends availability by id
const getUserFriendsAvailability = async (id) => {

  // get user friends
  const friends = await User.findById(id).populate('friends');

  // get friends availability
  //const friendsAvailability = await Availability.find({ user: { $in: friends.friends } });
  // get friends availability by weekNo and group them by weekNo
  const friendsAvailability = await Availability.aggregate([
    { $match: { user: { $in: friends.friends }, weekNo: { $in: [44,45] }  } },
    { $group: { _id: '$weekNo', availability: { $push: '$$ROOT' } } },
    { $project: { _id: 0, weekNo: '$_id', availability: 1 } }
  ]);

  // set result
  const result = {
    userId: id,
    friendsAvailability: friendsAvailability
  };

  return result;
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