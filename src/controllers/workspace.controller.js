import ServerError from "../helpers/error.helper.js"
import workspaceMemberRepository from "../repository/member.repository.js"
import workspaceService from "../services/workspace.service.js";
import memberWorkspaceService from "../services/memberWorkspace.service.js";
import ENVIRONMENT from "../config/env.config.js";

class WorkspaceController {
    async getWorkspaces(req, res, next) {
        try {
            const user = req.user
            const workspaces = await workspaceMemberRepository.getWorkspaceListByUserId(user.id);
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
            const { title, description, url_image } = req.body
            await workspaceService.create(
                title,
                description,
                url_image || '',
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
        const { workspace_id } = req.params
        try {
            const result = await memberWorkspaceService.respondToInvitation(token)
            res.status(200).send(
                `
                <body style="margin:0; padding: 0;">
                    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; background-color: #655dd4; font-family: sans-serif; color: white;">
                        <h1 style="margin:0; padding: 0; font-family: sans-serif;">Invitación aceptada</h1>
                        <p id="countdown" style="font-size: 1.2rem; margin-top: 1rem; font-family: sans-serif;">Serás redirigido en 3 segundos...</p>
                    </div>
                </body>
                <script>
                    let seconds = 3;
                    const countdownElement = document.getElementById('countdown');
                    const interval = setInterval(() => {
                        seconds--;
                        if (seconds > 0) {
                            countdownElement.innerText = \`Serás redirigido en \${seconds} segundos...\`;
                        } else {
                            clearInterval(interval);
                            countdownElement.innerText = "Redirigiendo...";
                            window.history.back();
                            setTimeout(() => {
                                window.location.href = "${ENVIRONMENT.URL_FRONTEND}/workspace/${result.workspace_id}";
                            }, 1000);
                        }
                    }, 1000);
                </script>
                `
            )
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

    async updateWorkspace(req, res, next) {
        const { workspace_id } = req.params
        const { title, description, url_image } = req.body
        try {
            const updatedWorkspace = await workspaceService.updateWorkspace(workspace_id, { title, description, url_image })
            res.json({
                ok: true,
                status: 200,
                message: 'Espacio de trabajo actualizado con éxito',
                data: {
                    workspace: updatedWorkspace
                }
            })
        } catch (error) {
            next(error);
        }
    }

    async deleteWorkspace(req, res, next) {
        const { workspace_id } = req.params
        const requesting_member = req.workspace_member

        try {
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