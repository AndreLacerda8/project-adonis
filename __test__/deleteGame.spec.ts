import test from "japa";
import supertest from "supertest";

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Delete Game', () => {
    test('should return status 401 when requested by unauthenticated user', async (assert) => {
        const response = await supertest(BASE_URL).delete('/games/4')

        assert.equal(response.status, 401)
    })

    test('should return status 403 when requested by a non-admin user', async (assert) => {
        const user = await supertest(BASE_URL).post('/login')
            .send({
                email: "test@gmail.com",
                password: "123456",
            })

        const token = user.body.token.token

        const response = await supertest(BASE_URL)
            .delete('/games/4')
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
            .delete('/games/100')
            .auth(token, { type: 'bearer' })

        assert.equal(response.status, 404)
    })

    test('should return status 200 when the user is authenticated and is admin', async (assert) => {
        const user = await supertest(BASE_URL).post('/login')
            .send({
                email: "andrlacerda@mail.com",
                password: "123456",
            })

        const token = user.body.token.token

        const response = await supertest(BASE_URL)
            .delete('/games/4')
            .auth(token, { type: 'bearer' })

        assert.equal(response.status, 200)
    })
})