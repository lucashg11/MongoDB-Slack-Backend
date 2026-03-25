/* 
/api/workspace
Trae todos los espacios de trabajo asociados al usuario
Para saber que espacios de trabajo traer, NECESITAMOS EL ID DEL USUARIO
*/

import {Router} from 'express';
import workspaceController from '../controllers/workspace.controller.js';
import authMiddleware from '../middlewares/AuthMiddleware.js';

const workspaceRouter = Router()


workspaceRouter.get('/',
    authMiddleware, 
    workspaceController.getWorkspaces
)

export default workspaceRouter