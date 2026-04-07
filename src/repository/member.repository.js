
import WorkspaceMember from "../models/workspaceMember.model.js"

class WorkspaceMemberRepository {
    async create(fk_id_workspace, fk_id_user, role) {
        await WorkspaceMember.create({
            fk_id_workspace: fk_id_workspace,
            fk_id_user: fk_id_user,
            role: role
        })
    }
    async deleteById(workspace_member_id) {
        await WorkspaceMember.findByIdAndDelete(workspace_member_id)
    }
    async getById(workspace_member_id) {
        await WorkspaceMember.findById(workspace_member_id)
    }
    async updateRoleById(member_id, role) {
        const new_workspace_member = await WorkspaceMember.findByIdAndUpdate(
            member_id,
            { role: role },
            { returnDocument: 'after' }
        )
        return new_workspace_member
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

                    user_id: member.fk_id_user._id,
                    user_name: member.fk_id_user.name,
                    user_email: member.fk_id_user.email,

                    /*workspace_id: member.fk_id_workspace._id,
                    workspace_title: member.fk_id_workspace.title,
                    workspace_description: member.fk_id_workspace.description*/
                }
            }
        )
        console.log(members_mapped)
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
        return await WorkspaceMember.find({ workspace_id, user_id })
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