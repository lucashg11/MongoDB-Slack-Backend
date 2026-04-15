import Channel from "../models/channel.model.js";
import ServerError from "../helpers/error.helper.js";

class ChannelRepository {
  async create(channel_name, channel_description, workspace_id) {
    try {
      const new_channel = await Channel.create({
        name: channel_name,
        description: channel_description,
        fk_id_workspace: workspace_id,
      });
      return new_channel;
    } catch (error) {
      if (error.name === "CastError") {
        throw new ServerError("ID de espacio de trabajo inválido", 400);
      }
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map(e => e.message);
        throw new ServerError(`Validación fallida: ${messages.join(", ")}`, 400);
      }
      throw error;
    }
  }

  async getChannelById(channel_id) {
    try {
      return await Channel.findById(channel_id);
    } catch (error) {
      if (error.name === "CastError") {
        throw new ServerError("ID de canal inválido", 400);
      }
      throw error;
    }
  }

  async getById(channel_id) {
    return await this.getChannelById(channel_id);
  }

  async updateById(channel_id, new_channel_props) {
    const updated_channel = await Channel.findByIdAndUpdate(
      channel_id,
      new_channel_props,
      { returnDocument: "after" },
    );
    return updated_channel;
  }
  
  async getChannelsByWorkspace(workspace_id) {
    try {
      return await Channel.find({ fk_id_workspace: workspace_id });
    } catch (error) {
      if (error.name === "CastError") {
        throw new ServerError("ID de espacio de trabajo inválido", 400);
      }
      throw error;
    }
  }
  
  async deleteById(channel_id) {
    await Channel.findByIdAndDelete(channel_id);
  }
}

const channelRepository = new ChannelRepository();

export default channelRepository;
