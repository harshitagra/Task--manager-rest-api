const express = require('express') 
const User = require('../models/user')
const auth = require('../middleware/authentication')
const router = new express.Router()


router.post('/users', async (req, res) => {
    const user = new User(req.body)
    
    try {
        await user.save()
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
        res.send(req.user)
    } catch(e) {
        res.status(400).send()
    }
})


module.exports = router 