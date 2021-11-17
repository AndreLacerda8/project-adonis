import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Game from 'App/Models/Game'
import GameValidator from 'App/Validators/GameValidator'

export default class GamesController {
    public async index({}: HttpContextContract){
        return Game.all()
    }

    public async store({ request, response }: HttpContextContract) {
        await request.validate(GameValidator)

        try {
            const game = request.body()
            await Game.create(game)
    
            return game
        } catch {
            response.send('Error')
        }
    }

    public async show({ request, response }: HttpContextContract) {
        try{
            const id = request.param('id')
            const game = await Game.findOrFail(id)
            return game
        } catch {
            return response.status(404).send('Game not found')
        }
    }

    public async update({ request, response }: HttpContextContract) {
        await request.validate(GameValidator)
        
        try{
            const changeGame = request.body()
            const game = await Game.findBy('id', request.param('id'))
            if(game){
                game.type = changeGame.type
                game.description = changeGame.description
                game.range = changeGame.range
                game.price = changeGame.price
                game.maxNumber = changeGame.maxNumber
                game.color = changeGame.color
                game.save()
                return game
            }
        } catch {
            response.send('Error')
        }
    }

    public async destroy({ request, response }: HttpContextContract) {
        try{
            const game = await Game.findBy('id', request.param('id'))
            if(game){
                await game.delete()
                return 'Game deleted successfully'
            }
            return response.status(404).send('Game not found')
        } catch {
            response.send('Error')
        }
    }
}
