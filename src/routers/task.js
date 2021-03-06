const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            owner: req.user._id
        });
        await task.save()
        res.status(201).send(task);
    }
    catch (err) {
        res.status(400).send(err);
    }
})

// router.get('/tasks', async (req, res) => {
//     try {
//         const tasks = await Task.find({})
//         res.send(tasks)
//     }
//     catch (err) {
//         res.status(500).send(err);
//     }
// })



//get tasks?completed=true
//get tasks?limit=10&skip=0
//get tasks?sortBy=createdAt:asc
router.get('/tasks', auth, async (req, res) => {
    try {
        // const tasks = await Task.find({owner: req.user._id})
        // res.send(tasks)
        // await req.user.populate('tasks').execPopulate()
        const match = {}
        const sort = {}

        if(req.query.completed){
            match.completed = req.query.completed === 'true'
        }

        if(req.query.sortBy){
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1 // sort.createdAt = 1
        }

        await req.user.populate({
            path: 'tasks',
            match, 
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip)
            },
            sort
        }).execPopulate()

        res.send(req.user.tasks)
    }
    catch (err) {
        res.status(500).send(err);
    }
})


// router.get('/tasks/:id', async (req, res) => {
//     try {
//         const _id = req.params.id
//         const task = await Task.findById(_id)
//         if (!task) {
//             return res.status(404).send()
//         }
//         res.send(task)
//     }
//     catch (err) {
//         res.status(500).send(err);
//     }
// })

router.get('/tasks/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id
        const task = await Task.findOne({_id, owner: req.user._id})
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    }
    catch (err) {
        res.status(500).send(err);
    }
})

// router.patch('/tasks/:id', async (req, res) => {
//     try {
//         const updates = Object.keys(req.body)
//         const allowedUpdates = ['description', 'completed']
//         const isValidOperation = updates.every(update => allowedUpdates.includes(update))
//         if (!isValidOperation) {
//             return res.status(400).send('Invalid operations!')
//         }

//         const _id = req.params.id
//         const task = await Task.findById(_id)
//         updates.forEach(update => task[update] = req.body[update])
//         await task.save()
//         // const task = await Task.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true})
//         if (!task) {
//             return res.status(404).send()
//         }
//         res.send(task)
//     }
//     catch (err) {
//         res.status(500).send(err);
//     }
// })

router.patch('/tasks/:id', auth, async (req, res) => {
    try {
        const updates = Object.keys(req.body)
        const allowedUpdates = ['description', 'completed']
        const isValidOperation = updates.every(update => allowedUpdates.includes(update))
        if (!isValidOperation) {
            return res.status(400).send('Invalid operations!')
        }

        const _id = req.params.id
        const task = await Task.findOne({_id, owner: req.user._id})
        updates.forEach(update => task[update] = req.body[update])
        await task.save()
        // const task = await Task.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true})
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    }
    catch (err) {
        res.status(500).send(err);
    }
})

// router.delete('/tasks/:id', async (req, res) => {
//     try {
//         const _id = req.params.id
//         const task = await Task.findByIdAndDelete(_id)
//         if (!task) {
//             return res.status(404).send()
//         }
//         res.send(task)
//     }
//     catch (err) {
//         res.status(500).send(err);
//     }
// })

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id
        const task = await Task.findOneAndDelete({_id, owner: req.user._id})
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    }
    catch (err) {
        res.status(500).send(err);
    }
})
module.exports = router