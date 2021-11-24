import test from 'japa'
import supertest from 'supertest'

import User from 'App/Models/User'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Create User', () => {
  test('should return an error when username is missing', async (assert) => {
    const response = await supertest(BASE_URL).post('/registered')
      .send({
        email: "manoel@gmail.com",
        password: "123456",
        password_confirmation: "123456"
      })
    assert.exists(response.error)
  })

  test('should return an error when email is missing', async (assert) => {
    const response = await supertest(BASE_URL).post('/registered')
      .send({
        username: "Manoel",
        password: "123456",
        password_confirmation: "123456"
      })
    assert.exists(response.error)
  })

  test('should return an error when password is missing', async (assert) => {
    const response = await supertest(BASE_URL).post('/registered')
      .send({
        username: "Manoel",
        email: "manoel@gmail.com",
        password_confirmation: "123456"
      })
    assert.exists(response.error)
  })

  test('should return an error when password_confirmation is missing', async (assert) => {
    const response = await supertest(BASE_URL).post('/registered')
      .send({
        username: "Manoel",
        email: "manoel@gmail.com",
        password: "123456"
      })
    assert.exists(response.error)
  })

  test('should return status 200 when all information is correct', async (assert) => {
    const response = await supertest(BASE_URL).post('/registered')
      .send({
        username: "Manoel",
        email: "manoel@gmail.com",
        password: "123456",
        password_confirmation: "123456"
      })
    assert.equal(200, response.status)
  })

  test('should return a token and a user when all information is correct', async (assert) => {
    const response = await supertest(BASE_URL).post('/registered')
      .send({
        username: "Manoel",
        email: "manoelfernandes@gmail.com",
        password: "123456",
        password_confirmation: "123456"
      })
    assert.hasAllKeys(response.body, { token: {}, user: {} })
  })

  test('should register user in database when all information is correct', async (assert) => {
    await supertest(BASE_URL).post('/registered')
      .send({
        username: "Manoel",
        email: "manoelfernandes@gmail.com",
        password: "123456",
        password_confirmation: "123456"
      })

    const user = await User.findBy('email', 'manoelfernandes@gmail.com')
    assert.exists(user)
  })
})
