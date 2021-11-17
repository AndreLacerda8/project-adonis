import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import UsersPermission from 'App/Models/UsersPermission'
import Permission from 'App/Models/Permission'

export default class LogRequest {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    try{
      if(auth.isLoggedIn){
        const userPermission = await UsersPermission.findBy('user_id', auth.user?.id)
        const permission = await Permission.findBy('id', userPermission?.permissionId)
        if(permission?.name === 'admin'){
          await next()
        }
        else {
          return response.status(403).send('Unauthorized')
        }
      }
    } catch {
      return response.send('Error')
    }
  }
}
