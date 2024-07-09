// import files
const { sendEmail } = require("../../../utils/email/index");

// import packages
require("dotenv").config();
const { mongoose } = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// import errors
const errorMessages = require("../errors/errors");
const { sendMessage } = require("../../../utils/Phone");
const User = require("../../../db/schemas/onboarding/user.schema");
const Config = require("../../../db/schemas/onboarding/config.schema");
const Preferences = require("../../../db/schemas/onboarding/preferences.schema");
const Traffic = require("../../../db/schemas/onboarding/traffic.schema ");
const Notification = require("../../../db/schemas/onboarding/notification.schema");
const Peers = require("../../../db/schemas/onboarding/peers.schema");


// {
//   "ProfileImage": "url",
//   "Name" : "vamsi",
//   "Contact" : "9100684109",
//   "username": "vamsi@6250",
//   "Status" : "vamsi krishna",
//   "Gender" : "Male",
//   "DOB": "12-10-1998"
// }

async function updateUser({ userId, profileImage, name, contact, userName, status, gender, dob, email }) {
  // update this data in database
  try {
    await User.updateOne(
      { _id: ObjectId(userId) },
      {
        $set: {
          profileImage,
          name,
          contact,
          userName,
          status,
          gender,
          dob,
          email
        }
      },
      { new: true }
    );

    return "Updated Successfully";
  } catch (error) {
    throw new Error(error);
  }
}

async function saveUser(o) {
  // update this data in database
  try {
    const findUser = await Traffic.findOne({ Contact: o.Contact });
    if(findUser){
      return "User Already Exists"
    } else {
      const traffic = new Traffic(o)
      traffic.save()
      return "user inserted Successfully";
    }    
  } catch (error) {
    throw new Error(error);
  }
}

async function updateImage(req) {
  const obj = {status: 200, message: "data fetched successfully", data: ""};
  console.log(req.file)
  const url = req.protocol + '://' + req.get('host')
  obj.data = url + '/public/' + req.file.filename
  return obj
}


async function getUserProfile(userId) { 
  const obj = {status: 200, message: "data fetched successfully", data: []};
  try {
    const result = await User.findOne({ _id: ObjectId(userId) },
      { name: 1, contact: 1, profileImage: 1, userName: 1, status: 1, gender: 1, dob: 1 });
      if(result){
        obj.data = result
      } else {
        obj.status = 401
        obj.message = "data not found"
      }
    return obj;
  } catch (error) {
    throw new Error(error);
  }
}

async function getUserByContact(userIds) {
  const obj = {status: 200, message: "data fetched successfully", data: []};
  try {
    for(let i = 0; i < userIds.length; i++){
      const result = await User.findOne({ Contact: userIds[i] },
        { Name: 1, Contact: 1, ProfileImage: 1, username: 1, Status: 1, Gender: 1, DOB: 1 });
        if(result){
          obj.data.push(result)
        } else {
          obj.status = 401
          obj.message = "data not found"
        }
    }
    return obj;
  } catch (error) {
    throw new Error(error);
  }
}


async function createConfig({ type, data }) {
  // check the config there or not 

  const isExists = await Config.findOne({ type });
  if (isExists) {
    // update the data
    return await Config.updateOne(
      { type },
      {
        $set: {
          data
        }
      },
      { new: true }
    );

  }

  const newConfig = new Config({
    type,
    data
  });

  return await newConfig.save();

}


async function getConfig(type) {
  const obj = {status: 200, message: "data fetched successfully", data: []};
  try {
    const result = await Config.findOne({ type });
    if(result){
      obj.data = result;
    } else {
      obj.status = 401
      obj.message = "data not found"
    }    
    return obj;
  } catch (error) {
    throw new Error(error);
  }
}

async function getPreferences(userId) {
  let obj = { status: 200, message: "data fetched successfully", data: [] };
  try {
    const result = await Preferences.findOne({ userId: ObjectId(userId) });
    if (result) {
      obj.data = result;
    } else {
      obj.status = 401;
      obj.message = "data not found";
    }
    return obj;
  } catch (error) {
    throw new Error(error);
  }
}

async function searchUser(data) {
  let obj = { status: 200, message: "data fetched successfully", data: [] };
  try {
    const { email, Contact } = data
    let colName = "Contact"
    let val = Contact
    if(email){
      colName = "email"
      val = email
    }
    const result = await User.find({ [colName]: { $regex: '.*' + val + '.*' } })
    if (result) {
      obj.data = result;
    } else {
      obj.status = 401;
      obj.message = "data not found";
    }
    return obj;
  } catch (error) {
    throw new Error(error);
  }
}




async function updatePreferences({ userId, gender, ageRange, topics, otherQuestions }) {
  try {
    let obj = { status: 200, message: "data fetched successfully", data: [] };
    const isExists = await Preferences.findOne({ userId: ObjectId(userId) });
    let result;
    if (isExists) {
      // update the data
      result = await Preferences.updateOne(
        { userId: ObjectId(userId) },
        {
          $set: {
            gender,
            ageRange,
            topics,
            otherQuestions
          }
        },
        { new: true }
      );
      obj.data = result
    } else {
      const newPreferences = new Preferences({
        userId,
        gender,
        ageRange,
        topics,
        otherQuestions
      });
      const result = await newPreferences.save();
      obj.data = result
    }
    return obj;
  } catch (error) {
    throw new Error(error);
  }
}


async function createPlan({ userId, plan, amount, startDate, endDate, transactionId }) {
  try {
    const newPlan = new Plan({
      userId,
      plan,
      amount,
      startDate,
      endDate,
      transactionId
    });

    const result = await newPlan.save();

    return result;
  } catch (error) {
    throw new Error(error);
  }

}

async function pushNotification({token, ipAddress}) {
  try {
    let obj = { status: 200, message: "token set successfully", data: [] };
    const isExists = await Notification.findOne({ ipAddress });
    console.log(ipAddress)
    let result;
    if (isExists) {
      result = await Notification.updateOne(
        { ipAddress },
        {
          $set: {token}
        },
        { new: true }
      );
      obj.data = result
    } else {
      const newPreferences = new Notification({token, ipAddress});
      const result = await newPreferences.save();
      obj.data = result
    }
    return obj;
  } catch (error) {
    throw new Error(error);
  }
}

async function getTokens() {
  try {
    const notification = Notification.find();
    if(notification){
      return notification
    }
  } catch (error) {
    throw new Error(error);
  }

}

async function getUserPeersData({ipAddress}) {
  const obj = {status: 200, message: "data fetched successfully", data: []}
  try {
    if(ipAddress){
      const peer = await Peers.findOne({ipAddress});
      if(peer){
        obj.data = peer 
      } else {
        obj.status = 401
        obj.message = "data not found"
      }
    } else {
      const peer = Peers.find();
      if(peer){
        obj.data = peer
      } else {
        obj.status = 401
        obj.message = "data not found"
      }
    }
    console.log(obj.data,'ddddddddddddd')
    return obj    
  } catch (error) {
    throw new Error(error);
  }

}

async function earlyAccess(data) {
  try {
    let obj = { status: 200, message: "peer set successfully", data: [] };
    const isExists = await Peers.findOne({ ipAddress: data.ipAddress});
    console.log(data.ipAddress)
    let result;
    if (isExists) {
      result = await Peers.updateOne(
        { ipAddress: data.ipAddress },
        {
          $set: {...data}
        },
        { new: true }
      );
      obj.data = result
    } else {
      const newPeers = new Peers({...data});
      const result = await newPeers.save();
      obj.data = result
    }
    return obj;
  } catch (error) {
    throw new Error(error);
  }
}



module.exports = {
  getUserPeersData,
  pushNotification,
  earlyAccess,
  getTokens,
  updateUser,
  saveUser,
  getUserProfile,
  createConfig,
  getConfig,
  getPreferences,
  searchUser,
  updatePreferences,
  createPlan,
  updateImage,
  getUserByContact
};
