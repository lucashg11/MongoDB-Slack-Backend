import { Router } from 'express';
import workspaceController from '../controllers/workspace.controller.js';
import authMiddleware from '../middlewares/AuthMiddleware.js';
import verifyMemberWorkspaceRoleMiddleware from '../middlewares/veifyMemberWorkspaceMiddleware.js';

const workspaceRouter = Router()
workspaceRouter.use(authMiddleware)


workspaceRouter.get('/',
    workspaceController.getWorkspaces
)

workspaceRouter.post('/',
    workspaceController.createWorkspace
)

workspaceRouter.get('/:workspace_id',
    verifyMemberWorkspaceRoleMiddleware([]),
    workspaceController.getWorkspaceById
)

export default workspaceRouter

