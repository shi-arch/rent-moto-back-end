const router = require("express").Router();
const accountService = require("../services/account.service");
const auth = require("../../../middlewares/auth/index")
const upload = require('../../../utils/file-upload/file-upload');

// Update User
router.post("/profile", auth(), async (req, res) => {
  accountService.updateUser(req, res);
});

router.post("/saveUser", async (req, res) => {
  accountService.saveUser(req, res);
});

// Update image
router.post("/image-upload", upload.single('profileImg'), auth(), async (req, res) => {
  accountService.updateImage(req, res);
});

// Update image
router.post("/getUsersByContact", auth(), async (req, res) => {
  accountService.getUserByContact(req, res);
});


// get user profile
router.get("/profile", auth(), async (req, res) => {
  accountService.getUserProfile(req, res);
});

// create config
router.post("/config", auth(), async (req, res) => {
  accountService.createConfig(req, res);
});

// get config
router.get("/config", auth(), async (req, res) => {
  accountService.getConfig(req, res);
});

// get Preferences
router.get("/preferences", auth(), async (req, res) => {
  accountService.getPreferences(req, res);
});

// update Preferences
router.post("/preferences", auth(), async (req, res) => {
  accountService.updatePreferences(req, res);
});

router.post("/search", auth(), async (req, res) => {
  accountService.searchUser(req, res);
});

// create plan
router.post("/plan", auth(), async (req, res) => {
  accountService.createPlan(req, res);
});

router.post("/save-push-notification-token", async (req, res) => {
  accountService.pushNotification(req, res);
});

router.get("/get-all-notification-token", async (req, res) => {
  accountService.getTokens(req, res);
});

router.post("/earlyAccess", async (req, res) => {
  accountService.earlyAccess(req, res);
});

router.get("/getUserPeersData", async (req, res) => {
  accountService.getUserPeersData(req, res);
});



module.exports = router;
