const {
  createMessage,
  getMessages,
  createChat,
  getChat,
  createRequest,
  getRequests,
  callUser,
  block,
  getActiveUsers, 
  unBlock,
  getBotSessions
} = require("../models/chat.model");


exports.createMessage = async (req, res) => {
  try {
    req.body['userId'] = req.user.id
    const result = await createMessage(req.body);
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


exports.createChat = async (req, res) => {
  try {
    const result = await createChat(req.body);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
      name: err.name,
      stack: err.stack,
      status: 400,
    });
  }
};

exports.getChat = async (req, res) => {
  try {
    const result = await getChat(req.user.id);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
      name: err.name,
      stack: err.stack,
      status: 400,
    });
  }
};

exports.getActiveUsers = async (req, res) => {
  try {
    const result = await getActiveUsers(req);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
      name: err.name,
      stack: err.stack,
      status: 400,
    });
  }
};




exports.createRequest = async (req, res) => {
  try {
    const result = await createRequest(req.body);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
      name: err.name,
      stack: err.stack,
      status: 400,
    });
  }
};


exports.getRequests = async (req, res) => {
  try {
    const result = await getRequests(req.user.id);
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

exports.block = async (req, res) => {
  try {
    const result = await block(req.user.id, req.body.userId);
    return res.status(result.status).json(result);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
      name: err.name,
      stack: err.stack,
      status: 400,
    });
  }
}

exports.unBlock = async (req, res) => {
  try {
    const result = await unBlock(req.user.id);
    return res.status(result.status).json(result);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
      name: err.name,
      stack: err.stack,
      status: 400,
    });
  }
}

exports.unBlock = async (req, res) => {
  try {
    const result = await unBlock(req.user.id);
    return res.status(result.status).json(result);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
      name: err.name,
      stack: err.stack,
      status: 400,
    });
  }
}

exports.getBotSessions = async (req, res) => {
  try {
    const result = await getBotSessions();
    return res.status(result.status).json(result);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
      name: err.name,
      stack: err.stack,
      status: 400,
    });
  }
}
