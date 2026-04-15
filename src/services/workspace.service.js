import ServerError from "../helpers/error.helper.js";
import workspaceRepository from "../repository/workspace.repository.js";
import memberWorkspaceService from "./memberWorkspace.service.js";

class WorkspaceService {
    async create(title, description, url_image, user_id) {
        if (!title || !description ) {
            throw new ServerError("Todos los campos son obligatorios", 400)
        }
        const workspace_created = await workspaceRepository.create(title, description, url_image)
        await memberWorkspaceService.create(
            user_id,
            workspace_created._id,
            'owner',
            'accepted'
        )
        return workspace_created
    }
    async getWorkspace(workspace_id) {
        if (!workspace_id) {
            throw new ServerError("Debe proporcionar un id", 400)
        }
        try {
            const workspace = await workspaceRepository.getById(workspace_id)
            if (!workspace) {
                throw new ServerError("El espacio de trabajo no existe", 404)
            }
            return workspace
        }
        catch (error) {
            throw error
        }
    }

    async deleteWorkspace(workspace_id) {
        if (!workspace_id) {
            throw new ServerError("Debe proporcionar un id de espacio de trabajo", 400)
        }
        
        const workspace = await workspaceRepository.getById(workspace_id)
        if (!workspace) {
            throw new ServerError("El espacio de trabajo no existe", 404)
        }

        await workspaceRepository.deleteById(workspace_id)
    }
}

const workspaceService = new WorkspaceService()

export default workspaceService