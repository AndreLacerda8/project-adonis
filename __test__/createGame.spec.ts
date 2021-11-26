import test from "japa";
import supertest from "supertest";

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Create Game', () => {
    test('should return status 401 when requested by unauthenticated user', async (assert) => {
        const response = await supertest(BASE_URL)
            .post('/games')
            .send({
                "type": "Outro jogo",
                "description": "Descrição teste!",
                "range": 30,
                "price": 2,
                "maxNumber": 8,
                "color": "#0fff0F"
            })

        assert.equal(response.status, 401)
    })

    test('should return status 403 when requested by a non-admin user', async (assert) => {
        const user = await supertest(BASE_URL).post('/registered')
            .send({
                username: 'Teste',
                email: "test@gmail.com",
                password: "123456",
                password_confirmation: "123456"
            })

        const token = user.body.token.token

        const response = await supertest(BASE_URL)
            .post('/games')
            .send({
                "type": "Outro jogo",
                "description": "Descrição teste!",
                "range": 30,
                "price": 2,
                "maxNumber": 8,
                "color": "#0fff0F"
            })
            .auth(token, { type: 'bearer' })

        assert.equal(response.status, 403)
    })

    test('should return the game when the user is authenticated and is admin', async (assert) => {
        const user = await supertest(BASE_URL).post('/login')
            .send({
                email: "andrlacerda@mail.com",
                password: "123456",
            })

        const token = user.body.token.token

        const response = await supertest(BASE_URL)
            .post('/games')
            .send({
                type: 'Outro jogo',
                description: 'Descrição teste!',
                range: 30,
                price: 2,
                maxNumber: 8,
                color: '#0fff0F'
            })
            .auth(token, { type: 'bearer' })

        assert.hasAllKeys(response.body, {
            type: String,
            description: String,
            range: Number,
            price: Number,
            'max-number': Number,
            color: String
        })
    })
})