/* eslint-disable linebreak-style */
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const _ = require("lodash");
const { createScheduledJob } = require("./src/utils/schedule");
require("dotenv").config();

// adding routers
const onboardingRouters = require("./src/api/onboarding/routers/routers.model");
const ActiveUser = require("./src/db/schemas/onboarding/active-users.schema");
const User = require("./src/db/schemas/onboarding/user.schema");
const Peers = require("./src/db/schemas/onboarding/peers.schema");

async function logs(data) {
  console.log(`${new Date().toISOString()} - ${data}`);
}

const PORT = process.env.PORT || 8080;

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'https://main--vibe-zone.netlify.app', 'https://vibe-zone.netlify.app', 'https://vibezone.in']
  },
});
const startServer = async () => {
  app.use(morgan("dev"));
  app.set("views", path.join(__dirname, "/src/views/pages"));
  app.use("/public", express.static("public"));
  app.use(express.json({ extended: true, limit: "100mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));
  app.use(bodyParser.json({ extended: true, limit: "50mb" }));
  app.use(
    bodyParser.urlencoded({
      limit: "50mb",
      extended: true,
      parameterLimit: 50000,
    })
  );

  app.use(
    cors({ origin: ['http://localhost:3000', 'https://main--vibe-zone.netlify.app', 'https://vibe-zone.netlify.app', 'https://vibezone.in'] })
  );
  app.use((req, res, next) => {
    //res.header("Access-Control-Allow-Origin",process.env.BASE_URL);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
  });
  // test api
  app.get("/", (req, res) => {
    res.send("Hi there, Welcome to Vibezone");
  });

  app.get("/test", (req, res) => {
    res.send("Hi Shivram, Welcome to Vibezone");
  });
  // use routes
  app.use(onboardingRouters);
  console.log(process.env.SERVER_1, 'cccccccccccccc')

  const stripe = require("stripe")(
    "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"
  );

  app.post("/charge", async (req, res) => {
    const amount = req.body.amount;
    const token = req.body.token;
    const charge = await stripe.charges.create({
      amount: amount,
      currency: "USD",
      source: token.id,
      description: "Example charge",
    });
    res.json({ success: true, charge: charge });
  });

  // database connection
  mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("mongo db is connected....", process.env.DB_URL))
    .catch((err) => console.log("error occurs while connecting time", err));

  const socketIds = []
  let peers = [];
  let camOff = [];
  let usersCount = {
    enableCam: 0,
    disableCam: 0,
    totalUserCount: 0,
    activeUsersCount: 0
  }
  let skipCount = 0

  const findAndUpdate = async (ids, isActive) => {
    const arr = []
    for (let i = 0; i < ids.length; i++) {
      let ipAddress = ids[i]
      const result = await Peers.updateOne(
        { ipAddress: ipAddress },
        {
          $set: { isActive }
        },
        { new: true }
      );
      if (result) {
        arr.push(result)
      }
    }
    if(arr.length){
      return arr
    } else {
      return false
    }
  }
  const findActiveUserWithKey = async (myIp, userIp) => {
    const obj = { activeUser: null, myData: null }
    let myKeywords = [];
    const findMyData = await Peers.findOne({ ipAddress: myIp, socketId: {$ne: ''} })
    console.log(findMyData)
    if (findMyData) {
      myKeywords = findMyData.keyWords && findMyData.keyWords.split(",") || []
      obj.myData = findMyData
    }
    const allPeers = await Peers.find({ isActive: true, socketId: {$ne: ''} })
    for (let i = 0; i < allPeers.length; i++) {
      let peer = allPeers[i]
      if (peer.ipAddress !== myIp && peer.ipAddress != userIp) {
        let arr = peer.keyWords && peer.keyWords.split(",") || []
        if (myKeywords.length || arr.length) {
          let matches = myKeywords.filter(value => arr.includes(value));
          if (matches && matches.length) {
            obj.activeUser = peer
            break;
          }
        } else {
          obj.activeUser = peer
          break;
        }
      }
    }
    return obj
  }
  const broadcastEventTypes = {
    ACTIVE_USERS: 'ACTIVE_USERS',
    GROUP_CALL_ROOMS: 'GROUP_CALL_ROOMS',
    INACTIVE_USERS: 'INACTIVE_USERS',
    CAMERA_OFF: 'CAMERA_OFF',
  };
  io.on("connection", async (socket) => {
    socket.on("typing", (o) => {
      socket.in(o.id).emit("typing", o.name)
    });
    socket.on("stop typing", (id) => {
      console.log(socket.id)
      socket.in(id).emit("stop typing")
    });
    socket.on("sendMessage", (o) => {
      socket.in(o.id).emit("sendMessage", o.msg)
    });
    socket.on('disconnectCall', (id) => {
      console.log('Disconnecting the call...');
      socket.in(id).emit("endCall")
    });
    socket.emit('connection', null);
    socket.on('update-name', (o) => {
      const { name, socketId } = o
      peers = peers.map(peer => {
        if (peer.socketId === socketId) {
          peer.username = name
        }
        return peer
      })
      console.log(peers, 'update name peers >>>>>>>>>>')
      io.sockets.emit('broadcast', {
        event: broadcastEventTypes.ACTIVE_USERS,
        activeUsers: peers
      });
      if (camOff.length) {
        camOff = camOff.map(cam => {
          if (cam.socketId === socketId) {
            cam.username = name
          }
          return cam
        })
        io.sockets.emit('broadcast', {
          event: broadcastEventTypes.CAMERA_OFF,
          activeUsers: camOff
        });
      }
    })
    socket.on('end-call', (socketId) => {
      const find = peers.find(o => o.socketId == socketId)
      if (find) {
        io.to(find.socketId).emit('end-call');
      }
    });
    socket.on('disconnect', async () => {
      const find = peers.find(peer => peer.socketId === socket.id)
      if (find) {
        logs(`offline user socket id ${JSON.stringify(find)}`)
        peers = peers.filter(peer => peer.socketId !== find.socketId)
        logs(`newtwork gone ${JSON.stringify(peers)}`)
      }
    });
  })
  const dateStr = "2023-02-28 16:43";
  const myDate = new Date(dateStr);
  const myTask = () => {
    console.log("Facebook schedule was posted");
  };
  createScheduledJob("Facebook", myTask, myDate);
};

startServer();
