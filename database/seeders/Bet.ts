import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Bet from 'App/Models/Bet'

export default class BetSeeder extends BaseSeeder {
  public async run () {
    await Bet.createMany([
      {
        user_id: 4,
        game_id: 2,
        numbers: "1,2,3,4,5,6"
      },
      {
        user_id: 4,
        game_id: 3,
        numbers: "1,2,3,4,5"
      },
      {
        user_id: 5,
        game_id: 2,
        numbers: "4,5,6,7,8,9"
      },
      {
        user_id: 5,
        game_id: 1,
        numbers: "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15"
      },
    ])
  }
}
