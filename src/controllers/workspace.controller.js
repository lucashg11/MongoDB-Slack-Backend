import ServerError from "../helpers/error.helper.js"
import workspaceMemberRepository from "../repository/member.repository.js"
import workspaceRepository from "../repository/workspace.repository.js";
import workspaceService from "../services/workspace.service.js";

class WorkspaceController {
    async getWorkspaces(req, res) {
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
            if (error instanceof ServerError) {
                return res.status(error.status).json(
                    {
                        ok: false,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            else {
                console.log("error inesperado en el registro", error)
                return res.status(500).json(
                    {
                        ok: false,
                        status: 500,
                        message: "Internal Server Error"
                    }
                )
            }
        }
    }

    async createWorkspace(req, res) {
        try {
            const user = req.user
            const { title, description } = req.body
            await workspaceService.create(
                title,
                description,
                "",
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
            if (error instanceof ServerError) {
                return res.status(error.status).json(
                    {
                        ok: false,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            else {
                console.log("error inesperado en el registro", error)
                return res.status(500).json(
                    {
                        ok: false,
                        status: 500,
                        message: "Internal Server Error"
                    }
                )
            }
        }
    }

    async getWorkspaceById(req, res) {
        const { workspace_id } = req.params
        try {
            const workspace = await workspaceService.getWorkspace(workspace_id)
            const members = await workspaceMemberRepository.getWorkspaceMembers(workspace_id)
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
            if (error instanceof ServerError) {
                return res.status(error.status).json(
                    {
                        ok: false,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            else {
                console.log("error inesperado en el registro", error)
                return res.status(500).json(
                    {
                        ok: false,
                        status: 500,
                        message: "Internal Server Error"
                    }
                )
            }
        }
    }
}
const workspaceController = new WorkspaceController()

export default workspaceController