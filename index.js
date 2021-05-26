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
        return client.replyMessage(event.replyToken, doc.data().Name);
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
        type: "carousel",
        contents: [
          {
            type: "bubble",
            hero: {
              type: "image",
              size: "full",
              aspectRatio: "20:13",
              aspectMode: "cover",
              url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_5_carousel.png",
            },
            body: {
              type: "box",
              layout: "vertical",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "Arm Chair, White",
                  wrap: true,
                  weight: "bold",
                  size: "xl",
                },
                {
                  type: "box",
                  layout: "baseline",
                  contents: [
                    {
                      type: "text",
                      text: "$49",
                      wrap: true,
                      weight: "bold",
                      size: "xl",
                      flex: 0,
                    },
                    {
                      type: "text",
                      text: ".99",
                      wrap: true,
                      weight: "bold",
                      size: "sm",
                      flex: 0,
                    },
                  ],
                },
              ],
            },
            footer: {
              type: "box",
              layout: "vertical",
              spacing: "sm",
              contents: [
                {
                  type: "button",
                  style: "primary",
                  action: {
                    type: "uri",
                    label: "Add to Cart",
                    uri: "https://linecorp.com",
                  },
                },
                {
                  type: "button",
                  action: {
                    type: "uri",
                    label: "Add to wishlist",
                    uri: "https://linecorp.com",
                  },
                },
              ],
            },
          },
          {
            type: "bubble",
            hero: {
              type: "image",
              size: "full",
              aspectRatio: "20:13",
              aspectMode: "cover",
              url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_6_carousel.png",
            },
            body: {
              type: "box",
              layout: "vertical",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "Metal Desk Lamp",
                  wrap: true,
                  weight: "bold",
                  size: "xl",
                },
                {
                  type: "box",
                  layout: "baseline",
                  flex: 1,
                  contents: [
                    {
                      type: "text",
                      text: "$11",
                      wrap: true,
                      weight: "bold",
                      size: "xl",
                      flex: 0,
                    },
                    {
                      type: "text",
                      text: ".99",
                      wrap: true,
                      weight: "bold",
                      size: "sm",
                      flex: 0,
                    },
                  ],
                },
                {
                  type: "text",
                  text: "Temporarily out of stock",
                  wrap: true,
                  size: "xxs",
                  margin: "md",
                  color: "#ff5551",
                  flex: 0,
                },
              ],
            },
            footer: {
              type: "box",
              layout: "vertical",
              spacing: "sm",
              contents: [
                {
                  type: "button",
                  flex: 2,
                  style: "primary",
                  color: "#aaaaaa",
                  action: {
                    type: "uri",
                    label: "Add to Cart",
                    uri: "https://linecorp.com",
                  },
                },
                {
                  type: "button",
                  action: {
                    type: "uri",
                    label: "Add to wish list",
                    uri: "https://linecorp.com",
                  },
                },
              ],
            },
          },
          {
            type: "bubble",
            hero: {
              type: "image",
              url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png",
              size: "full",
              aspectRatio: "20:13",
              aspectMode: "cover",
            },
            body: {
              type: "box",
              layout: "vertical",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "Metal Desk Lamp",
                  wrap: true,
                  weight: "bold",
                  size: "xl",
                },
                {
                  type: "box",
                  layout: "baseline",
                  flex: 1,
                  contents: [
                    {
                      type: "text",
                      text: "$11",
                      wrap: true,
                      weight: "bold",
                      size: "xl",
                      flex: 0,
                    },
                    {
                      type: "text",
                      text: ".99",
                      wrap: true,
                      weight: "bold",
                      size: "sm",
                      flex: 0,
                    },
                  ],
                },
              ],
            },
            footer: {
              type: "box",
              layout: "vertical",
              spacing: "sm",
              contents: [
                {
                  type: "button",
                  flex: 2,
                  style: "primary",
                  action: {
                    type: "uri",
                    label: "Add to Cart",
                    uri: "https://linecorp.com",
                  },
                },
                {
                  type: "button",
                  action: {
                    type: "uri",
                    label: "Add to wish list",
                    uri: "https://linecorp.com",
                  },
                },
              ],
            },
          },
        ],
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
