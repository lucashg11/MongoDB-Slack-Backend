import Workspace from "../models/workspace.model.js";
import ServerError from "../helpers/error.helper.js";

class WorkspaceRepository {
  async create(title, description, url_image, active) {
    try {
      const workspace = await Workspace.create({
        title: title,
        description: description,
        url_image,
        active
      });
      return workspace;
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        throw new ServerError(`El campo '${field}' ya existe`, 409);
      }
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map(e => e.message);
        throw new ServerError(`Validación fallida: ${messages.join(", ")}`, 400);
      }
      throw error;
    }
  }
  async deleteById(workspace_id) {
    await Workspace.findByIdAndDelete(workspace_id);
  }
  async getById(workspace_id) {
    try {
      return await Workspace.findById(workspace_id);
    } catch (error) {
      if (error.name === "CastError") {
        throw new ServerError("ID de espacio de trabajo inválido", 400);
      }
      throw error;
    }
  }

  async updateById(workspace_id, new_workspace_props) {
    try {
      const new_user = await Workspace.findByIdAndUpdate(
        workspace_id,
        new_workspace_props,
        { returnDocument: 'after' }
      );
      return new_user;
    } catch (error) {
      if (error.name === "CastError") {
        throw new ServerError("ID de espacio de trabajo inválido", 400);
      }
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map(e => e.message);
        throw new ServerError(`Validación fallida: ${messages.join(", ")}`, 400);
      }
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        throw new ServerError(`El campo '${field}' ya existe`, 409);
      }
      throw error;
    }
  }
}

const workspaceRepository = new WorkspaceRepository();

export default workspaceRepository;
