import ServerError from "../helpers/error.helper.js"
import workspaceMemberRepository from "../repository/member.repository.js"

class MemberWorkspaceService {
    async getMemberList(user_id) {
        const workspaces_list = await workspaceMemberRepository.getMemberList(user_id)
        return workspaces_list
    }

    async create(user_id, workspace_id, role) {
        const result = await workspaceMemberRepository.getByWorkspaceAndUserId(workspace_id, user_id)
        if (result.length > 0) {
            throw new ServerError("El usuario ya es miembro del workspace")
        }
        await workspaceMemberRepository.create(user_id, workspace_id, role)
    }

    async getWorkspaceMembersList(workspace_id) {
        if (!workspace_id) {
            throw new ServerError("Debe proporcionar un id de workspace", 400)
        }
        try {
            const members = await workspaceMemberRepository.getMemberList(workspace_id)
            return members
        }
        catch (error) {
            throw error
        }
    }
}

const memberWorkspaceService = new MemberWorkspaceService()

export default memberWorkspaceService