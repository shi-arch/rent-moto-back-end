const {
  createVehicle,
  createLocation,
  searchVehicle,
  getMessages,
  getAllBookingDuration,
  createOrder,
  getOrders,
  booking,
  getAllVehicles,
  getLocations,
  createBookingDuration
} = require("../models/vehicles.model");


exports.createVehicle = async (req, res) => {
  try {
    const result = await createVehicle(req.body);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
      name: err.name,
      stack: err.stack,
      status: 400,
    });
  }
}

exports.createBookingDuration = async (req, res) => {
  try {
    const result = await createBookingDuration(req.body);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
      name: err.name,
      stack: err.stack,
      status: 400,
    });
  }
}

exports.searchVehicle = async (req, res) => {
  try {
    const result = await searchVehicle(req.body);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
      name: err.name,
      stack: err.stack,
      status: 400,
    });
  }
}

exports.getLocations = async (req, res) => {
  try {
    const result = await getLocations(req.body);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
      name: err.name,
      stack: err.stack,
      status: 400,
    });
  }
}

exports.getAllBookingDuration = async (req, res) => {
  try {
    const result = await getAllBookingDuration(req.body);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
      name: err.name,
      stack: err.stack,
      status: 400,
    });
  }
}



exports.booking = async (req, res) => {
  try {
    const result = await booking(req.body);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
      name: err.name,
      stack: err.stack,
      status: 400,
    });
  }
}

exports.createOrder = async (req, res) => {
  try {
    const result = await createOrder(req.body);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
      name: err.name,
      stack: err.stack,
      status: 400,
    });
  }
}

exports.getOrders = async (req, res) => {
  try {
    const result = await getOrders();
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
      name: err.name,
      stack: err.stack,
      status: 400,
    });
  }
}










exports.createLocation = async (req, res) => {
  try {
    const result = await createLocation(req.body);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
      name: err.name,
      stack: err.stack,
      status: 400,
    });
  }
}



exports.getMessages = async (req, res) => {
  try {
    const result = await getMessages(req.params.chatId);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
      name: err.name,
      stack: err.stack,
      status: 400,
    });
  }
}

exports.getAllVehicles = async (req, res) => {
  try {
    const result = await getAllVehicles(req.body);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
      name: err.name,
      stack: err.stack,
      status: 400,
    });
  }
}


