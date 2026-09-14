import { MongoClient } from "mongodb"; //allows Node to communicate with Mongo database.
import dotenv from 'dotenv'; //loads values from .env

dotenv.config();
const MONGO_URL = process.env.mongo_url || 'mongodb:localhost'; //gets details from .env regarding the database.
const MONGO_PORT = process.env.mongo_port || 27017;
const MONGO_DB_NAME = process.env.mongo_name;

const mongo_url = MONGO_URL; //This uses Altas instead of Compass to make the database connection. I couldn't install Compass it just wouldn't work.
const client = new MongoClient(mongo_url);
let db; //currently undefined.

 async function connectDB() { //connect DB to client.
  await client.connect();
  db = client.db(MONGO_DB_NAME);
  return db;
}

function getDB() { //returns the database. It is much safer than accessing the value directly, since it throws an error if the database isn't initalised.
  if (!db) throw new Error("DB not initialized. Call connectDB() first.");
  return db;
}
async function health(){ //sends a ping to MongoDB. ensures the client is connected to server.
    let result  = await db.command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    return result;
  } 

async function closeDB() { //Close the connection to database.
  await client.close();
  db = null;
  console.log("Database connection closed");
}
export {connectDB, getDB ,health,closeDB,db}