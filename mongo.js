const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('You need to provide the db user password as the third arg: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0.yjini.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model("Person", personSchema)

if (process.argv.length === 3) {
  // print all entries
  console.log('phonebook:')
  Person.find({}).then(result => {
    // console.log(result)
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })

} else if (process.argv.length === 5) {
  // add person w/ number
  const newName = process.argv[3]
  const newNumber = process.argv[4]

  const newPerson = new Person({
    name: newName,
    number: newNumber
  })

  newPerson.save().then(result => {
    // console.log(result)
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('number of args not supported')
  console.log('enter password to list all entries, or password with new name and number to add an entry')
  process.exit(1)
}
