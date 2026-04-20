import ServerError from "../helpers/error.helper.js";
import channelRepository from "../repository/channel.repository.js";
import channelMessageRepository from "../repository/channelMessages.repository.js";

class ChannelService {
    async create(channel_name, channel_description, workspace_id, creator_id) {
        if (!channel_name || !channel_description || !workspace_id || !creator_id) {
            throw new ServerError("Todos los campos son obligatorios", 400)
        }
        const channel_created = await channelRepository.create(channel_name, channel_description, workspace_id, creator_id)
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

    async createMessage(channel_id, workspace_member, content) {
        if (!channel_id || !workspace_member || !content) {
            throw new ServerError("Todos los campos son obligatorios", 400)
        }

        const member_id = workspace_member._id;

        const channel = await channelRepository.getChannelById(channel_id)
        if (!channel) {
            throw new ServerError("Canal no encontrado", 404)
        }

        const isWorkspaceAdmin = ['owner', 'admin'].includes(workspace_member.role);
        const isChannelMember = await channelRepository.isMember(channel_id, member_id);

        if (!isWorkspaceAdmin && !isChannelMember) {
            throw new ServerError("Debes ser miembro del canal para enviar mensajes", 403)
        }

        const message = await channelMessageRepository.create(channel_id, member_id, content)
        return message
    }

    async getMessagesByChannelId(channel_id) {
        if (!channel_id) {
            throw new ServerError("Debe proporcionar un id de canal", 400)
        }

        const channel = await channelRepository.getChannelById(channel_id)
        if (!channel) {
            throw new ServerError("Canal no encontrado", 404)
        }

        const messages = await channelMessageRepository.getByChannelId(channel_id)
        return messages
    }

    async inviteMember(channel_id, workspace_id, member_to_invite_id) {
        if (!channel_id || !workspace_id || !member_to_invite_id) {
            throw new ServerError("Todos los campos son obligatorios", 400)
        }

        const channel = await channelRepository.getChannelById(channel_id)
        if (!channel) {
            throw new ServerError("Canal no encontrado", 404)
        }

        if (channel.fk_id_workspace.toString() !== workspace_id.toString()) {
            throw new ServerError("El canal no pertenece a este espacio de trabajo", 400)
        }

        const isMember = await channelRepository.isMember(channel_id, member_to_invite_id)
        if (isMember) {
            throw new ServerError("El usuario ya es miembro de este canal", 400)
        }

        const updated_channel = await channelRepository.addMember(channel_id, member_to_invite_id)
        return updated_channel
    }
}

const channelService = new ChannelService()

export default channelService