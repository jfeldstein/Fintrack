require('dotenv').config();
const path = require("path");
const bodyParser = require("body-parser");
const express = require("express");
const plaid = require("plaid");
const volleyball = require("volleyball");
const cors = require("cors");
const PORT = process.env.SERVER_PORT || 3000;
const app = express();
require("../secret");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let ACCESS_TOKEN = null;
let PUBLIC_TOKEN = null;

const client = new plaid.Client(
  process.env.PLAID_CLIENT_ID,
  process.env.PLAID_SECRET_KEY,
  process.env.PLAID_PUBLIC_KEY,
  process.env.NODE_ENV === "production" ? plaid.environments.production : plaid.environments.development
);

app.use(volleyball);
app.use(cors());

let file = process.env.NODE_ENV === "production" ? "build" : "public";
app.use(express.static(path.join(__dirname, "..", file)));

app.post("/get_access_token", async function(request, response, next) {
  PUBLIC_TOKEN = await request.body.public_token;

  await client.exchangePublicToken(PUBLIC_TOKEN, function(
    error,
    tokenResponse
  ) {
    console.log("/get_access_token", error, tokenResponse);
    if (error != null) {
      return response.status(500).json(error);
    }
    ACCESS_TOKEN = tokenResponse.access_token;
    ITEM_ID = tokenResponse.item_id;

    response.json({ error: false });
  });
});

app.post("/auth/get", (req, res, next) => {
  client.getAuth(ACCESS_TOKEN, {}, (err, results) => {
    // Handle err
    console.log("/auth/get", err, results);
    var accountData = results.accounts;
    // if (results.numbers.ach.length > 0) {
    //   // Handle ACH numbers (US accounts)
    //   var achNumbers = results.numbers.ach;
    // } else if (results.numbers.eft.length > 0) {
    //   // Handle EFT numbers (Canadian accounts)
    //   var eftNumbers = results.numbers.eft;
    // }

    res.json(accountData);
  });
});

app.post("/transaction/get", (req, res, next) => {
  client.getTransactions(
    ACCESS_TOKEN,

    // TODO Update to use live dates
    "2019-01-01",
    "2019-09-15",
    {
      count: 250,
      offset: 0
    },
    (err, result) => {
      console.log("/transactions/get", err, result);
      // Handle err
      const transactions = result.transactions;
      res.json(transactions);
    }
  );
});

app.post("/accounts/balance/get", (req, res, next) => {
  client.getBalance(ACCESS_TOKEN, (err, result) => {
    console.log("/accounts/balance/get", err, result);
    // Handle err
    // Each account has up-to-date balance information associated with it
    const item = result.accounts;

    res.json(item);
  });
});

app.post("/identity/get", (req, res, next) => {
  // Retrieve Identity data for an Item
  client.getIdentity(ACCESS_TOKEN, function(err, result) {
    console.log("/identity/get", err, result);
    // Handle err
    const info = result.info;
    res.json(info);
  });
});

app.post("/income/get", (req, res, next) => {
  client.getIncome(ACCESS_TOKEN, function(err, result) {
    console.log("/income/get", err, result);
    // Handle err
    var income = 0;
    if (result) {
      var income = result.income;
    }
    res.json(income);
  });
});

app.listen(PORT);
