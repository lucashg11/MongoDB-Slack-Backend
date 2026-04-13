import { Router } from 'express';
import workspaceController from '../controllers/workspace.controller.js';
import authMiddleware from '../middlewares/AuthMiddleware.js';
import verifyMemberWorkspaceRoleMiddleware from '../middlewares/verifyMemberWorkspaceMiddleware.js';
import channelController from '../controllers/channel.controller.js';
import AVAILABLE_MEMBER_ROLES from '../constants/roles.constant.js';
import verifyChannelMiddleware from '../middlewares/verifyChannelMiddleware.js';

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

workspaceRouter.get('/:workspace_id/channels',
    verifyMemberWorkspaceRoleMiddleware([]),
    channelController.getChannelsByWorkspace
)

workspaceRouter.post('/:workspace_id/channels',
    verifyMemberWorkspaceRoleMiddleware([AVAILABLE_MEMBER_ROLES.OWNER, AVAILABLE_MEMBER_ROLES.ADMIN]),
    channelController.create
)

workspaceRouter.delete('/:workspace_id/channels/:channel_id',
    verifyMemberWorkspaceRoleMiddleware([AVAILABLE_MEMBER_ROLES.OWNER, AVAILABLE_MEMBER_ROLES.ADMIN]),
    verifyChannelMiddleware,
    channelController.deleteById
)

export default workspaceRouter

