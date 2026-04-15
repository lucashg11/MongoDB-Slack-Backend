import ChannelMessage from "../models/channelMessages.model.js";
import ServerError from "../helpers/error.helper.js";

class ChannelMessageRepository {
  async create(channel_id, member_id, content) {
    try {
      const new_channel_message = await ChannelMessage.create({
        fk_id_channel: channel_id,
        fk_id_member: member_id,
        content: content,
      });
      return new_channel_message;
    } catch (error) {
      if (error.name === "CastError") {
        throw new ServerError("ID de canal o miembro inválido", 400);
      }
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map(e => e.message);
        throw new ServerError(`Validación fallida: ${messages.join(", ")}`, 400);
      }
      throw error;
    }
  }
  async deleteById(channel_message_id) {
    await ChannelMessage.findByIdAndDelete(channel_message_id);
  }
  async getById(channel_message_id) {
    try {
      return await ChannelMessage.findById(channel_message_id);
    } catch (error) {
      if (error.name === "CastError") {
        throw new ServerError("ID de mensaje inválido", 400);
      }
      throw error;
    }
  }

  async updateById(channel_message_id, new_channel_message_props) {
    try {
      const updated_channel_message = await ChannelMessage.findByIdAndUpdate(
        channel_message_id,
        new_channel_message_props,
        { returnDocument: "after" },
      );
      return updated_channel_message;
    } catch (error) {
      if (error.name === "CastError") {
        throw new ServerError("ID de mensaje inválido", 400);
      }
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map(e => e.message);
        throw new ServerError(`Validación fallida: ${messages.join(", ")}`, 400);
      }
      throw error;
    }
  }

  async getByChannelId(channel_id) {
    try {
      return await ChannelMessage.find({ fk_id_channel: channel_id })
        .populate('fk_id_member', 'role created_at')
        .populate('fk_id_member.fk_id_user', 'name email')
        .sort({ created_at: 1 });
    } catch (error) {
      if (error.name === "CastError") {
        throw new ServerError("ID de canal inválido", 400);
      }
      throw error;
    }
  }
}

const channelMessageRepository = new ChannelMessageRepository();

export default channelMessageRepository;
