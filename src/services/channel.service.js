import ServerError from "../helpers/error.helper.js";
import channelRepository from "../repository/channel.repository.js";

class ChannelService {
    async create(channel_name, channel_description, workspace_id) {
        if (!channel_name || !channel_description || !workspace_id) {
            throw new ServerError("Todos los campos son obligatorios", 400)
        }
        const channel_created = await channelRepository.create(channel_name, channel_description, workspace_id)
        return channel_created
    }

    async getChannelById(channel_id) {
        if (!channel_id) {
            throw new ServerError("Debe proporcionar un id", 400)
        }
        const channel = await channelRepository.getChannelById(channel_id)
        return channel
    }

    async deleteById(channel_id) {
        if (!channel_id) {
            throw new ServerError("Debe proporcionar un id de canal", 400)
        }
        await channelRepository.deleteById(channel_id)
    }

    async getChannelsByWorkspace(workspace_id) {
        if (!workspace_id) {
            throw new ServerError("Debe proporcionar un id", 400)
        }
        const channels = await channelRepository.getChannelsByWorkspace(workspace_id)
        return channels
    }
}

const channelService = new ChannelService()

export default channelService