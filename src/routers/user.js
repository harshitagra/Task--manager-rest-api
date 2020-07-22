const express = require('express') 
const User = require('../models/user')
const auth = require('../middleware/authentication')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')

const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.getauthorToken()
        res.status(201).send({user, token})
    } catch(e) {
        res.status(400).send(e)
    }
})
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findbyCredentials(req.body.email, req.body.password) 
        const token = await user.getauthorToken()
        res.send({user,token})
    }
    catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token 
        })

        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send()
    }
})
router.get('/users/profile', auth, async (req,res) => {
    res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedU = ['name', 'email', 'password', 'age']
    
    const isValid = updates.every((update) => {
        return allowedU.includes(update)
    })

    if(!isValid) return res.status(400).send('Invalid Operation')
    
    try {
        
        const user = req.user
        updates.forEach(update => {
            user[update] = req.body[update]
        });
        await user.save()

        res.send(user)
    } catch (e) {
        res.status(400).send()
    }
})
router.delete('/users/me', auth, async (req,res) => {
    try {
        await req.user.remove();
        sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch(e) {
        res.status(500).send()
    }
})

const upload = multer({
    // dest: 'avatar',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) return cb(new Error('Please provide jpg, jpeg, png'))

        cb(undefined, true)
    }
    
})

router.post('/users/profile/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 350, height: 350 }).png().toBuffer()
    req.user.avatar = buffer;
    await req.user.save()
    res.send()
}, (error,req, res, next) => {
    res.status(400).send({error: error.message})
})

router.delete('/users/profile/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar) throw new Error()
        res.set( 'content-type', 'image/png')
        res.send(user.avatar)
    } catch(e) {
        res.status(400).send()
    }
})
module.exports = router 