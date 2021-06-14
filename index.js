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

app.get('/info', (request, response, next) => {
  Person.find({}).then(result => {
    response.send(`Phonebook has info for ${result.length} people.<br/>${new Date()}`)
  }).catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(result => {
    response.json(result)
  }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(result => {
    response.json(result)
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id).then(result => {
    response.status(204).end()
  }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const newPerson = new Person({
    name: request.body.name,
    number: request.body.number
  })

  newPerson.save().then(result => {
    response.json(result)
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const updatedPerson = {
    number: request.body.number
  }

  Person.findByIdAndUpdate(request.params.id, updatedPerson, {new:true, runValidators: true})
    .then(result => {
      response.json(result)
    })
    .catch(error => next(error))
})

// handle requests to unknown endpoints
const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)

// error handling
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformatted id'})
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({error: error.message})
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
