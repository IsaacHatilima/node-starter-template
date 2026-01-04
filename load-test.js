import autocannon from 'autocannon'
import {faker} from '@faker-js/faker'

autocannon({
    url: 'http://localhost:3000/auth/register',
    connections: 50,
    amount: 1000,
    method: 'POST',
    headers: {
        'content-type': 'application/json',
    },

    setupClient: client => {
        client.on('request', () => {
            const id = process.hrtime.bigint()

            client.setBody(JSON.stringify({
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: `user_${id}@mail.com`,
                password: 'Password1#',
                password_confirm: 'Password1#',
            }))
        })
    },
}, console.log)
