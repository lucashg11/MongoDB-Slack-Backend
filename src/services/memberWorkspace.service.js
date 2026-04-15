import ServerError from "../helpers/error.helper.js"
import workspaceMemberRepository from "../repository/member.repository.js"
import userRepository from "../repository/user.repository.js"
import jwt from "jsonwebtoken"
import ENVIRONMENT from "../config/env.config.js"
import mailerTransporter from "../config/mailer.config.js"
import { EMAIL_TEMPLATES } from "../helpers/email.helper.js"


class MemberWorkspaceService {
    async getMemberList(user_id) {
        const workspaces_list = await workspaceMemberRepository.getMemberList(user_id)
        return workspaces_list
    }

    async create(user_id, workspace_id, role, acceptInvitation = 'pending') {
        const result = await workspaceMemberRepository.getByWorkspaceAndUserId(user_id, workspace_id)
        if (result) {
            throw new ServerError("El usuario ya es miembro del workspace")
        }
        await workspaceMemberRepository.create(user_id, workspace_id, role, null, acceptInvitation)
    }

    async getWorkspaceMembersList(workspace_id) {
        if (!workspace_id) {
            throw new ServerError("Debe proporcionar un id de workspace", 400)
        }
        try {
            const members = await workspaceMemberRepository.getMemberList(workspace_id)
            return members
        }
        catch (error) {
            throw error
        }
    }

    async inviteMember(workspace_id, invited_email, role) {
        if (!workspace_id || !invited_email || !role) {
            throw new ServerError('Todos los campos son obligatorios', 400)
        }

        const invitedUser = await userRepository.getByEmail(invited_email)
        if (!invitedUser) {
            throw new ServerError('El usuario invitado no existe', 404)
        }

        const existingMember = await workspaceMemberRepository.getByWorkspaceAndUserId(invitedUser._id, workspace_id)
        if (existingMember) {
            if (existingMember.acceptInvitation === 'pending') {
                throw new ServerError('Ya hay una invitación pendiente para este usuario', 400)
            }
            throw new ServerError('El usuario ya es miembro de este espacio de trabajo', 400)
        }

        const newMember = await workspaceMemberRepository.create(invitedUser._id, workspace_id, role)

        const accept_token = jwt.sign(
            {
                email: invited_email,
                workspace_id,
                action: 'accepted'
            },
            ENVIRONMENT.JWT_SECRET_KEY,
            { expiresIn: '7d' }
        )

        const reject_token = jwt.sign(
            {
                email: invited_email,
                workspace_id,
                action: 'rejected'
            },
            ENVIRONMENT.JWT_SECRET_KEY,
            { expiresIn: '7d' }
        )


        await mailerTransporter.sendMail({
            from: ENVIRONMENT.MAIL_USER,
            to: invited_email,
            subject: `Invitación a unirse al espacio de trabajo`,
            html: EMAIL_TEMPLATES.INVITE_MEMBER(workspace_id, accept_token, reject_token)
        })

        return newMember
    }

    async respondToInvitation(token) {
        if (!token) {
            throw new ServerError('Token no proporcionado', 400)
        }

        try {
            const { email, workspace_id, action } = jwt.verify(token, ENVIRONMENT.JWT_SECRET_KEY)
            const user = await userRepository.getByEmail(email)
            if (!user) {
                throw new ServerError('El usuario invitado no existe', 404)
            }
            const membership = await workspaceMemberRepository.getByWorkspaceAndUserId(user._id, workspace_id)
            if (!membership) {
                throw new ServerError('No se encontró la invitación', 404)
            }
            if (membership.acceptInvitation !== 'pending') {
                throw new ServerError('Esta invitación ya fue respondida', 400)
            }

            const updatedMembership = await workspaceMemberRepository.updateInvitationStatus(membership._id, action)
            return updatedMembership
        } catch (error) {
            if (error instanceof ServerError) {
                throw new ServerError('Token invalido o expirado', 401)
            }
            throw error
        }
    }

    async removeMember(workspace_id, member_id, requesting_member) {
        const targetMember = await workspaceMemberRepository.getById(member_id)
        if (!targetMember) {
            throw new ServerError('El miembro no fue encontrado', 404)
        }

        if (targetMember.fk_id_workspace.toString() !== workspace_id) {
            throw new ServerError('El miembro no pertenece a este workspace', 400)
        }

        const requestingRole = requesting_member.role
        const isSelf = requesting_member._id.toString() === member_id

        // Un usuario comun solo puede eliminarse a si mismo
        if (requestingRole === 'user' && !isSelf) {
            throw new ServerError('No tienes permisos para eliminar a este miembro', 403)
        }

        // Un admin NO puede eliminar a un owner
        if (requestingRole === 'admin' && targetMember.role === 'owner') {
            throw new ServerError('Un administrador no puede eliminar al propietario del workspace', 403)
        }

        await workspaceMemberRepository.deleteById(member_id)
        return { member_id }
    }

    async updateMemberRole(workspace_id, member_id, newRole, currentMember, currentUserId) {
        // Validaciones de entrada
        if (!workspace_id || !member_id || !newRole) {
            throw new ServerError('Todos los campos son obligatorios', 400)
        }

        // Validar que el nuevo role sea válido
        const validRoles = ['user', 'admin', 'owner']
        if (!validRoles.includes(newRole)) {
            throw new ServerError('Role inválido', 400)
        }

        // NO se puede actualizar a 'owner'
        if (newRole === 'owner') {
            throw new ServerError('No se puede actualizar a owner', 403)
        }

        // El usuario no puede actualizar su propio role
        const memberToUpdate = await workspaceMemberRepository.getById(member_id)
        if (!memberToUpdate) {
            throw new ServerError('Miembro no encontrado', 404)
        }

        if (memberToUpdate.fk_id_user.toString() === currentUserId) {
            throw new ServerError('No puedes actualizar tu propio role', 403)
        }

        // NO se puede actualizar a un owner (si el miembro a actualizar es owner)
        if (memberToUpdate.role === 'owner') {
            throw new ServerError('No se puede actualizar el role de un owner', 403)
        }

        // Los admins NO pueden actualizar a otros admins o a owners
        if (currentMember.role === 'admin' && (memberToUpdate.role === 'admin' || memberToUpdate.role === 'owner')) {
            throw new ServerError('Los admins no pueden actualizar a otros admins o a owners', 403)
        }

        // Actualizar el role
        return await workspaceMemberRepository.updateRoleById(member_id, newRole)
    }
}

const memberWorkspaceService = new MemberWorkspaceService()

export default memberWorkspaceService