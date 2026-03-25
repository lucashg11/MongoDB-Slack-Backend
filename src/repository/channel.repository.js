import Channel from "../models/channel.model.js";

class ChannelRepository {
  async create(channel_name, fk_workspace_id) {
    const new_channel = await Channel.create({
      name: channel_name,
      workspace_id: fk_workspace_id,
    });
    return new_channel;
  }
  async deleteById(channel_id) {
    await Channel.findByIdAndDelete(channel_id);
  }
  async getById(channel_id) {
    return await Channel.findById(channel_id);
  }

  async updateById(channel_id, new_channel_props) {
    const updated_channel = await Channel.findByIdAndUpdate(
      channel_id,
      new_channel_props,
      { new: true },
    );
    return updated_channel;
  }
}

const channelRepository = new ChannelRepository();

export default channelRepository;
