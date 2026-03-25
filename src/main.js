import connectMongoDB from "./config/mongoDB.config.js";
import express from "express";
import cors from "cors";
import ENVIRONMENT from "./config/env.config.js";
import authRouter from "./routes/auth.router.js";
import authMiddleware from "./middlewares/AuthMiddleware.js";
import workspaceRouter from './routes/workspace.router.js';
//import workspaceRepository from './repository/workspace.repository.js';
//import workspaceMemberRepository from "./repository/member.repository.js";






connectMongoDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use('/api/workspace', workspaceRouter);

app.get('/api/test',
  authMiddleware,
  (req, res) => {
    const { user } = req
    res.send('ok', 'vos sos: ' + user.id)
  })

app.listen(ENVIRONMENT.PORT, () => {
  console.log(`Servidor iniciado en el puerto ${ENVIRONMENT.PORT}`);
});

/* mailerTransporter.sendMail({
    from: ENVIRONMENT.EMAIL_USER,
    to: ENVIRONMENT.EMAIL_USER,
    subject: "Correo de prueba",
    html: "<h1>Hola, este es un correo de prueba</h1>",
}) */

/* workspaceRepository.create('test', 'lorem', '', true); */
/* workspaceMemberRepository.create('69c2072ccb47058762528a9a', '69c1fba0a5aabd5519a16f6c', 'owner') */