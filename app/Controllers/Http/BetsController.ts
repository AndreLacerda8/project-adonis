import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Bet from 'App/Models/Bet'
import Game from 'App/Models/Game'

export default class BetsController {
    public async index({ auth }: HttpContextContract){
        try{
            const bets = await Bet.query().where('user_id', '=', auth.user?.id + '')
            return bets
        } catch {
            return 'Error'
        }
    }

    public async show({ auth, request }: HttpContextContract){
        try{
            const bets = await Bet.query().where('user_id', '=', auth.user?.id + '')
            const bet = bets.filter(bet => {
                return bet.id === +request.param('id')
            })
            return bet
        } catch {
            return 'Error'
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
            return formatedBets
        } catch {
            return 'Error'
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
        } catch {
            return response.send('Error')
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
        } catch {
            return response.send('Error')
        }
    }
}
