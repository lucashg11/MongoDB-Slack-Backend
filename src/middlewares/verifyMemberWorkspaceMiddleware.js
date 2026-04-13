import ServerError from "../helpers/error.helper.js"
import workspaceMemberRepository from "../repository/member.repository.js"

function verifyMemberWorkspaceRoleMiddleware(valid_roles = []) {
    return async function (req, res, next) {
        try {
            const user = req.user
            const workspace_id = req.params.workspace_id
            if (!workspace_id) {
                throw new ServerError(
                    {
                        status: 400,
                        message: "Workspace ID is required",
                        ok: false
                    }
                )
            }
            const workspace_member = await workspaceMemberRepository.getByWorkspaceAndUserId(
                user.id,
                workspace_id
            )
            if (!workspace_member) {
                throw new ServerError(
                    {
                        status: 403,
                        message: "El usuario no pertenece al workspace o no tiene permisos para acceder",
                        ok: false
                    }
                )
            }
            if (valid_roles.length >= 1 && !valid_roles.includes(workspace_member.role)) {
                throw new ServerError(
                    {
                        status: 403,
                        message: "El usuario no tiene permisos para acceder",
                        ok: false
                    }
                )
            }
            req.workspace_member = workspace_member
            next()
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
                console.log("Error al verificar espacio de trabajo y membresia", error)
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

export default verifyMemberWorkspaceRoleMiddleware