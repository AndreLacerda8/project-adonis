import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import ForgotPasswordValidator from 'App/Validators/ForgotPasswordValidator'
import { Producer } from '../../../kafkaServices/Producer'
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

            Producer({ topic: 'forgot-password', messages: [
                { key: 'email', value: email },
                { key: 'token_value', value: user.tokenForgotPassword }
            ] })

            return response.status(200).json({ message: 'Password recovery email sent' })
        } catch(err) {
            return response.status(err.status).json({ message: 'Occurred an error, this is correct email?' })
        }
    }

    public async update({ request, response }: HttpContextContract) {
        await request.validate(ForgotPasswordValidator)
        try{
            const { token, password } = request.all()
            const user = await User.findByOrFail('token_forgot_password', token)
            const tokenExpired = moment().subtract('1', 'days').isAfter(user.tokenForgotPasswordCreatedAt)
            if(tokenExpired){
                return response.status(401).json({ message: 'Token expired' })
            }

            user.tokenForgotPassword = null
            user.tokenForgotPasswordCreatedAt = null
            user.password = password
            await user.save()
            return response.status(200).json({ message: 'Password changed successfully' })
        } catch(err){
            return response.status(err.status).json({ message: 'Occurred an error, this is valid token?' })
        }
    }
}