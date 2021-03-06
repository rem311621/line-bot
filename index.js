"use strict";

const line = require("@line/bot-sdk");
const express = require("express");
var admin = require("firebase-admin");
const firebase_Api = require("./firebase_Api");
//var serviceAccount = require("./test-line-bot-e06b0-firebase-adminsdk-ytkpy-cb6f919950.json");

admin.initializeApp({
  credential: admin.credential.cert(firebase_Api),
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
async function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    // ignore non-text-message event
    //return Promise.resolve(null);
    return client.replyMessage(event.replyToken, {
      type: "sticker",
      packageId: "1",
      stickerId: "1",
    });
  }

  (async function () {
    const res = await db.collection("messages").add({
      contents: event.message.text,
    });
    console.log("Added document with ID: ", res.id);
  })();

  const echo = { type: "text", text: event.message.text };

  if (event.message.text === "liff") {
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

  const replyref = await db
    .collection("Information")
    .where("Name", "==", event.message.text)
    .limit(1)
    .get();
  if (replyref.empty) {
    const errormsg = {
      type: "text",
      text: "抱歉沒有這個人哦",
    };
    return client.replyMessage(event.replyToken, errormsg);
  }
  let data;
  replyref.forEach((doc) => {
    data = doc.data();
  });
  const flexinfor = {
    type: "flex",
    altText: "This is a Flex Message",
    contents: {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "Information",
            align: "center",
            margin: "md",
            size: "xxl",
            weight: "bold",
            color: "#1DB446",
          },
          {
            type: "separator",
            margin: "xl",
          },
          {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: "姓名",
                    align: "center",
                    weight: "bold",
                  },
                  {
                    type: "text",
                    text: data.Name,
                    align: "center",
                  },
                ],
                paddingAll: "5px",
              },
              {
                type: "separator",
                margin: "lg",
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: "地址",
                    align: "center",
                    weight: "bold",
                  },
                  {
                    type: "text",
                    text: data.Addr,
                    align: "center",
                  },
                ],
                paddingAll: "5px",
              },
              {
                type: "separator",
                margin: "lg",
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: "電話",
                    align: "center",
                    weight: "bold",
                  },
                  {
                    type: "text",
                    text: data.Phone,
                    align: "center",
                  },
                ],
                paddingAll: "5px",
              },
              {
                type: "separator",
                margin: "lg",
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: "付款方式",
                    align: "center",
                    weight: "bold",
                  },
                  {
                    type: "text",
                    align: "center",
                    text: data.Pay,
                  },
                ],
                paddingAll: "5px",
              },
            ],
          },
        ],
      },
    },
  };
  await client.replyMessage(event.replyToken, flexinfor);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
