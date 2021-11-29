import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import UsersPermission from 'App/Models/UsersPermission'

export default class UsersPermissionSeeder extends BaseSeeder {
  public async run () {
    const uniqueKey = 'id'

    await UsersPermission.updateOrCreateMany(uniqueKey, [
      {
        id: 1,
        userId: 1,
        permissionId: 1
      },
      {
        id: 2,
        userId: 2,
        permissionId: 1
      }
    ])
  }
}
