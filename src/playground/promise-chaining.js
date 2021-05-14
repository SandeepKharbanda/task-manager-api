require('../db/mongoose')
const User = require('../models/user')
const Task = require('../models/task')

// User.findByIdAndUpdate('608f12a2887ba3e74e90859d', { name: "Honey", age: 34})
// .then(user => {
//     console.log("User", user)
//     return User.countDocuments({ age: 34 })
// })
// .then(result => console.log("result", result))
// .catch(err => console.log(err))


// Task.findByIdAndRemove('609063445713df3ca79c8318')
// .then(task => {
//     console.log("Task", task)
//     return Task.countDocuments({ completed: false })
// })
// .then(result => console.log("result", result))
// .catch(err => console.log(err))

const deleteTaskAndCount = async (id) => {
    const deleteTask = await Task.findByIdAndRemove(id)
    console.log(deleteTask)
    const countDocuments = await Task.countDocuments({ completed: false })
    return countDocuments
}

deleteTaskAndCount('609063445713df3ca79c8318')
.then(count => console.log(count))
.catch(err => console.log(err))