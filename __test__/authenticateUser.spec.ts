import test from "japa";
import supertest from "supertest";

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Authenticate User', () => {
    test('should return status 404 when email is incorrect', async (assert) => {
        const response = await supertest(BASE_URL)
            .post('/login')
            .send({
                email: "andrlacerd@mail.com",
                password: "123456"
            })

        assert.equal(response.status, 404)
    })

    test('should return status 404 when passwod is incorrect', async (assert) => {
        const response = await supertest(BASE_URL)
            .post('/login')
            .send({
                email: "andrlacerda@mail.com",
                password: "12345"
            })

        assert.equal(response.status, 404)
    })

    test('should return status 200 when email and passwod is correct', async (assert) => {
        const response = await supertest(BASE_URL)
            .post('/login')
            .send({
                email: "andrlacerda@mail.com",
                password: "123456"
            })
        assert.equal(response.status, 200)
    })

    test('should return a token and user email and passwod is correct', async (assert) => {
        const response = await supertest(BASE_URL)
            .post('/login')
            .send({
                email: "andrlacerda@mail.com",
                password: "123456"
            })
        assert.hasAllKeys(response.body, {token: {}, user: {}})
    })
})