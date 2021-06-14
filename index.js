require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('postBody', (request) => {
  if (request.method === 'POST') {
    return JSON.stringify(request.body)
  }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postBody'))

app.get('/info', (request, response) => {
  response.send(`Phonebook has info for ${persons.length} people.<br/>${new Date()}`)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
    response.json(result)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(result => {
    response.json(result)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  persons = persons.filter(p => p.id !== Number(request.params.id))
  console.log(persons)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  // validation
  if (!request.body.name || !request.body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  } /*else if (persons.find(p => p.name === request.body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }*/

  const newPerson = new Person({
    name: request.body.name,
    number: request.body.number
  })

  newPerson.save().then(result => {
    response.json(result)
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})