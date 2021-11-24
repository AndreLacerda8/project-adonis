import test from "japa";
import supertest from "supertest";

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Index in Games', () => {
    test('should return status 401 when accessed by unauthenticated user', async (assert) => {
        const response = await supertest(BASE_URL)
            .get('/games')

        assert.equal(response.status, 401)
    })

    test('should return status 401 when accessed by user with invalid token', async (assert) => {
        const response = await supertest(BASE_URL)
            .get('/games')
            .auth('tokeninvalido', { type: 'bearer' })

        assert.equal(response.status, 401)
    })

    test('should return status 200 when accessed by user valid', async (assert) => {
        const user = await supertest(BASE_URL).post('/login')
            .send({
                email: "manoelfernandes@gmail.com",
                password: "123456"
            })

        const token = user.body.token.token

        const response = await supertest(BASE_URL)
            .get('/games')
            .auth(token, { type: 'bearer' })

        assert.equal(response.status, 200)
    })

    test('should return all games when accessed by user valid', async (assert) => {
        const user = await supertest(BASE_URL).post('/login')
            .send({
                email: "manoelfernandes@gmail.com",
                password: "123456"
            })

        const token = user.body.token.token

        const response = await supertest(BASE_URL)
            .get('/games')
            .auth(token, { type: 'bearer' })

        assert.hasAllKeys(response.body, { 'min-cart-value': Number, types: [] })
    })
})