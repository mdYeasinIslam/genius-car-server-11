const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const dbUser = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const uri = `mongodb+srv://${dbUser}:${password}@cluster0.bfv30pl.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
module.exports = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

