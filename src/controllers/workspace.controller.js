import ServerError from "../helpers/error.helper.js"
import workspaceMemberRepository from "../repository/member.repository.js"
import workspaceService from "../services/workspace.service.js";
import memberWorkspaceService from "../services/memberWorkspace.service.js";

class WorkspaceController {
    async getWorkspaces(req, res, next) {
        try {
            const user = req.user
            const workspaces = await workspaceMemberRepository.getWorkspaceListByUserId(user.id);
            console.log(workspaces)
            res.json(
                {
                    ok: true,
                    status: 200,
                    message: 'Espacios de trabajos obtenidos',
                    data: {
                        workspaces
                    }
                }
            )
        }
        catch (error) {
            next(error);
        }
    }

    async createWorkspace(req, res, next) {
        try {
            const user = req.user
            const { title, description } = req.body
            await workspaceService.create(
                title,
                description,
                '',
                user.id
            )

            return res.status(201).json(
                {
                    ok: true,
                    status: 201,
                    message: "Espacio de trabajo creado exitosamente",
                }
            )
        }
        catch (error) {
            next(error);
        }
    }

    async getWorkspaceById(req, res, next) {
        const { workspace_id } = req.params
        try {
            const workspace = await workspaceService.getWorkspace(workspace_id)
            const members = await workspaceMemberRepository.getMemberList(workspace_id)
            res.json(
                {
                    ok: true,
                    status: 200,
                    message: 'Espacio de trabajo obtenido',
                    data: {
                        workspace,
                        members: members
                    }
                }
            )
        }
        catch (error) {
            next(error);
        }
    }

    async getWorkspaceMembers(req, res, next) {
        const { workspace_id } = req.params
        try {
            const members = await memberWorkspaceService.getWorkspaceMembersList(workspace_id)
            res.json({
                ok: true,
                status: 200,
                message: 'Miembros del espacio de trabajo obtenidos',
                data: {
                    members
                }
            })
        } catch (error) {
            next(error);
        }
    }

    async inviteMember(req, res, next) {
        const { workspace_id } = req.params
        const { email, role } = req.body
        try {
            await memberWorkspaceService.inviteMember(workspace_id, email, role)
            res.status(201).json({
                ok: true,
                status: 201,
                message: 'Invitación enviada con éxito'
            })
        } catch (error) {
            next(error);
        }
    }

    async respondToInvitation(req, res, next) {
        const { token } = req.query
        try {
            const result = await memberWorkspaceService.respondToInvitation(token)
            return res.status(200).json({
                ok: true,
                status: 200,
                message: `Invitacion ${result.acceptInvitation} con exito`,
                data: result
            })
        } catch (error) {
            next(error);
        }
    }

    async updateMemberRole(req, res, next) {
        const { workspace_id, member_id } = req.params
        const { role } = req.body
        const currentMember = req.workspace_member
        const currentUserId = req.user.id

        try {
            await memberWorkspaceService.updateMemberRole(
                workspace_id,
                member_id,
                role,
                currentMember,
                currentUserId
            )
            res.status(200).json({
                ok: true,
                status: 200,
                message: 'Role del miembro actualizado con éxito'
            })
        } catch (error) {
            next(error);
        }
    }

    async removeMember(req, res, next) {
        const { workspace_id, member_id } = req.params
        const requesting_member = req.workspace_member
        try {
            await memberWorkspaceService.removeMember(workspace_id, member_id, requesting_member)
            res.json({
                ok: true,
                status: 200,
                message: 'Miembro eliminado exitosamente'
            })
        } catch (error) {
            next(error);
        }
    }

    async deleteWorkspace(req, res, next) {
        const { workspace_id } = req.params
        const requesting_member = req.workspace_member

        try {
            // Solo OWNER o ADMIN pueden eliminar el workspace
            if (!['owner', 'admin'].includes(requesting_member.role)) {
                throw new ServerError("No tienes permisos para eliminar este espacio de trabajo", 403)
            }

            await workspaceService.deleteWorkspace(workspace_id)
            res.json({
                ok: true,
                status: 200,
                message: 'Espacio de trabajo eliminado exitosamente'
            })
        } catch (error) {
            next(error);
        }
    }
}
const workspaceController = new WorkspaceController()

export default workspaceController