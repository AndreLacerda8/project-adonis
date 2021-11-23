import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Cart from 'App/Models/Cart'

export default class CartSeeder extends BaseSeeder {
  public async run () {
    const uniqueKey = 'config'

    await Cart.updateOrCreateMany(uniqueKey, [{
      config: 'min-cart-value',
      value: 30
    }])
  }
}
