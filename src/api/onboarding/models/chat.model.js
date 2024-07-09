// import files
const { sendEmail } = require("../../../utils/email/index");
const { v4: uuidv4 } = require('uuid');
// import packages
const moment = require("moment");
const { mongoose } = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// Schema Imports
const Chat = require("../../../db/schemas/onboarding/chats.schema");
const Message = require("../../../db/schemas/onboarding/messages.schema");
const Request = require("../../../db/schemas/onboarding/request.schema");
const User = require("../../../db/schemas/onboarding/user.schema");
const ActiveUser = require("../../../db/schemas/onboarding/active-users.schema");


async function createMessage({ chatId, userId, content }) {
  const result = new Message({
    chatId: chatId,
    senderId: userId,
    content: content,
    createdAt: moment().toISOString(),
    updatedAt: moment().toISOString(),
  })
  return await result.save();
}


async function getMessages(chatId) {
  const result = await Message.find({ chatId: chatId });
  return result;
}


async function createChat({ isGroupChat, Users, chatName, lastMessage }) {
  // check if chat already exists
  try {
    let obj = { status: 200, message: "data fetched successfully", data: [] };
    if (Users.length > 1) {
      const userArr = []
      for (let i = 0; i < Users.length; i++) {
        const user = await User.findOne({ _id: ObjectId(Users[i]) })
        if (user) {
          userArr.push(user)
        }
      }
      const existingChat = await Chat.findOne({
        $or: [
          {
            users: { $all: Users.map((user) => ObjectId(user)) }
          }
        ]
      });
      let chatId = ""
      if (existingChat) {
        const doc = existingChat._doc
        doc.users = userArr
        chatId = existingChat._id
        if (!lastMessage) {
          obj.data = doc
        } else {
          doc.lastMessage = lastMessage
          doc.updatedAt = moment().toISOString()
          const result = await Chat.updateOne(
            { _id: ObjectId(existingChat._id) },
            {
              $set: {
                "chatName": chatName,
                "updatedAt": moment().toISOString(),
                "lastMessage": lastMessage || ""
              }
            }
          );
          if (result) {
            existingChat.users = userArr
            obj.data = existingChat
          }
        }
      } else {
        const o = {
          isGroupChat,
          users: userArr,
          chatName,
          createdAt: moment().toISOString(),
          updatedAt: moment().toISOString(),
        }
        const result = new Chat({ ...o });
        const res = await result.save();
        if (res) {
          chatId = res._id
          obj.data = o
        }
      }
      if (chatId) {
        const result = await Message.find({ chatId: ObjectId(chatId) });
        if (result) {
          obj.data.messages = result
        }
      }
    } else {
      obj.status = 401
      obj.message = "data not found"
    }
    return obj
  } catch (error) {
    throw new Error(error);
  }
}

async function getChat(userId) {
  const result = await Chat.findOne({ users: { $in: [userId] } });
  return result;
}

function getQueryParams() {
  const queryParams = {};
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  for (const [key, value] of urlParams) {
      queryParams[key] = value;
  }
  return queryParams;
}

async function getActiveUsers(req) {
  const obj = {data: [], message: "record fetched successfully", status: 200}
  const queryObj = req.query
  if(queryObj && queryObj.userSocketId){
    const result = await ActiveUser.findOne({ userSocketId: queryObj.userSocketId });
    if(result){
      const res= await ActiveUser.updateOne(
        { userSocketId: result.userSocketId },
        {
          $set: {
            isActive: false,
            userSocketId: ""
          }
        }
      )
      obj.message = "record updated successfully"
    } else {
      obj.status = 401
      obj.message = "data not found"
    }
    return obj
  }
  const result = await ActiveUser.find({ isActive: true }, { updatedAt: 0, createdAt: 0, __v: 0, _id: 0 });
  let activeUserArr = []
  if(result && result.length){
    for(let i = 0 ; i < result.length; i++){
      const activeUserDoc = result[i]._doc
      const user = await User.findOne({ _id: ObjectId(activeUserDoc.userId) })
      const userDoc = user._doc
      if(userDoc){
        activeUserDoc.name = userDoc.Name
        activeUserDoc.profileImage = userDoc.ProfileImage
        activeUserArr.push(activeUserDoc)
      }
    }
    obj.data = activeUserArr
  } else {
    obj.status = 401
    obj.message = "data not found"
  }
  return obj;
}




async function createRequest({ receiverId, senderId, isAccepted }) {
  // check if chat already exists
  const isExist = await Request.findOne({
    $or: [
      {
        receiverId: ObjectId(receiverId),
        senderId: ObjectId(senderId),
      },
      {
        receiverId: ObjectId(senderId),
        senderId: ObjectId(receiverId),
      },
    ],
  });

  if (!isExist) {
    const result = new Request({
      receiverId: ObjectId(receiverId),
      senderId: ObjectId(senderId),
      isAccepted
    })
    return await result.save();
  }

  // update the data
  return await Request.updateOne(
    {
      $or: [
        {
          receiverId: ObjectId(receiverId),
          senderId: ObjectId(senderId),
        },
        {
          receiverId: ObjectId(senderId),
          senderId: ObjectId(receiverId),
        },
      ],
    },
    {
      $set: {
        isAccepted,
        updatedAt: moment().toISOString(),
      },
    },
    { new: true }
  );


}


async function getRequests(userId) {
  const result = await Request.find({
    $or: [
      { receiverId: ObjectId(userId), isAccepted: false },
      { senderId: ObjectId(userId), isAccepted: false }
    ]
  });
  return result;
}

async function block(myUserId, blockUserId) {
  let obj = { status: 200, message: "data fetched successfully", data: [] };
  const findUser = await User.findOne({ userId: ObjectId(blockUserId) });
  if (findUser.isBlockedBy.length) {
    const isUserBlocked = findUser.isBlockedBy.find((item) => item == myUserId)
    if (!isUserBlocked) {
      findUser.isBlockedBy.push(myUserId)
    }
  } else {
    findUser.isBlockedBy = [myUserId]
  }
  const result = await User.updateOne(
    { userId: ObjectId(blockUserId) },
    {
      $set: {
        ...findUser
      }
    }
  );
  if (result) {
    obj.data = result
  }
  return obj
}

async function unBlock(myUserId, blockUserId) {
  let obj = { status: 200, message: "data fetched successfully", data: [] };
  const findUser = await User.findOne({ userId: ObjectId(blockUserId) });
  if (findUser.isBlockedBy.length) {
    const isUserBlocked = findUser.isBlockedBy.find((item) => item == myUserId)
    if (isUserBlocked) {
      const index = findUser.isBlockedBy.indexOf(myUserId)
      findUser.isBlockedBy.splice(index, 1)
      findUser.isBlockedBy.push(myUserId)
    }
  }
  const result = await User.updateOne(
    { userId: ObjectId(blockUserId) },
    {
      $set: {
        ...findUser
      }
    }
  );
  if (result) {
    obj.data = result
  }
  return obj
}

async function getBotSessions() {
  let obj = { status: 200, message: "data fetched successfully", data: [] };
  if(sessionHistories){
    obj.data = { sessions: sessionHistories} 
  } else {
    obj.status = 401
    obj.message = "data not found"
  }
  return obj   
}


module.exports = {
  createMessage,
  getMessages,
  createChat,
  getChat,
  getActiveUsers,
  createRequest,
  getRequests,
  block,
  unBlock,
  getBotSessions
};
