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
const getUserAvailability = async (id, weekNo ) => {
  const availability = await Availability.find({
    user: id,
    weekNo: { $gte: weekNo, $lte: weekNo + 6 }
  });
  const userAvailabilities = {
    userId: id,
    userAvailabilities:
      availability.map(a => ({
        weekNo: a.weekNo,
        availableDays: a.availabeDays
      }),
      )
  };
  return userAvailabilities;
};

// set user availability by id
const setUserAvailability = async (id, availability) => {

  availability.forEach(async(element) => {

    // check the existance of availability
    let existingRecord = await Availability.findOne({ user: id, weekNo: element.weekNo });

    // update availability
    if (existingRecord) {
      existingRecord.availabeDays = element.availableDays;
      await existingRecord.save();
    } else {
      await Availability.create({
        user: id,
        weekNo: element.weekNo,
        availabeDays: element.availableDays
      });
    }
  });
};

// get user friends availability by id
const getUserFriendsAvailability = async (userId, weekNo) => {

  // get user availability
  const userAvailability = await Availability.find({
    user: userId,
    weekNo: { $gte: weekNo, $lte: weekNo + 6 }
  });

  // get user friends
  const friends = await User.findById(userId).populate('friends');

  // get friends availability
  // get friends availability by weekNo and group them by weekNo
  const friendsAvailability = await Availability.aggregate([
    { $lookup: {
      from: 'users',
      localField: 'user',
      foreignField: '_id',
      as: 'friends'
    }
    },
    { $match: { user: { $in: friends.friends } , weekNo: { $gte: Number(weekNo), $lte: Number(weekNo) + 6  } } },
    { $group: { _id: '$weekNo', availability: { $push: '$$ROOT' } } },
    { $project: { _id: 0, weekNo: '$_id', availability: 1 } }
  ]);

  if (!friendsAvailability) throw new Error('Friends availability not found');
  const availabeFrinds = [];

  friendsAvailability.map(fa => {
    const userWeekAvailability = userAvailability.find(ua => ua.weekNo === fa.weekNo);
    availabeFrinds.push({
      weekNo: fa.weekNo,
      userAvailability: userWeekAvailability.availabeDays,
      friendsAvailability: fa.availability.map(wa => {
        return {
          friends: {
            id: wa.friends[0]._id,
            firstname: wa.friends[0].firstname,
            lastname: wa.friends[0].lastname
          },
          friendsAvailableDays: wa.availabeDays,
          // check if the user available days has any day which is also on friends available days
          // if yes then return the day else return empty array
          matchDays: wa.availabeDays.filter(d => userWeekAvailability.availabeDays.includes(d))
        };
      })
    });
  }
  );
  return availabeFrinds;

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