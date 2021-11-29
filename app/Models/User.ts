import Hash from '@ioc:Adonis/Core/Hash'
import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, HasMany, hasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Bet from 'App/Models/Bet'
// import Permission from './Permission'
import UsersPermission from './UsersPermission'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public username: string

  @column()
  public email: string

  @column()
  public password: string

  @column()
  public tokenForgotPassword: string | null

  @column()
  public tokenForgotPasswordCreatedAt: Date | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @hasMany(() => Bet)
  public bet: HasMany<typeof Bet>

  @manyToMany(() => UsersPermission)
  public permissions: ManyToMany<typeof UsersPermission>
}
