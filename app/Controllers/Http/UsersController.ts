import Mail from '@ioc:Adonis/Addons/Mail'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'

import User from 'App/Models/User'
import Game from 'App/Models/Game'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import LoginUserValidator from 'App/Validators/LoginUserValidator'
import moment from 'moment'
import UsersPermission from 'App/Models/UsersPermission'
import Permission from 'App/Models/Permission'

export default class UsersController {
  private async createToken(auth: AuthContract, email: string,  password:string, response){
    try{
      const user = await User.findByOrFail('email', email)
      const token = await auth.use('api').attempt(email, password, {
          expiresIn: '1day',
          name: user?.serialize().email
      })
      return {token, user: user?.serialize()}
    } catch {
      return response.status(404).json({ message: 'User not Found' })
    }
  }

  private async getPermissions(user: User){
    const allPermissions = await Permission.all()
    const permissionsName = allPermissions.map(permission => {
      return { id: permission.id, name: permission.name }
    })
    const permissions = await UsersPermission.query().where('id', '=', user.id)
    return permissions.map(permission => {
      const { name } = permissionsName.filter(permissionName => permissionName.id === permission.id)[0]
      return name
    })
  }

  public async store({ auth, request, response }: HttpContextContract) {
    await request.validate(CreateUserValidator)

    const { username, email, password } = request.body()

    try{
      const alreadyExists = await User.findBy('email', email)
      if(alreadyExists){
        return response.badRequest({ message: 'Email already registered' })
      }
      await User.create({
        username,
        email,
        password
      })

      await Mail.sendLater(message => {
        message
          .from('mail@example.com')
          .to(email)
          .subject('Bem vindo ao Lottery')
          .html(`
          <h1> Seja bem-vindo ${username} </h1>
          <p>
              Seu cadastro foi feito com sucesso, agora você pode aproveitar ao maximo nosso site
          </p>`
          )
      })
      const {token, user} = await this.createToken(auth, email, password, response)
      response.status(200).json({
        token,
        user: {
          username: user.username,
          email: user.email
        }
      })
    } catch(err) {
      return response.status(err.status).json({ message: 'Occurred unexpected error'})
    }
  }

  public async show({ auth, request, response }: HttpContextContract) {
    try{
      if(auth.isLoggedIn && auth.user?.id === +request.param('id')){
        const user = await User.findOrFail(request.param('id'))
        const bets = await user?.related('bet').query()
        const games = await Game.all()
        const formatedBets = bets?.map(bet => {
          const betInLastMonth = moment().subtract('1', 'month').isBefore(`${bet.createdAt}`)
          if(betInLastMonth){
            return {
              type: games[+bet.gameId - 1].type,
              numbers: bet.numbers,
              price: games[+bet.gameId - 1].price
            }
          }
          return false
        })
        const permissions = await this.getPermissions(user)
        return {
          user: {
            username: user?.username,
            email: user?.email,
            permissions
          },
          bets: formatedBets?.filter(bet => bet !== false)
        }
      }
      return response.status(403).json({ message: 'Unauthorized' })
    } catch(err) {
      return response.status(err.status || 400).json({ message: 'User not Found', originalError: err.message })
    }
  }

  public async login({ auth, request, response }: HttpContextContract){
    await request.validate(LoginUserValidator)

    const email = request.input('email')
    const password = request.input('password')

    try{
      const {token, user} = await this.createToken(auth, email, password, response)
      const permissionsFormated = await this.getPermissions(user)
      response.status(200).json({
        token,
        user: {
          username: user.username,
          email: user.email,
          permissions: permissionsFormated
        }
      })
    } catch {
      return response.status(404).json({ message: 'User not Found' })
    }
  }

  public async logout({ auth, request, response }: HttpContextContract){
    try{
      if(auth.isLoggedIn && auth.user?.id === +request.param('id')){
        await auth.use('api').revoke()
        return response.status(200).json({ message: 'Logout occurred successfully' })
      } else {
        return response.status(403).json({ message: 'Unauthorized' })
      }
    } catch(err) {
      return response.status(err.status).json({ message: 'Occurred unexpected error'})
    }
  }

  public async update({ auth, request, response }: HttpContextContract) {
    try {
      if(auth.isLoggedIn  && auth.user?.id === +request.param('id')){
        const { username, email, password } = request.body()
        const user = await User.findByOrFail('id', request.param('id'))
        user.username = username
        user.email = email
        user.password = password
        await user.save()
        return response.status(200).json({
          message: 'User updated successfully',
          user: {
            username: user.username,
            email: user.email
          }
        })
      }
      return response.status(403).json({ message: 'Unauthorized' })
    } catch(err) {
      return response.status(err.status).json({ message: 'Occurred unexpected error'})
    }
  }

  public async destroy({ auth, request, response }: HttpContextContract) {
    try {
      if(auth.isLoggedIn  && auth.user?.id === +request.param('id')){
        const user = await User.findByOrFail('id', request.param('id'))
        await user.delete()
        return response.status(200).json({ message: 'User deleted successfully' })
      }
      return response.status(403).json({ message: 'Unauthorized' })
    } catch(err) {
      return response.status(err.status).json({ message: 'Occurred unexpected error'})
    }
  }
}
