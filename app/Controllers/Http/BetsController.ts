import Mail from '@ioc:Adonis/Addons/Mail'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Bet from 'App/Models/Bet'
import Game from 'App/Models/Game'
import User from 'App/Models/User'

export default class BetsController {
    public async index({ auth, response }: HttpContextContract){
        try{
            const user = await User.find(auth.user?.id)
            const bets = await user?.related('bet').query()
            return bets
        } catch(err) {
            return response.status(err.status).send('Ocorreu algum erro inesperado')
        }
    }

    public async show({ auth, request, response }: HttpContextContract){
        try{
            const bets = await Bet.query().where('user_id', '=', auth.user?.id + '')
            const bet = bets.filter(bet => {
                return bet.id === +request.param('id')
            })
            return bet
        } catch(err) {
            return response.status(err.status).send('Ocorreu algum erro inesperado')
        }
    }

    public async store({ auth, request, response }: HttpContextContract){
        try {
            const bets = request.body()
            const games = await Game.all()
            const prices = games.map(game => {
                return { id: game.id, price: game.price }
            })
            const price = bets.reduce((acc, current) => {
                const currentPrice = prices.filter(price => {
                    return price.id === (+current['game_id'])
                })[0].price
                return acc + (+currentPrice)
            }, 0)
            if(price < 30){
                return response.send('Minimum price (R$30,00) not reached')
            }
            const formatedBets = bets.map(bet => {
                return { 'user_id': auth.user?.id, ...bet }
            })
            await Bet.createMany(formatedBets)

            const user = await User.find(formatedBets[0]['user_id'])

            if(user){
                await Mail.sendLater(message => {
                    message
                        .from('mail@example.com')
                        .to(user.email)
                        .subject('Nova aposta')
                        .html(`
                        <h1> Você fez uma nova aposta </h1>
                        <p>
                            Você acabou de realizar novas apostas no valor de R$${price.toFixed(2).replace('.',',')}
                        </p>`)
                })
            }

            return formatedBets
        } catch(err) {
            return response.status(err.status).send('Ocorreu algum erro inesperado')
        }
    }

    public async update({ auth, request, response }: HttpContextContract){
        try{
            const betId = request.param('id')
            const { gameId, numbers } = request.body()
            const bet = await Bet.findOrFail(betId)
            if(bet.userId === auth.user?.id){
                bet.gameId = gameId
                bet.numbers = numbers
                bet.save()
                return bet
            } else {
                return response.status(403).send('Unauthorized')
            }
        } catch(err) {
            return response.status(err.status).send('Ocorreu algum erro inesperado')
        }
    }

    public async destroy({ auth, request, response }: HttpContextContract){
        try{
            const betId = request.param('id')
            const bet = await Bet.findOrFail(betId)
            if(bet.userId === auth.user?.id){
                bet.delete()
                return response.send('Bet deleted successfully')
            } else {
                return response.status(403).send('Unauthorized')
            }
        } catch(err) {
            return response.status(err.status).send('Ocorreu algum erro inesperado')
        }
    }
}
