const express = require('express')
require('./db/mongoose')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const port = process.env.PORT
const app = express()

// app.use((req, res, next) => {
//     if(req.method === 'GET'){
//         res.status(503).send('GET requests are disabled');
//     }
//     else {
//         next()
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send('Currently, App is in maintenance mode. Please try again after some time.');
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

const Task = require('./models/task')
const User = require('./models/user')


// const main = async () => {
//     // const task = await Task.findById('60983314186c5b2a94d9bcef')
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)

//     const user = await User.findById('6097514719d30b19829fdf73')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)

// }

// main()