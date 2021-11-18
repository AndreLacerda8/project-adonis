import Mail from '@ioc:Adonis/Addons/Mail'
import { BaseTask } from 'adonis5-scheduler/build'
import User from 'App/Models/User'
import moment from 'moment'

export default class InvitationToBet extends BaseTask {
	public static get schedule() {
		return '0 0 9 * * *'
	}
	/**
	 * Set enable use .lock file for block run retry task
	 * Lock file save to `build/tmpTaskLock`
	 */
	public static get useLock() {
		return false
	}

	public async handle() {
		console.log('rodou')
		const users = await User.all()
		const usersToSendMail: User[] = []
		for(let user of users){
			const bets = await user.related('bet').query().orderBy('created_at', 'desc')
			const mustSendMail = moment().subtract('1', 'week').isAfter(`${bets[0].createdAt}`)
			if(mustSendMail)
				usersToSendMail.push(user)
		}
		for(let user of usersToSendMail){
			await Mail.sendLater(message => {
				message
					.from('mail@example.com')
					.to(user.email)
					.subject('Olá, venha apostar')
					.html(`
						<h1>Não esqueça de fazer sua aposta</h1>
						<p>Venha ao nosso site realizar suas apostas:</p>
						<a href="http://site.com">Clique aqui</a>
					`)
			})
		}
  	}
}
