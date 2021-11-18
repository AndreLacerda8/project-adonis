import Mail from '@ioc:Adonis/Addons/Mail'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'
import Game from 'App/Models/Game'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import LoginUserValidator from 'App/Validators/LoginUserValidator'
import moment from 'moment'

export default class UsersController {
  public async store({ auth, request, response }: HttpContextContract) {
    await request.validate(CreateUserValidator)

    const { username, email, password } = request.body()

    try{
      const alreadyExists = await User.findBy('email', email)
      if(alreadyExists){
        return response.send('Email already registered')
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
        const user = await User.find(request.param('id'))
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
        return {
          user: {
            username: user?.username,
            email: user?.email,
          },
          bets: formatedBets?.filter(bet => bet !== false)
        }
      }
      return response.status(403).badRequest('Unauthorized')
    } catch {
      return response.badRequest('Error')
    }
  }

  public async login({ auth, request, response }: HttpContextContract){
    await request.validate(LoginUserValidator)

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

  public async destroy({ auth, request, response }: HttpContextContract) {
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
