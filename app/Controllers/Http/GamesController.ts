import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Cart from 'App/Models/Cart'

import Game from 'App/Models/Game'
import GameValidator from 'App/Validators/GameValidator'

export default class GamesController {
    public async index({response}: HttpContextContract){
        try{
            const games = await Game.all()
            const configCart = await Cart.findByOrFail('config', 'min-cart-value')
            const gamesFormated = games.map(game => {
                return {
                    type: game.type,
                    description: game.description,
                    range: game.range,
                    price: game.price,
                    'max-number': game.maxNumber,
                    color: game.color
                }
            })
            return response.status(200).json({
                "min-cart-value": +configCart.value,
                types: gamesFormated
            })
        } catch(err){
            return response.status(err.status).json({ message: 'Occurred unexpected error' })
        }
    }

    public async store({ request, response }: HttpContextContract) {
        await request.validate(GameValidator)

        try {
            const game = request.body()
            await Game.create(game)
            return {
                type: game.type,
                description: game.description,
                range: game.range,
                price: game.price,
                'max-number': game.maxNumber,
                color: game.color
            }
        } catch(err) {
            return response.status(err.status).json({ message: 'Occurred unexpected error' })
        }
    }

    public async show({ request, response }: HttpContextContract) {
        try{
            const id = request.param('id')
            const game = await Game.findOrFail(id)
            return response.status(200).json({
                type: game.type,
                description: game.description,
                range: game.range,
                price: game.price,
                'max-number': game.maxNumber,
                color: game.color
            })
        } catch {
            return response.status(404).json({ message: 'Game not found' })
        }
    }

    public async update({ request, response }: HttpContextContract) {
        await request.validate(GameValidator)
        
        try{
            const changeGame = request.body()
            const game = await Game.findByOrFail('id', request.param('id'))
            if(game){
                game.type = changeGame.type
                game.description = changeGame.description
                game.range = changeGame.range
                game.price = changeGame.price
                game.maxNumber = changeGame.maxNumber
                game.color = changeGame.color
                game.save()
                return {
                    type: game.type,
                    description: game.description,
                    range: game.range,
                    price: game.price,
                    'max-number': game.maxNumber,
                    color: game.color
                }
            }
        } catch(err) {
            return response.status(err.status).json({ message: 'Game not Found' })
        }
    }

    public async destroy({ request, response }: HttpContextContract) {
        try{
            const game = await Game.findBy('id', request.param('id'))
            if(game){
                await game.delete()
                return response.status(200).json({ message: 'Game deleted successfully' })
            }
            return response.status(404).send({ message: 'Game not found' })
        } catch(err) {
            return response.status(err.status).json({ message: 'Occurred unexpected error' })
        }
    }
}
