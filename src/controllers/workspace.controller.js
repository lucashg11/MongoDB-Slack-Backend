import ServerError from "../helpers/error.helper.js"
import workspaceMemberRepository from "../repository/member.repository.js"

class WorkspaceController {
   async getWorkspaces(req, res){
        try{
            const user = req.user
            const workspaces = await workspaceMemberRepository.getWorkspaceListByUserId(user.id);
            res.json(
                { 
                    ok: true,
                    status: 200,
                    message: 'Espacios de trabajos obtenidos',
                    data: {
                        workspaces
                    }
                }
            )
        }
        catch(error){
            if(error instanceof ServerError) {
                return res.status(error.status).json(
                    {
                        ok: false,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            else{
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
}
const workspaceController = new WorkspaceController()

export default workspaceController