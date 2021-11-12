import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  public async store({}: HttpContextContract) {
    return 'Cadastrar usuário'
  }

  public async show({}: HttpContextContract) {
    return 'Usuário X'
  }

  public async login({}: HttpContextContract) {
    return 'Usuário Logado'
  }

  public async update({}: HttpContextContract) {
    return 'Atualizar usuário'
  }

  public async destroy({}: HttpContextContract) {
    return 'Deletar usuario'
  }
}
