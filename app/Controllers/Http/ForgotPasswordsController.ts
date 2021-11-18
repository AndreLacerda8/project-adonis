import Mail from '@ioc:Adonis/Addons/Mail'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import ForgotPasswordValidator from 'App/Validators/ForgotPasswordValidator'
import moment from 'moment'

const crypto = require('crypto')

export default class ForgotPasswordsController {
    public async store({ request, response }: HttpContextContract) {
        try{
            const email = request.input('email')
            const user = await User.findByOrFail('email', email)
            user.tokenForgotPassword = crypto.randomBytes(10).toString('hex')
            user.tokenForgotPasswordCreatedAt = new Date()
            await user.save()

            await Mail.sendLater(message => {
                message
                    .from('mail@example.com')
                    .to(email)
                    .subject('Recuperação de senha')
                    .html(`
                        <h1>Email para recuperação de senha</h1>
                        <p>Para recuperar sua senha user o token: ${user.tokenForgotPassword}, ou acesse o link:</p>
                        <a href="${request.input('redirect_url')}?token=${user.tokenForgotPassword}">Recuperar senha</a>
                    `)
            })
        } catch(err) {
            return response.status(err.status).send('Algo deu errado, esse é o email correto?')
        }
    }

    public async update({ request, response }: HttpContextContract) {
        await request.validate(ForgotPasswordValidator)
        try{
            const { token, password } = request.all()
            const user = await User.findByOrFail('token_forgot_password', token)
            const tokenExpired = moment().subtract('1', 'days').isAfter(user.tokenForgotPasswordCreatedAt)
            if(tokenExpired){
                return response.status(401).send('Token de recuperação de senha expirado')
            }

            user.tokenForgotPassword = null
            user.tokenForgotPasswordCreatedAt = null
            user.password = password
            await user.save()
        } catch(err){
            return response.status(err.status).send('Algo deu errado')
        }
    }
}
