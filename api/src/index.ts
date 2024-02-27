import express from "express"
const cors = require("cors");
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()

var corsOptions = {
    origin: ["http://127.0.0.1:5173"]
};

app.use(cors(corsOptions));

app.use(express.json())

app.get('/notes', async (req, res) => {
    const notes = await prisma.notes.findMany()
    res.json(notes)
})

app.post('/notes/post', async (req, res) => {
    const { title } = req.body
    const result = await prisma.notes.create({
        data: {
            title,
        },
    })
    res.json(result)
})

app.put('/notes/finish/:id', async (req, res) => {
    const { id } = req.params

    try {
        const todoData = await prisma.notes.findUnique({
            where: { id: Number(id) },
            select: {
                isChecked: true,
            }, 
        })

        const updatedTodo = await prisma.notes.update({
            where: { id: Number(id) || undefined },
            data: { isChecked: !todoData?.isChecked },
        })
        res.json(updatedTodo)
    } catch (err) {
        res.json({ error: `Post with id ${id} doesn't in the database`})
    }
})

app.put('/notes/update/:id', async (req, res) => {
    const { id } = req.params
    const { title } = req.body

    try {
        const todoData = await prisma.notes.findUnique({
            where: {id: Number(id)},
            select: {
                title: true
            }
        })
        
        const updatedTodo = await prisma.notes.update({
            where: { id: Number(id) || undefined },
            data: { title: title },
        })
        res.json(updatedTodo)
    } catch (err) {
        res.json({ error: `Post with id ${id} doesn't in the database`})
    }
})

app.delete('/notes/:id', async (req, res) => {
    const { id } = req.params
    const todo = await prisma.notes.delete({
        where: {
            id: Number(id),
        },
    })
    res.json(todo)
})

const server = app.listen(6969, () =>
    console.log('server listening on port 6969'),
)