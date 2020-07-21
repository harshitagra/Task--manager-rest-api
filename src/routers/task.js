const express = require('express') 
const Task = require('../models/task')
const router = new express.Router()

router.get('/task', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    }catch(e) {
        res.status(500).send();
    }
})

router.get('/task/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findById(_id)
        if(!task) return res.status(404).send()
        res.send(task)
    } catch(e) {
        res.status(500).send()
    }
    
})
router.patch('/task/:id' , async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedU = ['Description','Completed']
    const isvalid = updates.every((update) => {
        return allowedU.includes(update)
    })

    if(!isvalid) return res.status(400).send('Invalid Operation')
    
    const _id = req.params.id;
    try {
        const task = await Task.findById(_id) 
        updates.forEach(update => {
            task[update] = req.body[update]
        });
        await task.save()
        if(!task) return res.status(404).send()
        res.send(task)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.delete('/task/:id', async (req,res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id) 
        res.send(task)
    } catch(e) {    
        res.status(400).send(e)
    }
})

module.exports = router