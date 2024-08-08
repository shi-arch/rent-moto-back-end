// import files
const { sendEmail } = require("../../../utils/email/index");
const { v4: uuidv4 } = require('uuid');
// import packages
const moment = require("moment");
const { mongoose } = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// Schema Imports
const Vehicle = require("../../../db/schemas/onboarding/vehicle.schema");
const Location = require("../../../db/schemas/onboarding/location.schema");
const Booking = require("../../../db/schemas/onboarding/booking.schema");


async function createVehicle({ pricePerday, subLocation, location, name, url, distanceLimit, accessChargePerKm, vehicleNumber, pickupLocation, transmissionType, brand, BookingStartDateAndTime, BookingEndDateAndTime, isBooked }) {
  const obj = { status: 200, message: "data fetched successfully", data: [] }
  const result = await Booking.findOne({ vehicleNumber: vehicleNumber });
  if (result) {
    const updateObj = {}
    BookingStartDateAndTime ? updateObj.BookingStartDateAndTime = BookingStartDateAndTime : ""
    BookingEndDateAndTime ? updateObj.BookingEndDateAndTime = BookingEndDateAndTime : ""
    isBooked ? updateObj.isBooked = isBooked : ""
    location ? updateObj.location = location : ""
    subLocation ? updateObj.subLocation = subLocation : ""
    vehicleNumber ? updateObj.vehicleNumber = vehicleNumber : ""
    if (Object.keys(updateObj).length) {
      await Booking.updateOne(
        { vehicleNumber: vehicleNumber },
        {
          $set: updateObj
        },
        { new: true }
      );
      obj.status = 201
      obj.message = "Updated Successfully"
    } else {
      obj.status = 401
      obj.message = "Nothing to update"
    }
  } else {
    const veRes = await Vehicle.findOne({ name });
    let _id = ""
    if (veRes) {
      _id = veRes._doc._id
    } else {
      const vehicleObj = {
        pricePerday, name, url, distanceLimit, accessChargePerKm, transmissionType, brand
      }
      const resultData = new Vehicle({ ...vehicleObj });
      _id = resultData._doc._id
      await resultData.save();
    }
    const bookingObj = {
      vehicleNumber, BookingStartDateAndTime, BookingEndDateAndTime, isBooked: false, vehicleId: _id, location, pickupLocation
    }
    const bookingResponse = new Booking({ ...bookingObj });
    await bookingResponse.save();
    obj.status = 200
    obj.message = "data saved successfully"

  }
  return obj
}

async function booking(o) {
  const obj = { status: 200, message: "data fetched successfully", data: [] }
  const { BookingStartDateAndTime, BookingEndDateAndTime, vehicleNumber, vehicleId } = o
  const result = await Booking.findOne({ vehicleNumber });
  if (result) {
    await Booking.updateOne(
      { vehicleNumber },
      {
        $set: { BookingStartDateAndTime, BookingEndDateAndTime, isBooked: true }
      },
      { new: true }
    );
    const vehicleObj = await Vehicle.findOne({ _id: ObjectId(vehicleId) });
    if (vehicleObj) {
      const {_doc} = vehicleObj
      let bookingCount = parseInt(_doc.bookingCount) + 1
      await Vehicle.updateOne(
        { _id: ObjectId(vehicleId) },
        {
          $set: { bookingCount }
        },
        { new: true }
      );
      obj.status = 201
      obj.message = "Updated Successfully"
    }

  }
  return obj
}



async function searchVehicle({ name, pickupLocation, brand, transmissionType, location, startDate, startTime, endDate, endTime, sort, mostBooked }) {
  const obj = { status: 200, message: "data fetched successfully", data: [] }
  let momStartTime = moment(startTime, "hh:mm A");
  let momEndTime = moment(endTime, "hh:mm A");
  let getStartDate = startDate
  let getStartTime = { hours: new Date(momStartTime).getHours(), minutes: new Date(momStartTime).getMinutes() }
  let getEndDate = endDate
  let getEndTime = { hours: new Date(momEndTime).getHours(), minutes: new Date(momEndTime).getMinutes() }
  const filter = {}
  if (name) {
    filter.name = { $regex: '.*' + name + '.*', $options: 'i' }
  }
  if (brand) {
    filter.brand = { $regex: '.*' + brand + '.*', $options: 'i' }
  }
  if (transmissionType) {
    filter.transmissionType = transmissionType
  }
  const response = await Vehicle.find(filter)
  if (response && response.length) {
    const finalArr = []
    for (let i = 0; i < response.length; i++) {
      const { _doc } = response[i]
      const o = _doc
      const bookFilter = { vehicleId: ObjectId(o._id) }
      if (pickupLocation) {
        bookFilter.pickupLocation = pickupLocation
      }
      if (location) {
        bookFilter.location = location
      }
      const bookRes = await Booking.find(bookFilter)
      if (bookRes.length) {
        let getInitElement = ""
        let vehicleCount = 0
        for (let i = 0; i < bookRes.length; i++) {
          const { _doc } = bookRes[i]
          let BookingStartDateAndTime = _doc.BookingStartDateAndTime
          let BookingEndDateAndTime = _doc.BookingEndDateAndTime
          let isBooked = _doc.isBooked
          if (BookingEndDateAndTime && BookingStartDateAndTime && isBooked) {
            const { startDate, startTime } = BookingStartDateAndTime
            const { endDate, endTime } = BookingEndDateAndTime
            let bookingStartHours = new Date(moment(startTime, "hh:mm A")).getHours()
            let bookingEndHours = new Date(moment(endTime, "hh:mm A")).getHours()
            let bookingStartMinutes = new Date(moment(startTime, "hh:mm A")).getMinutes()
            let bookingEndMinutes = new Date(moment(endTime, "hh:mm A")).getMinutes()
            let checkSoldOut = false
            let bookingStartDate = moment(startDate).add(bookingStartHours, 'hours').add(bookingStartMinutes, 'minutes')
            bookingStartDate = new Date(bookingStartDate.format()).getTime()
            let currentStartDate = moment(getStartDate).add(getStartTime.hours, 'hours').add(getStartTime.minutes, 'minutes')
            currentStartDate = new Date(currentStartDate.format()).getTime()
            let currentEndDate = moment(getEndDate).add(getEndTime.hours, 'hours').add(getEndTime.minutes, 'minutes')
            currentEndDate = new Date(currentEndDate.format()).getTime()
            let bookingEndDate = moment(endDate).add(bookingEndHours, 'hours').add(bookingEndMinutes, 'minutes')
            bookingEndDate = new Date(bookingEndDate.format()).getTime()
            if (currentStartDate >= bookingStartDate && currentStartDate <= bookingEndDate) {
              checkSoldOut = true
            } else if (currentEndDate >= bookingStartDate && currentStartDate <= bookingEndDate) {
              checkSoldOut = true
            } else {
              if (!getInitElement) {
                getInitElement = _doc
              }
              checkSoldOut = false
            }
            if (!checkSoldOut) {
              vehicleCount = vehicleCount + 1
            }
          } else {
            getInitElement = _doc
            vehicleCount = vehicleCount + 1
          }
        }
        o.vehicleCount = vehicleCount
        finalArr.push({ ...o, ...getInitElement })
      }
    }
    if (sort == "lowToHigh") {
      finalArr.sort((a, b) => a.pricePerday - b.pricePerday);
    } else {
      finalArr.sort((a, b) => b.pricePerday - a.pricePerday);
    }
    if(mostBooked){
      finalArr.sort((a, b) => b.bookingCount - a.bookingCount);
    }
    obj.data = finalArr
  } else {
    obj.status = 401
    obj.message = "data not found"
  }
  return obj
}


async function getLocations() {
  const obj = { status: 200, message: "data fetched successfully", data: [] }
  const result = await Location.find({});
  if (result) {
    obj.status = 200
    obj.data = result
    obj.message = "data get successfully"
  } else {
    obj.status = 401
    obj.message = "data get successfully"
  }
  return obj
}


async function createLocation({ myLocation, subLocation }) {
  const obj = { status: 200, message: "data fetched successfully", data: [] }
  const result = await Location.findOne({ myLocation });
  if (result) {
    obj.status = 401
    obj.message = "same location cannot be repeated"
  } else {
    const result = new Location({ myLocation, subLocation });
    await result.save();
    obj.message = "data saved successfully"
  }
  return obj
}




async function getMessages(chatId) {
  const result = await Message.find({ chatId: chatId });
  return result;
}


module.exports = {
  createVehicle,
  createLocation,
  searchVehicle,
  getLocations,
  booking,
  getMessages
};
