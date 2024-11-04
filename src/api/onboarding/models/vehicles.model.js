const { sendEmail } = require("../../../utils/email/index");
const { v4: uuidv4 } = require('uuid');
const moment = require("moment");
const { mongoose } = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Vehicle = require("../../../db/schemas/onboarding/vehicle.schema");
const Location = require("../../../db/schemas/onboarding/location.schema");
const Station = require("../../../db/schemas/onboarding/station.schema");
const Booking = require("../../../db/schemas/onboarding/booking.schema");
const BookingDuration = require("../../../db/schemas/onboarding/bookingDuration.schema");
const User = require("../../../db/schemas/onboarding/user.schema");
const Order = require("../../../db/schemas/onboarding/order.schema");
const VehicleMaster = require("../../../db/schemas/onboarding/vehicle-master.schema");
const Plan = require("../../../db/schemas/onboarding/plan.schema");
const Coupon = require("../../../db/schemas/onboarding/coupons.schema");
const InvoiceTbl = require("../../../db/schemas/onboarding/invoice-tbl.schema");
const VehicleTable = require("../../../db/schemas/onboarding/vehicle-table.schema");
const vehicleTable = require("../../../db/schemas/onboarding/vehicle-table.schema");
const vehicleMaster = require("../../../db/schemas/onboarding/vehicle-master.schema");
const plan = require("../../../db/schemas/onboarding/plan.schema");
const location = require("../../../db/schemas/onboarding/location.schema");
const station = require("../../../db/schemas/onboarding/station.schema");

const createBookingDuration = async ({ bookingDuration, attachedVehicles, bookingId }) => {
  const obj = { status: 200, message: "data fetched successfully", data: [] }
  if (bookingDuration && bookingDuration.label) {
    let result = await BookingDuration.findOne({ 'bookingDuration.label': bookingDuration.label });
    if (result) {
      result = result._doc
      if (bookingId) {
        if (result.attachedVehicles.length) {
          const find = result.attachedVehicles.find(ele => ele == bookingId)
          if (!find) {
            const arr = result.attachedVehicles
            arr.push(bookingId)
            const updatePacket = {
              "attachedVehicles": arr,
            }
            await BookingDuration.updateOne(
              { _id: ObjectId(result._id) },
              {
                $set: updatePacket
              },
              { new: true }
            );
            obj.status = 201
            obj.message = "Booking duration updated successfully"
          } else {
            obj.message = "Invalid data",
              obj.status = "401"
          }
        } else {
          await BookingDuration.updateOne(
            { _id: ObjectId(result._id) },
            {
              $set: { "attachedVehicles": [bookingId] }
            },
            { new: true }
          );
          obj.status = 201
          obj.message = "Booking duration updated successfully"
        }
      } else {
        obj.message = "Invalid data",
          obj.status = "401"
      }
    } else {
      const obj = { attachedVehicles: attachedVehicles && attachedVehicles.length ? attachedVehicles : [], bookingDuration }
      const result = new BookingDuration(obj);
      await result.save();
      obj.message = "data saved successfully"
    }
  } else {
    obj.message = "Invalid data",
      obj.status = "401"
  }
  return obj
}


async function createVehicle({ _id, vehicleId, stationId, locationId, vehicleNumber, freeKms, extraKmsCharges, vehicleModel, vehicleColor, perDayCost, lastServiceDate, kmsRun, isBooked, condition, deleteRec }) {
  const response = { status: "200", message: "data fetched successfully", data: [] }
  try {
    if (_id || (vehicleId && stationId && locationId && vehicleNumber && freeKms && extraKmsCharges && vehicleModel && vehicleColor && perDayCost && lastServiceDate && kmsRun && isBooked && condition)) {
      if (stationId) {
        const findStation = await Station.findOne({ stationId })
        if (!findStation) {
          response.status = 401
          response.message = "Invalid stationId"
          return response
        }
      }
      if (locationId) {
        const findLocation = await Location.findOne({ locationId })
        if (!findLocation) {
          response.status = 401
          response.message = "Invalid locationId"
          return response
        }
      }
      if (condition) {
        let statusCheck = ["old", "new"].includes(condition)
        if (!statusCheck) {
          response.status = 401
          response.message = "Invalid vehicle condition"
          return response
        }
      }
      if(_id && _id.length == 24){
        const find = await VehicleTable.findOne({ _id: ObjectId(_id) })
        if (!find) {
          response.status = 401
          response.message = "Invalid vehicleId"
          return response
        }
        if (vehicleNumber) {
          const findVeh = await VehicleTable.find({ vehicleNumber })
          if (findVeh && findVeh.length == 2) {
            response.status = 401
            response.message = "Vehicle number already exist"
            return response
          }
        }
      }      
      
      const o = {
        vehicleId, stationId, locationId, vehicleNumber, freeKms, extraKmsCharges, vehicleModel, vehicleColor, perDayCost, lastServiceDate, kmsRun, isBooked, condition
      }
      if (_id) {
        const find = await VehicleTable.findOne({ _id: ObjectId(_id) })
        if (!find) {
          response.status = 401
          response.message = "Invalid vehicle table id"
          return response
        }
        if (deleteRec) {
          await VehicleTable.deleteOne({ _id: ObjectId(_id) })
          response.message = "vehicle deleted successfully"
          response.status = 200
          response.data = { _id }
          return response
        }
        await VehicleTable.updateOne(
          { _id: ObjectId(_id) },
          {
            $set: o
          },
          { new: true }
        );
        response.message = "Vehicle Table updated successfully"
        response.data = o
      } else {
        const find = await VehicleTable.findOne({ vehicleNumber })
        if (!find) {
          const SaveVehicleTable = new VehicleTable(o)
          SaveVehicleTable.save()
          response.message = "data saved successfully"
          response.data = o
        } else {
          response.status = 401
          response.message = "Vehicle number already exists"
        }
      }
    } else {
      response.status = 401
      response.message = "Something is missing"
    }
    return response
  } catch (error) {
    throw new Error(error);
  }
}

async function booking({ vehicleTableId, userId, BookingStartDateAndTime, BookingEndDateAndTime, extraAddon, bookingPrice,
  discount, bookingStatus, paymentStatus, rideStatus, pickupLocation, invoice, paymentMethod, paySuccessId, payInitFrom,
  deleteRec, _id
}) {
  const obj = { status: 200, message: "data fetched successfully", data: [] }
  const { startTime, startDate } = BookingStartDateAndTime
  const { endTime, endDate } = BookingEndDateAndTime
  const { totalPrice, discountPrice, tax, roundPrice } = bookingPrice
  if (_id || (
    vehicleTableId && userId && BookingStartDateAndTime && BookingEndDateAndTime && bookingPrice && startTime && endTime && startDate &&
    bookingStatus && paymentStatus && rideStatus && pickupLocation && invoice && paymentMethod && paySuccessId && payInitFrom && endDate &&
    totalPrice && tax && roundPrice && discountPrice
  )) {
    const o = {
      vehicleTableId, userId, BookingStartDateAndTime, BookingEndDateAndTime, extraAddon, bookingPrice,
      discount, bookingStatus, paymentStatus, rideStatus, pickupLocation, invoice, paymentMethod, paySuccessId, payInitFrom
    }

    if (vehicleTableId) {
      const find = await vehicleTable.findOne({ _id: ObjectId(vehicleTableId) })
      if (!find) {
        obj.status = 401
        obj.message = "invalid vehicle table id"
        return obj
      }
    }
    if (userId) {
      const find = await User.findOne({ _id: ObjectId(userId) })
      if (!find) {
        obj.status = 401
        obj.message = "invalid user id"
        return obj
      }
    }
    if (bookingStatus) {
      let check = ['pending', 'completed', 'canceled'].includes(bookingStatus)
      if (!check) {
        obj.status = 401
        obj.message = "Invalid booking Status"
        return obj
      }
    }
    let check = ['fixed', 'percentage'].includes(discount)
    if (!check) {
      obj.status = 401
      obj.message = "Invalid discount type"
      return obj
    }

  } else {
    obj.status = 401
    obj.message = "Something is missing"
    return obj
  }
  if (paymentStatus) {
    let check = ['pending', 'completed', 'canceled'].includes(paymentStatus)
    if (!check) {
      obj.status = 401
      obj.message = "Invalid paymentStatus"
      return obj
    }
  }
  if (rideStatus) {
    let check = ['pending', 'completed', 'canceled'].includes(rideStatus)
    if (!check) {
      obj.status = 401
      obj.message = "Invalid rideStatus"
      return obj
    }
  }
  if (paymentMethod) {
    let check = ['online', 'cash'].includes(paymentMethod)
    if (!check) {
      obj.status = 401
      obj.message = "Invalid payment method"
      return obj
    }
  }
  if (pickupLocation) {
    const find = await Station.findOne({ stationId: pickupLocation })
    if (!find) {
      obj.status = 401
      obj.message = "invalid pickup location"
      return obj
    }
  }
  if (invoice) {
    const find = await InvoiceTbl.findOne({ _id: ObjectId(invoice) })
    if (!find) {
      obj.status = 401
      obj.message = "invalid invoice id"
      return obj
    }
  }
  if (_id) {
    const result = await Booking.findOne({ _id: ObjectId(_id) });
    if (result) {
      if (deleteRec) {
        await Booking.deleteOne({ _id: ObjectId(_id) })
        obj.message = "booking deleted successfully"
        obj.data = { _id }
        return obj
      }
      await Booking.updateOne(
        { _id: ObjectId(_id) },
        {
          $set: o
        },
        { new: true }
      );
      obj.message = "booking updated successfully"
      obj.data = o
    }
  } else {
    const SavePlan = new Booking(o)
    SavePlan.save()
    obj.message = "new booking saved successfully"
    obj.data = o
  }
  return obj
}

async function createOrder(o) {
  const obj = { status: 200, message: "data fetched successfully", data: [] }
  const { vehicleNumber, vehicleName, endDate, endTime, startDate, startTime, pickupLocation, location,
    paymentStatus, paymentMethod, userName, email, contact, submittedDocument, _id, vehicleImage, orderId } = o
  if (vehicleNumber && vehicleName && endDate && endTime && startDate && startTime && pickupLocation && location &&
    paymentStatus && paymentMethod && userName && email && contact && submittedDocument && vehicleImage && orderId) {
    const find = await Order.findOne({ orderId })
    if (find) {
      obj.status = 401
      obj.message = "order id already exist"
      return obj
    }
    if (_id) {
      const result = await Order.findOne({ _id: ObjectId(_id) });
      if (result) {
        await Order.updateOne(
          { _id: ObjectId(_id) },
          {
            $set: { ...o }
          },
          { new: true }
        );
        obj.message = "data updated successfully"
      } else {
        obj.status = 401
        obj.message = "Invalid _id"
        return obj
      }
    } else {
      delete o._id
      const result = new Order({ ...o });
      await result.save();
      obj.message = "data saved successfully"
    }
  } else {
    obj.status = 401
    obj.message = "Invalid data or something is missing"
  }
  return obj
}

async function createLocation({ locationName, locationImage, deleteRec, _id }) {
  const obj = { status: 200, message: "location created successfully", data: [] }
  if (_id && _id.length == 24) {
    const find = await Location.findOne({ _id: ObjectId(_id) })
    if (!find) {
      obj.status = 401
      obj.message = "Invalid _id"
      return obj
    }
    if (deleteRec) {
      await Location.deleteOne({ _id: ObjectId(_id) })
      obj.message = "location deleted successfully"
      obj.data = { _id }
      return obj
    }
    await Location.updateOne(
      { _id: ObjectId(_id) },
      {
        $set: { locationName, locationImage }
      },
      { new: true }
    );
    obj.message = "location updated successfully"
    obj.data = { _id }
    return obj
  } else {
    if(locationName && locationImage) {
      const find = await Location.findOne({ locationName })
      if(find) {
        obj.status = 401
        obj.message = "location already exist"
        return obj
      }
      const SaveLocation = new Location({ locationName, locationImage })
      SaveLocation.save()
      obj.message = "data saved successfully"
      obj.data = SaveLocation
    }
  }
  return obj
}

async function createPlan({ planName, planPrice, locationId, stationId, _id, deleteRec }) {
  const obj = { status: 200, message: "plan created successfully", data: [] }
  try {
    if (_id || (planName && planPrice && locationId && stationId)) {
      let o = { planName, planPrice, locationId, stationId }
      if (locationId.length !== 24) {
        obj.status = 401
        obj.message = "invalid location id"
        return obj
      }
      if (planName && !_id) {
        const find = await Plan.findOne({ planName })
        if (find) {
          obj.status = 401
          obj.message = "plan already exists"
          return obj
        }
      }
      if (stationId) {
        const find = await Station.findOne({ stationId })
        if (!find) {
          obj.status = 401
          obj.message = "invalid station id"
          return obj
        }
      }
      if (locationId) {
        const find = await Location.findOne({ _id: ObjectId(locationId) })
        if (!find) {
          obj.status = 401
          obj.message = "invalid location id"
          return obj
        }
      }
      if (_id) {
        const result = await Plan.findOne({ _id: ObjectId(_id) });
        if (result) {
          if (deleteRec) {
            await Plan.deleteOne({ _id: ObjectId(_id) })
            obj.message = "plan deleted successfully"
            return obj
          }
          await Plan.updateOne(
            { _id: ObjectId(_id) },
            {
              $set: o
            },
            { new: true }
          );
          obj.message = "plan updated successfully"
          obj.data = o
        } else {
          obj.status = 401
          obj.message = "Invalid data"
        }
      } else {
        const SavePlan = new Plan(o)
        SavePlan.save()
        obj.message = "new plan saved successfully"
        obj.data = o
      }
    } else {
      obj.status = 401
      obj.message = "Invalid data"
    }
  } catch (err) {
    console.log(err)
  }

  return obj
}

async function createInvoice({ invoiceNumber, orderId, pdfDoc, _id, deleteRec }) {
  const obj = { status: 200, message: "invoice created successfully", data: [] }
  if (_id || (invoiceNumber && orderId && pdfDoc)) {
    let o = { invoiceNumber, orderId, pdfDoc }
    if (invoiceNumber) {
      const find = await InvoiceTbl.findOne({ invoiceNumber })
      if (find) {
        obj.status = 401
        obj.message = "invoice already exists"
        return obj
      }
    }
    if (orderId) {
      const find = await InvoiceTbl.findOne({ orderId })
      if (find) {
        obj.status = 401
        obj.message = "orderId already exists"
        return obj
      }
    }
    if (_id) {
      const result = await InvoiceTbl.findOne({ _id: ObjectId(_id) });
      if (result) {
        if (deleteRec) {
          await InvoiceTbl.deleteOne({ _id: ObjectId(_id) })
          obj.message = "invoice deleted successfully"
          return obj
        }
        await InvoiceTbl.updateOne(
          { _id: ObjectId(_id) },
          {
            $set: o
          },
          { new: true }
        );
        obj.message = "invoice updated successfully"
        obj.data = o
      }
    } else {
      const SavePlan = new InvoiceTbl(o)
      SavePlan.save()
      obj.message = "new invoice saved successfully"
      obj.data = o
    }
  } else {
    obj.status = 401
    obj.message = "Invalid data"
  }
  return obj
}

async function discountCoupons({ couponName, vehicleType, allowedUsers, usageAllowed, discountType, _id, deleteRec }) {
  const obj = { status: 200, message: "invoice created successfully", data: [] }
  if (_id || (couponName && vehicleType && usageAllowed && discountType)) {
    let o = { couponName, vehicleType, allowedUsers, usageAllowed, discountType }
    if (couponName) {
      const find = await Coupon.findOne({ couponName })
      if (find) {
        obj.status = 401
        obj.message = "coupon already exists"
        return obj
      }
    }
    if (discountType) {
      let check = ['percentage', 'fixed'].includes(discountType)
      if (!check) {
        obj.status = 401
        obj.message = "Invalid discount type"
        return obj
      }
    }
    if (vehicleType) {
      let check = ["gear", "non-gear", "all"].includes(vehicleType)
      if (!check) {
        obj.status = 401
        obj.message = "Invalid vehicle type"
        return obj
      }
    }
    if (allowedUsers && allowedUsers.length) {
      for (let i = 0; i < allowedUsers.length; i++) {
        const find = await User.findOne({ _id: ObjectId(allowedUsers[i]) })
        if (!find) {
          obj.status = 401
          obj.message = "Invalid user id"
          return obj
        }
      }
    }
    if (_id) {
      const result = await Coupon.findOne({ _id: ObjectId(_id) });
      if (result) {
        if (deleteRec) {
          await Coupon.deleteOne({ _id: ObjectId(_id) })
          obj.message = "Coupon deleted successfully"
          return obj
        }
        await Coupon.updateOne(
          { _id: ObjectId(_id) },
          {
            $set: o
          },
          { new: true }
        );
        obj.message = "Coupon updated successfully"
        obj.data = o
      }
    } else {
      const SavePlan = new Coupon(o)
      SavePlan.save()
      obj.message = "new Coupon saved successfully"
      obj.data = o
    }
  } else {
    obj.status = 401
    obj.message = "Invalid data"
  }
  return obj
}




async function createStation({ stationName, locationId, stationId, _id, deleteRec }) {
  const obj = { status: 200, message: "location created successfully", data: [] }
  const o = { stationId, stationName, locationId }
  if (locationId && locationId.length == 24) {
    const find = await Location.findOne({ _id: ObjectId(locationId) })
    if (!find) {
      obj.status = 401
      obj.message = "invalid location id"
      return obj
    }
  } else {
    obj.status = 401
    obj.message = "invalid location id"
    return obj
  }
  if (_id) {
    const find = await Station.findOne({ _id: ObjectId(_id) })
    if (!find) {
      obj.status = 401
      obj.message = "Invalid station id"
      return obj
    }
    if (deleteRec) {
      await Station.deleteOne({ _id: ObjectId(_id) })
      obj.message = "station deleted successfully"
      return obj
    }
    await Station.updateOne(
      { stationId },
      {
        $set: o
      },
      { new: true }
    );
    obj.message = "station updated successfully"
    obj.data = o
  } else {
    if (stationName && locationId && stationId) {
      const find = await Station.findOne({ stationId })
      if (find) {
        obj.status = 401
        obj.message = "station already exists"
        return obj
      }
      const SaveStation = new Station(o)
      SaveStation.save()
      obj.message = "data saved successfully"
      obj.data = o
    } else {
      obj.status = 401
      obj.message = "Invalid station details"
    }
  }
  return obj
}

async function createVehicleMaster({ vehicleName, vehicleType, vehicleBrand, vehicleImage, deleteRec, _id }) {
  const response = { status: "200", message: "data fetched successfully", data: [] }
  try {
    const obj = {
      vehicleName, vehicleType, vehicleBrand, vehicleImage
    }
    if (_id) {
      const find = await VehicleMaster.findOne({ _id: ObjectId(_id) })
      if (!find) {
        response.status = 401
        response.message = "Invalid vehicle id"
        return response
      }
      if (deleteRec) {
        await VehicleMaster.deleteOne({ _id: ObjectId(_id) })
        response.message = "vehicle deleted successfully"
        response.status = 200
        response.data = { vehicleName }
        return response
      }
      if (vehicleType) {
        let statusCheck = ["gear", "non-gear"].includes(vehicleType)
        if (!statusCheck) {
          response.status = 401
          response.message = "Invalid vehicle type"
          return response
        }
      }
      await VehicleMaster.updateOne(
        { _id: ObjectId(_id) },
        {
          $set: obj
        },
        { new: true }
      );
      response.message = "user updated successfully"
      response.data = obj
    } else {
      if (vehicleName && vehicleType && vehicleBrand && vehicleImage) {
        const find = await VehicleMaster.findOne({ vehicleName })
        if (find) {
          response.status = 401
          response.message = "vehicle name already exists"
          return response
        }
        const SaveUser = new VehicleMaster(obj)
        SaveUser.save()
        response.message = "data saved successfully"
        response.data = obj
      } else {
        response.status = 401
        response.message = "Invalid vehicle details"
      }
    }
    return response
  } catch (error) {
    throw new Error(error);
  }
}





async function searchVehicle({ name, pickupLocation, brand, transmissionType, location, startDate, startTime, endDate, endTime, sort, mostBooked, bookingDuration }) {
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
  let attachedDevices = []
  if (bookingDuration) {
    const result = await BookingDuration.findOne({ 'bookingDuration.label': bookingDuration });
    attachedDevices = result._doc.attachedVehicles
    if (!attachedDevices.length) {
      return { status: 200, message: "No data found", data: [] }
    }
  }
  if (attachedDevices.length) {
    attachedDevices = attachedDevices.map((obj) => {
      return (
        ObjectId(obj)
      )
    })
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
      if (attachedDevices.length) {
        bookFilter._id = { $in: attachedDevices }
      }
      let bookRes = await Booking.find(bookFilter)
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
    if (mostBooked) {
      finalArr.sort((a, b) => b.bookingCount - a.bookingCount);
    }
    obj.data = finalArr
  } else {
    obj.status = 401
    obj.message = "data not found"
  }
  return obj
}

const getVehicleMasterData = async (query) => {
  const obj = { status: 200, message: "data fetched successfully", data: [] }
  let filter = query
  if (filter._id) {
    filter._id = ObjectId(query._id)
  }
  const response = await vehicleMaster.find({ ...filter })
  if (response) {
    obj.data = response
  } else {
    obj.status = 401
    obj.message = "data not found"
  }
  return obj
}

const getVehicleTblData = async (query) => {
  const obj = { status: 200, message: "data fetched successfully", data: [] }
  let filter = query
  if (filter._id) {
    filter._id = ObjectId(query._id)
  }
  const response = await vehicleTable.find({ ...filter })
  if (response) {
    obj.data = response
  } else {
    obj.status = 401
    obj.message = "data not found"
  }
  return obj
}

const getPlanData = async (query) => {
  const obj = { status: 200, message: "data fetched successfully", data: [] }
  let filter = query
  if (filter._id) {
    filter._id = ObjectId(query._id)
  }
  const response = await plan.find({ ...filter })
  if (response) {
    obj.data = response
  } else {
    obj.status = 401
    obj.message = "data not found"
  }
  return obj
}

const getLocationData = async (query) => {
  const obj = { status: 200, message: "data fetched successfully", data: [] }
  let filter = query
  if (filter._id) {
    filter._id = ObjectId(query._id)
  }
  const response = await Location.find({ ...filter })
  if (response) {
    obj.data = response
  } else {
    obj.status = 401
    obj.message = "data not found"
  }
  return obj
}

const getStationData = async (query) => {
  const obj = { status: 200, message: "data fetched successfully", data: [] }
  let filter = query
  if (filter._id) {
    filter._id = ObjectId(query._id)
  }
  const response = await station.find({ ...filter })
  if (response) {
    obj.data = response
  } else {
    obj.status = 401
    obj.message = "data not found"
  }
  return obj
}

async function getAllVehicles({ page, limit }) {
  const obj = { status: 200, message: "data fetched successfully", data: [] }
  const offset = (page - 1) * limit;
  const response = await Booking.find({}).skip(offset).limit(limit);
  if (response && response.length) {
    const finalArr = []
    for (let i = 0; i < response.length; i++) {
      let { _doc } = response[i]
      let o = _doc
      let vehicleRes = await Vehicle.findOne({ _id: ObjectId(o.vehicleId) })
      if (vehicleRes) {
        vehicleRes = vehicleRes._doc
        finalArr.push({ ...vehicleRes, ...o })
      }
    }
    obj.data = finalArr
    obj.count = await Booking.find({}).countDocuments();
  } else {
    obj.status = 401
    obj.message = "data not found"
  }
  return obj
}


async function getLocations(query) {
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

async function getOrders() {
  const obj = { status: 200, message: "data fetched successfully", data: [] }
  const result = await Order.find({});
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



async function getAllBookingDuration() {
  const obj = { status: 200, message: "data fetched successfully", data: [] }
  const result = await BookingDuration.find({});
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




async function getMessages(chatId) {
  const result = await Message.find({ chatId: chatId });
  return result;
}


module.exports = {
  createBookingDuration,
  createVehicleMaster,
  getAllBookingDuration,
  createVehicle,
  getOrders,
  getAllVehicles,
  createOrder,
  createLocation,
  createPlan,
  getVehicleMasterData,
  getVehicleTblData,
  getStationData,
  getLocationData,
  getPlanData,
  createInvoice,
  discountCoupons,
  createStation,
  searchVehicle,
  getLocations,
  booking,
  getMessages
};
