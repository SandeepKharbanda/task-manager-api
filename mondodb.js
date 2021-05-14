 const mongodb = require('mongodb')
 
 const MongoClient = mongodb.MongoClient;
 const ObjectId = mongodb.ObjectId;

 // Connection URL
const connectionURL = 'mongodb://127.0.0.1:27017';

// Database Name
const database = 'task-manager';

MongoClient.connect(connectionURL, { useNewUrlParser: true}, (error, client) => {
    if (error) {
        return console.log("Unable to connect to database!")
    }
    console.log("Connected correctly!")

    const db = client.db(database)

    // db.collection('users').insertMany([{
    //     name: 'Neha',
    //     age: 28
    // }, {
    //     name: 'Honey',
    //     age: 33
    // }], (err, result) => {
    //     if(err) {
    //         return console.log("Unable to insert user collection!")
    //     }

    //     console.log("User inserted successfully", result.ops)
    // })

    // db.collection('tasks').insertMany([{
    //     description: 'Task 1',
    //     completed: true,
    // }, {
    //     description: 'Task 2',
    //     completed: true,
    // }, {
    //     description: 'Task 3',
    //     completed: false,
    // }], (err, result) => {
    //     if(err) {
    //         return console.log("Unable to insert tasks collection!")
    //     }
    //     console.log("tasks inserted successfully", result.ops)
    // })

    db.collection('tasks').findOne({ _id: ObjectId("608c23094a621e76e67ebe27") }, (error, task) => {
        if(error){
            return console.log("Unable to fetch task!")
        }
        console.log(task)
    })

    const cursor = db.collection('tasks').find({ completed: false })
    cursor.toArray((error, tasks) => {
        if(error){
            return console.log("Unable to fetch tasks!")
        }
        console.log(tasks)
    })

    // db.collection('tasks').updateMany({ completed: false }, {
    //     $set: { completed: true }
    // }).then(result => {
    //     console.log(result)
    // })
    // .catch(error => {
    //     console.log(error)
    // })

    db.collection('tasks').deleteOne({ 
        description: 'Task 2'
    }).then(result => {
        console.log(result.deletedCount)
    })
    .catch(error => {
        console.log(error)
    })

})

 