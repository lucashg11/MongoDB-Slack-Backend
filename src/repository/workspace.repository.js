import Workspace from "../models/workspace.model.js";

class WorkspaceRepository {
  async create(title, description, url_image, active) {
    const user = await Workspace.create({
      title: title,
      description: description, 
      url_image,
      active
    })
    console.log("workspace created: ", user)
  }
  async deleteById(workspace_id) {
    await Workspace.findByIdAndDelete(workspace_id);
  }
  async getById(workspace_id) {
    return await Workspace.findById(workspace_id);
  }

  async updateById(workspace_id, new_workspace_props) {
    const new_user = Workspace.findByIdAndUpdate(
      workspace_id, 
      new_workspace_props, 
      { returnDocument: 'after' }
    )
    return new_user
  }
}

const workspaceRepository = new WorkspaceRepository();

export default workspaceRepository;
