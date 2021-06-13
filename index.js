const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(cors())

morgan.token('postBody', (request) => {
  if (request.method === 'POST') {
    return JSON.stringify(request.body)
  }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postBody'))

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  }  
]

app.get('/info', (request, response) => {
  response.send(`Phonebook has info for ${persons.length} people.<br/>${new Date()}`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const person = persons.find(p => p.id === Number(request.params.id))
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  persons = persons.filter(p => p.id !== Number(request.params.id))
  console.log(persons)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  // validation
  if (!request.body.name || !request.body.number){
    return response.status(400).json({
      error: 'name or number missing'
    })
  } else if (persons.find(p => p.name === request.body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const newPerson = {
    name: request.body.name,
    number: request.body.number,
    id: Math.floor(Math.random() * 10000000)
  }
  persons = persons.concat(newPerson)
  console.log(persons)

  response.json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})