const router = require("express").Router();
const chatService = require("../services/chat.services"); 
const auth = require("../../../middlewares/auth/index");

// create messages
router.post("/createMessage", auth(), async (req, res) => {
  chatService.createMessage(req, res);
}) 

// get messages
router.get("/getMessages/:chatId", auth(), async (req, res) => {
  chatService.getMessages(req, res);
})

// create chat and update
router.post("/createChat", auth(), async (req, res) => {
  chatService.createChat(req, res);
});

// get chat
router.get("/getChat", auth(), async (req, res) => {
  chatService.getChat(req, res);
});

// get active users
router.get("/activeUsers", auth(), async (req, res) => {
  chatService.getActiveUsers(req, res);
});

// create requests
router.post("/createRequest", auth(), async (req, res) => {
  chatService.createRequest(req, res);
})

// get requests
router.get("/getRequests", auth(), async (req, res) => {
  chatService.getRequests(req, res);
})

// block someone
router.post("/block", auth(), async (req, res) => {
  chatService.block(req, res);
})

// unblock someone
router.post("/unblock", auth(), async (req, res) => {
  chatService.unBlock(req, res);
})

// sendMessage someone
router.post("/sendMessage", auth(), async (req, res) => {
  chatService.sendMessage(req, res);
})

router.get("/get-bot-sessions", async (req, res) => {
  chatService.getBotSessions(req, res);
})

module.exports = router;
