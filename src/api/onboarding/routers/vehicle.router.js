const router = require("express").Router();
const vehiclesService = require("../services/vehicles.service"); 
const auth = require("../../../middlewares/auth/index");

// create messages
router.post("/createVehicle", async (req, res) => {
  vehiclesService.createVehicle(req, res);
})

router.post("/createBookingDuration", async (req, res) => {
  vehiclesService.createBookingDuration(req, res);
})

router.post("/createLocation", async (req, res) => {
  vehiclesService.createLocation(req, res);
})

router.post("/searchVehicle", async (req, res) => {
  vehiclesService.searchVehicle(req, res);
})

// get messages
router.get("/getMessages/:chatId", auth(), async (req, res) => {
  vehiclesService.getMessages(req, res);
})

router.get("/getAllVehicles", async (req, res) => {
  vehiclesService.getAllVehicles(req, res);
})

router.get("/getLocations", async (req, res) => {
  vehiclesService.getLocations(req, res);
})

router.get("/getAllBookingDuration", async (req, res) => {
  vehiclesService.getAllBookingDuration(req, res);
})

router.post("/booking", async (req, res) => {
  vehiclesService.booking(req, res);
})

module.exports = router;
