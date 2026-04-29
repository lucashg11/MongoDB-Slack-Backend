import connectMongoDB from "./config/mongoDB.config.js";
import express from "express";
import cors from "cors";
import ENVIRONMENT from "./config/env.config.js";
import authRouter from "./routes/auth.router.js";
import workspaceRouter from './routes/workspace.router.js';
import userRouter from './routes/user.router.js';
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware.js";
import fileRouter from "./routes/file.router.js";

connectMongoDB();

const app = express();


app.use(cors({
    origin: (origin, callback) => {
      if(!origin || ENVIRONMENT.MODE === "dev"){
        callback(null, true);
      }
      else if (ENVIRONMENT.URL_FRONTEND_PROD.includes(origin) || ENVIRONMENT.URL_FRONTEND.includes(origin)) {
        callback(null, true);
      }
      else {
        callback(new ServerError("No autorizado", 403));
      }
    }
  })
)
app.use(express.json());


app.use("/api/auth", authRouter);
app.use('/api/workspace', workspaceRouter);
app.use('/api/user', userRouter);

app.use('/api/file', fileRouter);

app.use(errorHandlerMiddleware);

app.listen(ENVIRONMENT.PORT, () => {
  console.log(`Servidor iniciado en el puerto ${ENVIRONMENT.PORT}`);
});
