import test from "japa";
import supertest from "supertest";

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Show a Game', () => {
    test('should return status 401 when accessed by unauthenticated user', async (assert) => {
        const response = await supertest(BASE_URL)
            .get('/games/1')

        assert.equal(response.status, 401)
    })

    test('should return status 401 when accessed by user with invalid token', async (assert) => {
        const response = await supertest(BASE_URL)
            .get('/games/1')
            .auth('tokeninvalido', { type: 'bearer' })

        assert.equal(response.status, 401)
    })

    test('should return status 404 when accessing a game that does not exist', async (assert) => {
        const user = await supertest(BASE_URL).post('/login')
            .send({
                email: "manoelfernandes@gmail.com",
                password: "123456"
            })

        const token = user.body.token.token

        const response = await supertest(BASE_URL)
            .get('/games/100')
            .auth(token, { type: 'bearer' })

        assert.equal(response.status, 404)
    })

    test('should return the game when it is all right', async (assert) => {
        const user = await supertest(BASE_URL).post('/login')
            .send({
                email: "manoelfernandes@gmail.com",
                password: "123456"
            })

        const token = user.body.token.token

        const response = await supertest(BASE_URL)
            .get('/games/1')
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