import connectMongoDB from "./config/mongoDB.config.js";
import express from "express";
import cors from "cors";
import ENVIRONMENT from "./config/env.config.js";
import authRouter from "./routes/auth.router.js";
import workspaceRouter from './routes/workspace.router.js';

connectMongoDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use('/api/workspace', workspaceRouter);

app.listen(ENVIRONMENT.PORT, () => {
  console.log(`Servidor iniciado en el puerto ${ENVIRONMENT.PORT}`);
});
