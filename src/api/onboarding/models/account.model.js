// import files
const { sendEmail } = require("../../../utils/email/index");

// import packages
require("dotenv").config();
const { mongoose } = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { Auth } = require("two-step-auth");
const nodemailer = require('nodemailer');
// import errors
const errorMessages = require("../errors/errors");
const { sendMessage } = require("../../../utils/Phone");
const User = require("../../../db/schemas/onboarding/user.schema");
const Traffic = require("../../../db/schemas/onboarding/traffic.schema ");
const { booking } = require("../services/vehicles.service");
const Booking = require("../../../db/schemas/onboarding/booking.schema");
const Vehicle = require("../../../db/schemas/onboarding/vehicle.schema");


const transporter = nodemailer.createTransport({
  port: 465,
  service: "gmail",
  secure: true,
  auth: {
    user: 'kashyapshivram512@gmail.com',
    pass: 'kmbc nqqe cavl eyma'
  },
});

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

async function getAllUsers() {
  const obj = { status: 200, message: "data fetched successfully", data: [] }
  const response = await User.find({})
  if (response && response.length) {    
    obj.data = response
  } else {
    obj.status = 401
    obj.message = "data not found"
  }
  return obj
}



async function saveUser(o) {
  const obj = { status: "200", message: "data fetched successfully", data: [] }
  try {
    const findUser = await User.findOne({ contact: o.contact });
    if (findUser) {
      await User.updateOne(
        { contact: o.contact },
        {
          $set: { ...o }
        },
        { new: true }
      );
      obj.status = 401
      obj.message = "user updated successfully"
    } else {
      const SaveUser = new User(o)
      SaveUser.save()
      obj.message = "data saved successfully"
    }
  } catch (error) {
    throw new Error(error);
  }
  return obj
}

async function updateImage(req) {
  const obj = { status: 200, message: "data fetched successfully", data: "" };
  console.log(req.file)
  const url = req.protocol + '://' + req.get('host')
  obj.data = url + '/public/' + req.file.filename
  return obj
}


async function getUserProfile(userId) {
  const obj = { status: 200, message: "data fetched successfully", data: [] };
  try {
    const result = await User.findOne({ _id: ObjectId(userId) },
      { name: 1, contact: 1, profileImage: 1, userName: 1, status: 1, gender: 1, dob: 1 });
    if (result) {
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

async function getUserByContact(body) {
  const obj = { status: 200, message: "data fetched successfully", data: [] };
  const {contact, userType} = body
  const o = {contact}
  if(userType){
    o.userType = userType
  }
  try {
    const result = await User.findOne({ ...o });
    if (result) {
      console.log(result)
      const findBookings = await Booking.find({ contact });  
      obj.data = result._doc  
      if(findBookings && findBookings.length){
        let arr = []
        for(let i = 0; i < findBookings.length; i++){
          const o = findBookings[i]
          const vehicleData = await Vehicle.findOne({ _id: ObjectId(o.vehicleId) });
          arr.push({bookingData: o, vehicleData: vehicleData})
        }
        obj.data = {...obj.data, bookings: arr}
      }      
    } else {
      obj.status = 401
      obj.message = "data not found"
    }
    return obj;
  } catch (error) {
    throw new Error(error);
  }
}

async function verification(o) {
  const obj = { status: 200, message: "data fetched successfully", data: [] };
  const { email, contact, invoice } = o
  const random = Math.floor(100000 + Math.random() * 900000)
  try {
    if (email) {
      let receiver = {
        from: "kashyapshivram512@gmail.com",
        to: email,
        subject: invoice ? "Rent moto invoice" : "Rent moto email verification",
        text: invoice ? invoice
        :  "Hi " + email + ", " + "Your verification otp is " + random 
      };
      const response = await transporter.sendMail(receiver)
      if (response) {
        obj.data = response
        obj.message = "email sent successfully"
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

async function verify(o) {
  const obj = { status: 200, message: "data fetched successfully", data: [] };
  const { otp } = o
  try {
    if (otp) {
      if (otp == "123456") {
        obj.message = "otp verified successfully"
      } else {
        obj.status = 401
        obj.message = "invalid otp"
      }
    } else {
      obj.status = 401
      obj.message = "invalid otp"
    }
    return obj;
  } catch (error) {
    throw new Error(error);
  }
}



async function login(emailId) {
  try {
    const res = await Auth(emailId, "Infoaxon");
    console.log(res)
  } catch (error) {
    throw new Error(error);
  }

  // You can follow this approach,
  // but the second approach is suggested,
  // as the mails will be treated as important
  // const res = await Auth(emailId, "Company Name");
  // console.log(res);
  // console.log(res.mail);
  // console.log(res.OTP);
  // console.log(res.success);
}



async function searchUser(data) {
  let obj = { status: 200, message: "data fetched successfully", data: [] };
  try {
    const { email, Contact } = data
    let colName = "Contact"
    let val = Contact
    if (email) {
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



module.exports = {
  verification,
  verify,
  getAllUsers,
  updateUser,
  saveUser,
  getUserProfile,
  searchUser,
  updateImage,
  getUserByContact
};
