const express = require('express')
const { v4: uuidv4 } = require('uuid')
const { formatDate } = require('../utils/helperFunctions/formatDate')
const { STATUS } = require('../utils/constants/constants')

const { fieldFormatValidator } = require('../middlewares/validator')
const { getTasksQuerySchema } = require('../schemas/getTasksQuerySchema')
const { createTaskBodySchema } = require('../schemas/createTaskBodySchema')
const { updateTasksParamsSchema } = require('../schemas/updateTaskParamsSchema')

const router = express.Router();

let tasks = [
    {
        id: 'f797de88-75a1-48f3-b27d-3650844c2f12',
        title: "Preparar la clase de Nuclio",
        dueDate: "2023/04/20 18:30:00",
        status: "COMPLETED",
        createdAt: "2023/04/15 18:30:00",
        modifiedAt: null,
        deletedAt: null,
    },
    {
        id: '1cc0282f-97fc-41aa-a9e3-3e295d824cdc',
        title: "Preparar las maletas",
        dueDate: "2023/07/20 11:54:30",
        status: "PENDING",
        createdAt: "2023/04/15 18:30:00",
        modifiedAt: null,
        deletedAt: null,
    },
    {
        id: 'a3cbd0a5-425a-40a5-9e82-e67eaf54c050',
        title: "Celebrar fin de año",
        dueDate: "2023/12/31 03:40:00",
        status: "PENDING",
        createdAt: "2023/04/15 03:28:34",
        modifiedAt: null,
        deletedAt: null,
    },
    {
        id: '659343c9-f99c-48a0-838c-3b2a9bc83339',
        title: "Celebrar la navidad",
        dueDate: "2023/12/25 12:07:23",
        status: "PENDING",
        createdAt: "2023/04/15 18:30:00",
        modifiedAt: "2023/04/18 11:15:00",
        deletedAt: null,
    },
    {
        id: 'eca27318-d394-48dd-8d01-2fcc411041ce',
        title: "TEST",
        dueDate: "2023/12/25 18:30:00",
        status: "PENDING",
        createdAt: "2023/04/15 18:30:00",
        modifiedAt: null,
        deletedAt: "2023/04/15 19:30:00",
    }
]

// GET All tasks - /tasks
router.get('/', fieldFormatValidator('query')(getTasksQuerySchema), (req, res, next) => {
    const { datemin , datemax, search, status } = req.query
    
    const foundTasks = tasks.filter(task => {
        const dateMinMatch = !datemin || (typeof datemin === 'string' && Date.parse(task.dueDate) >= Date.parse(datemin));
        const dateMaxMatch = !datemax || (typeof datemax === 'string' && Date.parse(task.dueDate) <= Date.parse(datemax));
        const searchMatch = !search || task.title.includes(search);
        const statusMatch = !status || task.status === status;
    
        return dateMinMatch && dateMaxMatch && searchMatch && statusMatch;
      });

    // 404 - Tasks not found
    if(foundTasks.length === 0) {
        return res.status(404).json({ msg: "No tasks were found" })
    }

    // 200 - Sending all tasks
    res.status(200).json(foundTasks)
})

// GET A task - /tasks/:id
router.get('/:id', (req, res, next) => {
    const taskId = req.params.id
    const foundTask = tasks.find(task => task.id === taskId)

    // 404 - Task not found
    if(!foundTask) return res.status(404).json({ msg: 'Task not found' })
    
    // 200 - Found the task
    res.status(200).json(foundTask) 
})

// POST A task - /tasks
router.post('/', fieldFormatValidator('body')(createTaskBodySchema), (req, res, next) => {
    const newTask = {
        id: uuidv4(),
        title: req.body.title,
        dueDate: req.body.dueDate,
        status: STATUS.PENDING,
        createdAt: formatDate(new Date()),
        modifiedAt: undefined,
        deletedAt: undefined
    }
    
    // 400 - Duplicated Task
    const duplicated = tasks.find(task => task.title === newTask.title)
    if (duplicated) return res.status(400).json({ msg: "Task already exists" })

    // 200 - Task added correctly
    tasks.push(newTask)
    res.status(200).json(newTask)
})

// DELETE A task - /tasks/:id
router.delete('/:id', (req, res, next) => {
    const taskId = req.params.id

    // 404 - Task doesn't exist
    const foundTaskIndex = tasks.findIndex(task => task.id === taskId)
    if(foundTaskIndex === -1) return res.status(404).json({ msg: `Task with id ${taskId} doesn't exist` })

    // 200 - Task deleted correctly - Soft delete
    tasks[foundTaskIndex] = {
        ...tasks[foundTaskIndex],
        status: STATUS.DELETED,
        deletedAt: formatDate(new Date())
    }
    res.status(200).json({ msg: 'Task successfully deleted' })
})

// PUT Update a task - /tasks/:id
router.put('/:id', fieldFormatValidator('body')(updateTasksParamsSchema), (req, res, next) => {
    const taskId = req.params.id
    const { title, dueDate, status } = req.body
      
    //404 - Task doesn't exist
    const foundTaskIndex = tasks.findIndex(task => task.id === taskId)
    if(foundTaskIndex === -1) return res.status(404).json({ msg: `Task with id ${taskId} doesn't exist`})

    //200 - Task updated correctly
    tasks[foundTaskIndex] = { 
        ...tasks[foundTaskIndex],
        title: title || tasks[foundTaskIndex].title,
        dueDate: dueDate || tasks[foundTaskIndex].dueDate,
        status: status || tasks[foundTaskIndex].status,
        modifiedAt: formatDate(new Date())
    } 
    res.status(200).json(tasks[foundTaskIndex])
})

module.exports = router