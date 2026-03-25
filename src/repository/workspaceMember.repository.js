import WorkspaceMember from "../models/workspaceMember.model.js";

class WorkspaceMemberRepository {
  async create(fk_workspace_id, fk_user_id, role) {
    const new_workspace_member = await WorkspaceMember.create({
      fk_id_workspace: fk_workspace_id,
      fk_id_user: fk_user_id,
      role: role,
    });
    return new_workspace_member;
  }
  async deleteById(id_member) {
    await WorkspaceMember.findByIdAndDelete(id_member);
  }

  async updateRoleById(id_member, role) {
    const workspace_members = await WorkspaceMember.findByIdAndUpdate(
      id_member,
      { role: role },
      { new: true },
    );
    return workspace_members;
  }

  async getMemberList(fk_workspace_id) {
    const workspace_members = await WorkspaceMember.find({
      fk_id_workspace: fk_workspace_id,
    })
      .populate("fk_id_user", "name email")
      .populate("fk_id_workspace", "title description");

    const member_list = workspace_members.map((member) => {
      return {
        member_id: member._id,
        user_id: member.fk_id_user._id,
        user_name: member.fk_id_user.name,
        user_email: member.fk_id_user.email,
        member_role: member.role,
        member_created_at: member.created_at,
        workspace_id: member.fk_id_workspace._id,
        workspace_title: member.fk_id_workspace.title,
        workspace_description: member.fk_id_workspace.description,
      };
    });
    console.log(member_list);
    return member_list;
  }
}

const workspaceMemberRepository = new WorkspaceMemberRepository();

export default workspaceMemberRepository;
