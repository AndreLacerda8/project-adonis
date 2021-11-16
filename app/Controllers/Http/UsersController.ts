import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'

export default class UsersController {
  public async store({ request, response, auth }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    try{
      await User.create({
        email,
        password
      })
      const user = await User.findBy('email', email)
      const token = await auth.use('api').attempt(email, password, {
        expiresIn: '1day',
        name: user?.serialize().email
      })
      return {token, user: user?.serialize()}
    } catch {
        return response.badRequest('Invalid Credentials')
    }
  }

  public async show({ auth, request, response }: HttpContextContract) {
    try{
        if(auth.isLoggedIn && auth.user?.id === +request.param('id')){
        const { user } = auth
        return {
          user
        }
      }
      return response.status(403).badRequest('Unauthorized')
    } catch {
      return response.badRequest('Error')
    }
  }

  public async login({ request, response, auth }: HttpContextContract){
    const email = request.input('email')
    const password = request.input('password')

    try{
      const user = await User.findBy('email', email)
      const token = await auth.use('api').attempt(email, password, {
          expiresIn: '1day',
          name: user?.serialize().email
      })
      return {token, user: user?.serialize()}
    } catch {
        return response.badRequest('Invalid Credentials')
    }
  }

  public async logout({ auth, request, response }: HttpContextContract){
    try{
      if(auth.isLoggedIn && auth.user?.id === +request.param('id')){
        await auth.use('api').revoke()
        return response.json('Logout occurred successfully')
      } else {
        return response.status(403).badRequest('Unauthorized')
      }
    } catch {
      return response.badRequest('Error')
    }
  }

  public async update({ auth, request, response }: HttpContextContract) {
    try {
      if(auth.isLoggedIn  && auth.user?.id === +request.param('id')){
        const { email, password } = request.body()
        const user = await User.findByOrFail('id', request.param('id'))
        user.email = email
        user.password = password
        await user.save()
        return user
      }
      return response.status(403).badRequest('Unauthorized')
    } catch {
      return response.badRequest('Error')
    }
  }

  public async destroy({ request, auth, response }: HttpContextContract) {
    try {
      if(auth.isLoggedIn  && auth.user?.id === +request.param('id')){
        const user = await User.findByOrFail('id', request.param('id'))
        await user.delete()
        return response.json('User deleted successfully')
      }
      return response.status(403).badRequest('Unauthorized')
    } catch {
      return response.badRequest('Error')
    }
  }
}
