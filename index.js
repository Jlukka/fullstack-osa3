const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('body', (request, response) => JSON.stringify(request.body))

app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
      { 
        "name": "Arto Hellas", 
        "number": "040-123456",
        "id": "1"
      },
      { 
        "name": "Ada Lovelace", 
        "number": "39-44-5323523",
        "id": "2"
      },
      { 
        "name": "Dan Abramov", 
        "number": "12-43-234345",
        "id": "3"
      },
      { 
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122",
        "id": "4"
      }
    ]

const generateId = () => {
    const newId = Math.floor(Math.random()*1e10)
    return String(newId)
}

app.get('/api/persons', (request, response) => {
    response.send(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
                <p>${new Date()}</p>`)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {

    const body = request.body
    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
    if (!body.number) {
        return response.status(400).json({
            error: "number missing"
        })
    }
    if (persons.some(person => person.name === body.name)) {
        return response.status(400).json({
            error: "name already exists"
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`)
})