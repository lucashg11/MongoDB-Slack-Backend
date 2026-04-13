import Channel from "../models/channel.model.js";

class ChannelRepository {
  async create(channel_name, channel_description, workspace_id) {
    const new_channel = await Channel.create({
      name: channel_name,
      description: channel_description,
      fk_id_workspace: workspace_id,
    });
    return new_channel;
  }

  async getChannelById(channel_id) {
    return await Channel.findById(channel_id);
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
    return await Channel.find({ fk_id_workspace: workspace_id });
  }
  
  async deleteById(channel_id) {
    await Channel.findByIdAndDelete(channel_id);
  }
}

const channelRepository = new ChannelRepository();

export default channelRepository;
