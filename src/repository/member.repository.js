
import WorkspaceMember from "../models/workspaceMember.model.js"
import ServerError from "../helpers/error.helper.js"

class WorkspaceMemberRepository {
    async create(fk_id_user, fk_id_workspace, role, email, acceptInvitation = 'pending') {
        try {
            return await WorkspaceMember.create({
                fk_id_user: fk_id_user,
                fk_id_workspace: fk_id_workspace,
                role: role,
                email: email,
                acceptInvitation: acceptInvitation
            });
        } catch (error) {
            if (error.name === "CastError") {
                throw new ServerError("ID de usuario o espacio de trabajo inválido", 400);
            }
            if (error.name === "ValidationError") {
                const messages = Object.values(error.errors).map(e => e.message);
                throw new ServerError(`Validación fallida: ${messages.join(", ")}`, 400);
            }
            if (error.code === 11000) {
                const field = Object.keys(error.keyPattern)[0];
                throw new ServerError(`El ${field} ya existe en este espacio de trabajo`, 409);
            }
            throw error;
        }
    }
    async deleteById(workspace_member_id) {
        await WorkspaceMember.findByIdAndDelete(workspace_member_id)
    }
    async getById(workspace_member_id) {
        try {
            return await WorkspaceMember.findById(workspace_member_id);
        } catch (error) {
            if (error.name === "CastError") {
                throw new ServerError("ID de miembro inválido", 400);
            }
            throw error;
        }
    }
    async updateRoleById(member_id, role) {
        try {
            const new_workspace_member = await WorkspaceMember.findByIdAndUpdate(
                member_id,
                { role: role },
                { returnDocument: 'after', new: true }
            );
            return new_workspace_member;
        } catch (error) {
            if (error.name === "CastError") {
                throw new ServerError("ID de miembro inválido", 400);
            }
            if (error.name === "ValidationError") {
                const messages = Object.values(error.errors).map(e => e.message);
                throw new ServerError(`Validación fallida: ${messages.join(", ")}`, 400);
            }
            throw error;
        }
    }

    async updateInvitationStatus(member_id, status) {
        const updated_member = await WorkspaceMember.findByIdAndUpdate(
            member_id,
            { acceptInvitation: status },
            { returnDocument: 'after' }
        )
        return updated_member
    }

    async getAll() {
        await WorkspaceMember.find()
    }

    async getMemberList(fk_id_workspace) {

        const members = await WorkspaceMember.find({ fk_id_workspace: fk_id_workspace })
            .populate('fk_id_user', 'name email')
        /*.populate('fk_id_workspace', 'title description')*/

        const members_mapped = members.map(
            (member) => {
                return {
                    member_id: member._id,
                    member_role: member.role,
                    member_created_at: member.created_at,

                    user_id: member.fk_id_user?._id || null,
                    user_name: member.fk_id_user?.name || "Invited User",
                    user_email: member.fk_id_user?.email || member.email,
                    acceptInvitation: member.acceptInvitation,

                    /*workspace_id: member.fk_id_workspace._id,
                    workspace_title: member.fk_id_workspace.title,
                    workspace_description: member.fk_id_workspace.description*/
                }
            }
        )
        return members_mapped
    }

    async getWorkspaceListByUserId(user_id) {
        const members = await WorkspaceMember.find({ fk_id_user: user_id })
            .populate('fk_id_workspace', 'title description url_image')

        const member_mapped = members.map(
            (member) => {
                return {
                    member_id: member.id,
                    member_role: member.role,
                    member_created_at: member.created_at,

                    workspace_id: member.fk_id_workspace?._id,
                    workspace_title: member.fk_id_workspace?.title,
                    workspace_description: member.fk_id_workspace?.description,
                    workspace_img: member.fk_id_workspace?.url_image
                }

            }
        )
        return member_mapped
    }
    async getByWorkspaceAndUserId(user_id, workspace_id) {
        try {
            return await WorkspaceMember.findOne({
                fk_id_user: user_id,
                fk_id_workspace: workspace_id
            });
        } catch (error) {
            if (error.name === "CastError") {
                throw new ServerError("ID de usuario o espacio de trabajo inválido", 400);
            }
            throw error;
        }
    }

    async getByWorkspaceAndEmail(email, workspace_id) {
        try {
            return await WorkspaceMember.findOne({
                email: email,
                fk_id_workspace: workspace_id
            });
        } catch (error) {
            if (error.name === "CastError") {
                throw new ServerError("ID de espacio de trabajo inválido", 400);
            }
            throw error;
        }
    }

    async updateAcceptInvitation(member_id, status) {
        await WorkspaceMember.findByIdAndUpdate(member_id, { acceptInvitation: status })
    }

    async isMemberPartOfWorkspaceById(user_id, workspace_id) {
        const member = await WorkspaceMember.findOne({
            fk_id_user: user_id,
            fk_id_workspace: workspace_id
        })
        return member
    }

    
}
const workspaceMemberRepository = new WorkspaceMemberRepository()
export default workspaceMemberRepository