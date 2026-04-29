import { Router } from 'express';
import workspaceController from '../controllers/workspace.controller.js';
import authMiddleware from '../middlewares/AuthMiddleware.js';
import verifyMemberWorkspaceRoleMiddleware from '../middlewares/verifyMemberWorkspaceMiddleware.js';
import channelController from '../controllers/channel.controller.js';
import AVAILABLE_MEMBER_ROLES from '../constants/roles.constant.js';
import verifyChannelMiddleware from '../middlewares/verifyChannelMiddleware.js';



const workspaceRouter = Router()


workspaceRouter.get('/:workspace_id/member/respond',
    workspaceController.respondToInvitation
)


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


workspaceRouter.delete('/:workspace_id',
    verifyMemberWorkspaceRoleMiddleware([AVAILABLE_MEMBER_ROLES.OWNER, AVAILABLE_MEMBER_ROLES.ADMIN]),
    workspaceController.deleteWorkspace
)


workspaceRouter.patch('/:workspace_id',
    verifyMemberWorkspaceRoleMiddleware([AVAILABLE_MEMBER_ROLES.OWNER, AVAILABLE_MEMBER_ROLES.ADMIN]),
    workspaceController.updateWorkspace
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


workspaceRouter.get('/:workspace_id/member',
    verifyMemberWorkspaceRoleMiddleware([]),
    workspaceController.getWorkspaceMembers
)


workspaceRouter.post(
    '/:workspace_id/member/invite',
    verifyMemberWorkspaceRoleMiddleware([AVAILABLE_MEMBER_ROLES.OWNER, AVAILABLE_MEMBER_ROLES.ADMIN]),
    workspaceController.inviteMember
)

workspaceRouter.put(
    '/:workspace_id/member/:member_id',
    verifyMemberWorkspaceRoleMiddleware(['admin', 'owner']),
    workspaceController.updateMemberRole
)


workspaceRouter.delete(
    '/:workspace_id/member/:member_id',
    verifyMemberWorkspaceRoleMiddleware([]),
    workspaceController.removeMember
)


workspaceRouter.get(
    '/:workspace_id/channels/:channel_id/message',
    verifyMemberWorkspaceRoleMiddleware([]),
    channelController.getMessages
)



workspaceRouter.post(
    '/:workspace_id/channels/:channel_id/message',
    verifyMemberWorkspaceRoleMiddleware([]),
    channelController.createMessage
)

workspaceRouter.post(
    '/:workspace_id/channels/:channel_id/invite',
    verifyMemberWorkspaceRoleMiddleware([AVAILABLE_MEMBER_ROLES.OWNER, AVAILABLE_MEMBER_ROLES.ADMIN]),
    verifyChannelMiddleware,
    channelController.inviteMember
)




export default workspaceRouter

