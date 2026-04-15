import { Router } from 'express';
import workspaceController from '../controllers/workspace.controller.js';
import authMiddleware from '../middlewares/AuthMiddleware.js';
import verifyMemberWorkspaceRoleMiddleware from '../middlewares/verifyMemberWorkspaceMiddleware.js';
import channelController from '../controllers/channel.controller.js';
import AVAILABLE_MEMBER_ROLES from '../constants/roles.constant.js';
import verifyChannelMiddleware from '../middlewares/verifyChannelMiddleware.js';



const workspaceRouter = Router()

//Rutas sin Autenticacion (token en query string)
workspaceRouter.get('/:workspace_id/member/respond',
    workspaceController.respondToInvitation
)

//Rutas con Autenticacion
workspaceRouter.use(authMiddleware)

//Rutas de workspace

//Listar todos los workspaces a los que pertenece el usuario
workspaceRouter.get('/',
    workspaceController.getWorkspaces
)

//Crear un nuevo workspace
workspaceRouter.post('/',
    workspaceController.createWorkspace
)



//Obtener un workspace por id
workspaceRouter.get('/:workspace_id',
    verifyMemberWorkspaceRoleMiddleware([]),
    workspaceController.getWorkspaceById
)

//Eliminar un workspace (Solo OWNER o ADMIN pueden eliminarlo)
workspaceRouter.delete('/:workspace_id',
    verifyMemberWorkspaceRoleMiddleware([AVAILABLE_MEMBER_ROLES.OWNER, AVAILABLE_MEMBER_ROLES.ADMIN]),
    workspaceController.deleteWorkspace
)

//RUTAS DE CANALES

// Obtener canales por workspace
workspaceRouter.get('/:workspace_id/channels',
    verifyMemberWorkspaceRoleMiddleware([]),
    channelController.getChannelsByWorkspace
)

// Crear canal en un workspace
workspaceRouter.post('/:workspace_id/channels',
    verifyMemberWorkspaceRoleMiddleware([AVAILABLE_MEMBER_ROLES.OWNER, AVAILABLE_MEMBER_ROLES.ADMIN]),
    channelController.create
)

// Eliminar canal por id
workspaceRouter.delete('/:workspace_id/channels/:channel_id',
    verifyMemberWorkspaceRoleMiddleware([AVAILABLE_MEMBER_ROLES.OWNER, AVAILABLE_MEMBER_ROLES.ADMIN]),
    verifyChannelMiddleware,
    channelController.deleteById
)


//RUTAS DE MIEMBROS DEL WORKSPACE

// Listar miembros del workspace
workspaceRouter.get('/:workspace_id/member',
    verifyMemberWorkspaceRoleMiddleware([]),
    workspaceController.getWorkspaceMembers
)

// Invitar miembro al workspace
workspaceRouter.post(
    '/:workspace_id/member/invite',
    verifyMemberWorkspaceRoleMiddleware([AVAILABLE_MEMBER_ROLES.OWNER, AVAILABLE_MEMBER_ROLES.ADMIN]),
    workspaceController.inviteMember
)

// Cambiar rol de un miembro del workspace (Solo OWNERS o ADMINS pueden relizar esta accion)
workspaceRouter.put(
    '/:workspace_id/member/:member_id',
    verifyMemberWorkspaceRoleMiddleware(['admin', 'owner']),
    workspaceController.updateMemberRole
)

// Eliminar miembro del workspace (Un usuario comun solo puede eliminarse a si mismo, un admin puede eliminar a cualquier miembro excepto a un owner, un owner puede eliminar a cualquier miembro)
workspaceRouter.delete(
    '/:workspace_id/member/:member_id',
    verifyMemberWorkspaceRoleMiddleware([]),
    workspaceController.removeMember
)

// RUTAS DE MENSAJES EN CANALES

// Obtener mensajes de un canal del workspace
workspaceRouter.get(
    '/:workspace_id/channels/:channel_id/message',
    verifyMemberWorkspaceRoleMiddleware([]),
    channelController.getMessages
)


// Crear mensaje en un canal del workspace
workspaceRouter.post(
    '/:workspace_id/channels/:channel_id/message',
    verifyMemberWorkspaceRoleMiddleware([]),
    channelController.createMessage
)




export default workspaceRouter

