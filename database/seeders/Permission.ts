import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import Permission from 'App/Models/Permission'

export default class PermissionSeeder extends BaseSeeder {
  public async run () {
    const uniqueKey = 'name'

    await Permission.updateOrCreateMany(uniqueKey, [{
      name: 'admin'
    }])
  }
}
