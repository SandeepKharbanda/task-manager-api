const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const sharp = require('sharp');

const router = new express.Router()

router.post('/users', async (req, res) => {
    // user.save().then(() => {
    //     res.status(201).send(user);
    // }) 
    // .catch(err => { 
    //     res.status(400).send(err);
    // })
    try {
        const user = new User(req.body);
        await user.save()
        const token = await user.generateOAuthToken()
        res.status(201).send({user, token});
    }
    catch (err) {
        res.status(400).send(err);
    }
})


router.get('/users/me', auth, async (req, res) => {
    //res.send pass object in JSON.stringify and JSON.stringify will implicitly call toJSON method.
    res.send(req.user)
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        await req.user.save()
        res.send()
    }
    catch (err) {
        res.status(500).send()
    }
    
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    }
    catch (err) {
        res.status(500).send()
    }
    
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateOAuthToken()
        res.status(200).send({user, token});
    }
    catch (err) {
        res.status(400).send(err);
    }
})

// router.get('/users/:id', async (req, res) => {
//     // const _id = req.params.id
//     // User.findById(_id).then(user => {
//     //     if(!user){
//     //         return res.status(404).send()
//     //     }
//     //     res.send(user)
//     // })
//     // .catch(err => res.status(500).send(err));
//     try {
//         const _id = req.params.id
//         const user = await User.findById(_id)
//         if (!user) {
//             return res.status(404).send()
//         }
//         res.send(user)
//     }
//     catch (err) {
//         res.status(500).send(err);
//     }
// })

// router.patch('/users/:id', async (req, res) => {
//     try {
//         const updates = Object.keys(req.body)
//         const allowedUpdates = ['name', 'email', 'age', 'password']
//         const isValidOperation = updates.every(update => allowedUpdates.includes(update))
//         if (!isValidOperation) {
//             return res.status(400).send('Invalid operations!')
//         }

//         const _id = req.params.id

//         const user = await User.findById(_id)
//         updates.forEach(update => user[update] = req.body[update])
//         await user.save()
//         // const user = await User.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true})
//         if (!user) {
//             return res.status(404).send()
//         }
//         res.send(user)
//     }
//     catch (err) {
//         res.status(500).send(err);
//     }
// })

router.patch('/users/me', auth, async (req, res) => {
    try {
        const updates = Object.keys(req.body)
        const allowedUpdates = ['name', 'email', 'age', 'password']
        const isValidOperation = updates.every(update => allowedUpdates.includes(update))
        if (!isValidOperation) {
            return res.status(400).send('Invalid operations!')
        }

        updates.forEach(update => req.user[update] = req.body[update])
        await req.user.save()

        res.send(req.user)
    }
    catch (err) {
        res.status(500).send(err);
    }
})

// router.delete('/users/:id', async (req, res) => {
//     try {
//         const _id = req.params.id
//         const user = await User.findByIdAndDelete(_id)
//         if (!user) {
//             return res.status(404).send()
//         }
//         res.send(user)
//     }
//     catch (err) {
//         res.status(500).send(err);
//     }
// })

router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)
        // if (!user) {
        //     return res.status(404).send()
        // }

        await req.user.remove()
        res.send(req.user)
    }
    catch (err) {
        res.status(500).send(err);
    }
})

const multer = require('multer')
const upload = multer({ 
    // dest: 'avatar', //Remove destination if you don't wat to save images in your destination folder
    limits: {
        fileSize: 1000000 // 1MB max
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){ //You ca use .endsWith(png)
            return cb(new Error('Only jpg, jpeg, and png images are allowed'), )
        }
        cb(null, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    // to fetch user avatar image, remove destination from multer
    // req.user.avatar = req.file.buffer
    const buffer = await sharp(req.file.buffer).resize(200, 200) .png().toBuffer()
    req.user.avatar = buffer
    
    await req.user.save()
    res.send(req.user)
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send(req.user)
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar) {
            throw new Error('Avatar not found')
        }
        res.set('Content-Type', 'image/png') //default its application/json
        res.send(user.avatar)
    }
    catch (err){

    }
})

module.exports = router