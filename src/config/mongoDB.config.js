import mongoose from "mongoose";
import ENVIRONMENT from "./env.config.js";

async function connectMongoDB() {
  try {
    await mongoose.connect(ENVIRONMENT.MONGODB_CONNECTION_STRING);
    console.log("Conexion Exitosa");
  } 
  catch (error) {
    console.log("Error de conexion", error);
  }
}

export default connectMongoDB;
