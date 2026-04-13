import ServerError from "../helpers/error.helper.js";

import channelService from "../services/channel.service.js";

class ChannelController {
    async create(req, res) {
        try{
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
            if (error instanceof ServerError) {
                return res.status(error.status).json(
                    {
                        ok: false,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            else {
                console.log("error inesperado en el registro", error)
                return res.status(500).json(
                    {
                        ok: false,
                        status: 500,
                        message: "Internal Server Error"
                    }
                )
            }
        }
    }

    async getChannelsByWorkspace(req, res) {
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
            if (error instanceof ServerError) {
                return res.status(error.status).json(
                    {
                        ok: false,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            else {
                console.log("error inesperado en el registro", error)
                return res.status(500).json(
                    {
                        ok: false,
                        status: 500,
                        message: "Internal Server Error"
                    }
                )
            }
        }
    }

    async deleteById(req, res) {
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
            if (error instanceof ServerError) {
                return res.status(error.status).json(
                    {
                        ok: false,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            else {
                console.log("error inesperado al eliminar el canal", error)
                return res.status(500).json(
                    {
                        ok: false,
                        status: 500,
                        message: "Internal Server Error"
                    }
                )
            }
        }
    }
}

const channelController = new ChannelController()

export default channelController