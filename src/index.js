const express = require('express')
require('./db/mongoose')
const UserRouter = require('./routers/user')
const TaskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

// const multer = require('multer')
// const upload = multer ({
//     dest: 'images',
//     limits: {
//         fileSize: 1000000,
//     },
//     fileFilter(req, file, cb) {
//         if(!file.originalname.endsWith('.pdf')) {
//             return cb(new Error('Please provide a PDF'))
//         }
//         cb(undefined, true)
//     }
// })

// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// }, (error ,req, res, next) => {
//     res.status(400).send({error: error.message})
// })

app.use(express.json())
app.use(UserRouter)
app.use(TaskRouter)

app.listen(port, () => {
    console.log('Server is on port '+ port)
})
