import ChannelMessage from "../models/channelMessage.model.js";

class ChannelMessageRepository {
  async create(channel_id, user_id, content) {
    const new_channel_message = await ChannelMessage.create({
      channel_id: channel_id,
      user_id: user_id,
      content: content,
    });
    return new_channel_message;
  }
  async deleteById(channel_message_id) {
    await ChannelMessage.findByIdAndDelete(channel_message_id);
  }
  async getById(channel_message_id) {
    return await ChannelMessage.findById(channel_message_id);
  }

  async updateById(channel_message_id, new_channel_message_props) {
    const updated_channel_message = await ChannelMessage.findByIdAndUpdate(
      channel_message_id,
      new_channel_message_props,
      { new: true },
    );
    return updated_channel_message;
  }
}

const channelMessageRepository = new ChannelMessageRepository();

export default channelMessageRepository;
