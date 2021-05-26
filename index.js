"use strict";

const line = require("@line/bot-sdk");
const express = require("express");
var admin = require("firebase-admin");

var serviceAccount = require("./test-line-bot-e06b0-firebase-adminsdk-ytkpy-cb6f919950.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

require("dotenv").config();
// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post("/callback", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  (async function () {
    const res = await db
      .collection("Informarion")
      .where("Name", "==", event.message.text)
      .get()
      .then(() => {
        console.log("found", res.id);
      });
    // console.log("Added document with ID: ", res.id);
  })();
  db.collection("Informarion")
    .where("Name", "==", event.message.text)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log("found");
        console.log(doc.id, " => ", doc.data());
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });

  if (event.type !== "message" || event.message.type !== "text") {
    // ignore non-text-message event
    //return Promise.resolve(null);
    return client.replyMessage(event.replyToken, {
      type: "sticker",
      packageId: "1",
      stickerId: "1",
    });
  }
  if (event.message.text === "liff") {
    const liff = {
      type: "text",
      text: "https://liff.line.me/1656026157-Mbq18dv6",
    };
    return client.replyMessage(event.replyToken, liff);
  }

  if (event.message.text === "show") {
    (async function () {
      const snapshot = await db.collection("Information").get();
      snapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data().Name);
      });
    })();
  }

  (async function () {
    const res = await db.collection("messages").add({
      contents: event.message.text,
    });
    console.log("Added document with ID: ", res.id);
  })();
  // create a echoing text message
  const echo = { type: "text", text: event.message.text };

  if (event.message.text === "flex") {
    const flexmessage = {
      type: "flex",
      altText: "This is a Flex Message",
      contents: {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "button",
              action: {
                type: "uri",
                label: "輸入基本資料",
                uri: "https://liff.line.me/1656026157-Mbq18dv6",
              },
              style: "primary",
              color: "#000000",
            },
          ],
        },
      },
    };

    // use reply API
    return client.replyMessage(event.replyToken, flexmessage);
  }
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
