import test from "japa";
import supertest from "supertest";

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Create Bet', () => {
    test('should return 401 when user is not authenticated', async (assert) => {
        const response = await supertest(BASE_URL)
            .post('/bets')
            .send([])

        assert.equal(response.status, 401)
    })

    test('should return status 422 when total price is less than min-cart-value', async (assert) => {
        const user = await supertest(BASE_URL).post('/login')
            .send({
                email: "andrlacerda@mail.com",
                password: "123456",
            })

        const token = user.body.token.token

        const response = await supertest(BASE_URL)
            .post('/bets')
            .send([{game_id: 2, numbers: '4,8,9,10,18,28'}])
            .auth(token, { type: 'bearer' })

        assert.equal(response.status, 422)
    })

    test('should return status 200 when it is all right', async (assert) => {
        const user = await supertest(BASE_URL).post('/login')
            .send({
                email: "andrlacerda@mail.com",
                password: "123456",
            })

        const token = user.body.token.token

        const bets: {game_id: number, numbers: string}[] = []
        for(let i = 0; i < 10; i++){
            let numbers = ''
            for(let j = 0; j < 6; j++){
                const randomNumber = (Math.floor(Math.random() * 60) + 1) + ''
                if(!numbers.includes(randomNumber)){
                    numbers += randomNumber
                    if(j < 5) numbers += ','
                } else {
                    j--
                }
            }

            numbers = numbers.split(',').sort((a, b) => +a - +b ).join(',')

            bets.push({ game_id: 2, numbers: numbers })
        }

        const response = await supertest(BASE_URL)
            .post('/bets')
            .send(bets)
            .auth(token, { type: 'bearer' })

        console.log(response.body)

        assert.equal(response.status, 200)
    })
})