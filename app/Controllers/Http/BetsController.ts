import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Bet from 'App/Models/Bet'

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

    public async store({ auth, request }: HttpContextContract){
        try {
            const bets = request.body()
            const formatedBets = bets.map(bet => {
                return { 'user_id': auth.user?.id, ...bet }
            })
            await Bet.createMany(formatedBets)
            return formatedBets
        } catch {
            return 'Error'
        }
    }

    public async update({}: HttpContextContract){

    }

    public async destroy({}: HttpContextContract){
        
    }
}
