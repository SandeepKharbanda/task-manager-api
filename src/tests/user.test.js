const request = require('supertest');
const app = require('../app');
const User = require('../models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


const userOneId = new mongoose.Types.ObjectId();

const userOne = {
    _id: userOneId,
    name: "Honey",
    email: "Kharbanda.honey@gmail.com",
    password: "H0n3y*&HK",
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

beforeEach(async () => {
   console.log('beforeEach') 
   await User.deleteMany()
   await new User(userOne).save()
})

afterEach(() => {
    console.log('afterEach') 
})

test('Should signup a new user', async () => {
    const response = await request(app)
    .post('/users').send({
        name: "Sandeep Kharbanda",
        email: "Kharbanda.sandeep@gmail.com",
        password: "$@ndy*&HK"
    })
    .expect(201)

    //Assertion that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assertion about the response
    // expect(response.body).toMatchObject({
    //     user: {
    //         name: "Sandeep Kharbanda",
    //         email: "Kharbanda.sandeep@gmail.com"
    //     }, 
    //     tokens: [{
    //         token: user.tokens[0].token
    //     }]
    // })

    expect(user.password).not.toBe('$@ndy*&HK')
    
})

test('Should login existing user', async () => {
    const response = await request(app)
    .post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    })
    .expect(200)
    const user = await User.findById(response.body.user._id)
    expect(user.tokens[1].token).toBe(response.body.token)
})

test('Should not login nonexisting user', async () => {
    await request(app)
    .post('/users/login').send({
        email: userOne.email,
        password: 'thisismypassword'
    })
    .expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for unauthentic user', async () => {
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})



test('Should delete account for user', async () => {
    const response = await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete account for unauthentic user', async () => {
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})