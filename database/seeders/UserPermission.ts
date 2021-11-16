import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import UsersPermission from 'App/Models/UsersPermission'

export default class UserPermissionSeeder extends BaseSeeder {
  public async run () {
    await UsersPermission.create({
      user_id: 4,
      permission_id: 1
    })
  }
}
