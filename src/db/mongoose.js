const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

// const me = new User({
//     name: '   Sandy   ',
//     email: '   KHARBANDA.SANDEEP87@GMAIL.COM    ',
//     password: 'pass123'
// });

// me.save().then(() => {
//     console.log(me)
// }) 
// .catch(err => { 
//     console.log(err)
// })

// const task = new Task({
//     description: '    Learn Node.js framework    ',
// })

// task.save()
// .then(() => {
//     console.log(task)
// })
// .catch(err => {
//     console.log(err)
// })