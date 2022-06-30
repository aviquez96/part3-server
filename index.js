const express = require("express")
const cors = require("cors")
const morgan = require('morgan')

const app = express()
app.use(cors())
const PORT = process.env.PORT || 8001

const customMorgan = morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.method(req, res) === "POST" ? JSON.stringify(req.body) : ''
  ].join(' ')
})

app.use(express.json())
app.use(customMorgan)

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get("/", (req, res) => {
  res.send("Server is alive")
})

app.get("/api/persons", (req, res) => {
  res.json(persons)
})

app.post("/api/persons", (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  const isDuplicate = persons.find(person => person.name === body.name)

  if (isDuplicate) {
    return res.status(422).json({
      error: 'name must be unique'
    })
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 1000000)
  }
  persons = persons.concat(newPerson)
  res.json(newPerson)
})

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find((person) => person.id === id)

  person ? res.json(person) : res.status(404).end()
})

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter((person) => person.id !== id)

  res.status(204).end()
})

app.get("/info", (req, res) => {
  const phonebookLength = persons.length
  const date = new Date()

  res.json({phonebookLength, date: date.toGMTString()})
})

app.listen(PORT, () => {
  console.log(`App alive in port ${PORT}`)
})
