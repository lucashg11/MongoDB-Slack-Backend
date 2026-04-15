import ServerError from "../helpers/error.helper.js";

import channelService from "../services/channel.service.js";

class ChannelController {
    async create(req, res, next) {
        try {
            const { workspace_id } = req.params
            const { name, description } = req.body
            const channel_created = await channelService.create(name, description, workspace_id)
            return res.status(201).json(
                {
                    ok: true,
                    status: 201,
                    message: "Canal creado exitosamente",
                    data: {
                        channel: channel_created
                    }
                }
            )
        }
        catch (error) {
            next(error);
        }
    }

    async getChannelsByWorkspace(req, res, next) {
        const { workspace_id } = req.params
        try {
            const channels = await channelService.getChannelsByWorkspace(workspace_id)
            return res.status(200).json(
                {
                    ok: true,
                    status: 200,
                    message: "Canales obtenidos exitosamente",
                    data: {
                        channels
                    }
                }
            )
        }
        catch (error) {
            next(error);
        }
    }

    async deleteById(req, res, next) {
        const { channel_id } = req.params
        try {
            await channelService.deleteById(channel_id)
            return res.status(200).json(
                {
                    ok: true,
                    status: 200,
                    message: "Canal eliminado exitosamente"
                }
            )
        }
        catch (error) {
            next(error);
        }
    }

    async createMessage(req, res, next) {
        try {
            const { channel_id } = req.params
            const { content } = req.body
            const workspace_member = req.workspace_member

            const message = await channelService.createMessage(channel_id, workspace_member._id, content)
            return res.status(201).json(
                {
                    ok: true,
                    status: 201,
                    message: "Mensaje creado exitosamente",
                    data: {
                        message
                    }
                }
            )
        }
        catch (error) {
            next(error);
        }
    }

    async getMessages(req, res, next) {
        try {
            const { channel_id } = req.params

            const messages = await channelService.getMessagesByChannelId(channel_id)
            return res.status(200).json(
                {
                    ok: true,
                    status: 200,
                    message: "Mensajes obtenidos exitosamente",
                    data: {
                        messages
                    }
                }
            )
        }
        catch (error) {
            next(error);
        }
    }
}

const channelController = new ChannelController()

export default channelController