import test from "japa";
import supertest from "supertest";

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Update Game', () => {
    test('should return status 401 when requested by unauthenticated user', async (assert) => {
        const response = await supertest(BASE_URL)
            .put('/games/4')
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
        const user = await supertest(BASE_URL).post('/login')
            .send({
                email: "test@gmail.com",
                password: "123456"
            })

        const token = user.body.token.token

        const response = await supertest(BASE_URL)
            .put('/games/4')
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

    test('should return status 404 when game not exists', async (assert) => {
        const user = await supertest(BASE_URL).post('/login')
            .send({
                email: "andrlacerda@mail.com",
                password: "123456",
            })

        const token = user.body.token.token

        const response = await supertest(BASE_URL)
            .put('/games/100')
            .send({
                "type": "Outro jogo",
                "description": "Descrição teste!",
                "range": 30,
                "price": 2,
                "maxNumber": 8,
                "color": "#0fff0F"
            })
            .auth(token, { type: 'bearer' })

        assert.equal(response.status, 404)
    })

    test('should return the game when the user is authenticated and is admin', async (assert) => {
        const user = await supertest(BASE_URL).post('/login')
            .send({
                email: "andrlacerda@mail.com",
                password: "123456",
            })

        const token = user.body.token.token

        const response = await supertest(BASE_URL)
            .put('/games/3')
            .send({
                type: 'Outro jogo',
                description: 'Descrição teste!',
                range: 50,
                price: 8,
                maxNumber: 8,
                color: '#0fff0a'
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