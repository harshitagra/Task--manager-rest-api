const express = require('express') 
const Task = require('../models/task')
const auth = require('../middleware/authentication')

const router = new express.Router()


router.post('/task', auth, async ( req, res) => {
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        author: req.user._id
    })
    try {
        await task.save()
        res.send(task)
    }catch(e) {
        res.status(500).send()
    }
    
})

router.get('/task', auth, async (req, res) => {
    try {
        const tasks = await Task.find({author: req.user._id})
        res.send(tasks)
    }catch(e) {
        res.status(500).send();
    }
})

router.get('/task/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id
        const task = await Task.findOne({ _id, author: req.user._id})
        if(!task) return res.status(404).send()
        res.send(task)
    } catch(e) {
        res.status(500).send()
    }
    
})

router.patch('/task/:id' , auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedU = ['Description','Completed']
    const isvalid = updates.every((update) => {
        return allowedU.includes(update)
    })

    if(!isvalid) return res.status(400).send('Invalid Operation')
    
    try {
        const task = await Task.findOne({_id: req.params.id, author: req.user._id }) 
        if(!task) return res.status(404).send()

        updates.forEach(update => {
            task[update] = req.body[update]
        });

        await task.save()
        res.send(task)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.delete('/task/:id', auth, async (req,res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, author: req.user._id})
        if(!task) return res.status(404).send() 
        res.send(task)
    } catch(e) {    
        res.status(400).send(e)
    }
})

module.exports = router