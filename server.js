const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Chatkit = require('@pusher/chatkit-server')

const app = express()

const chatkit = new Chatkit.default({
  instanceLocator:'v1:us1:fa6418e5-1c65-476e-946e-10d5b65c0d75',
  key: 'cecc362b-12dd-4d7d-aa03-3ca7ac9ec227:nC2/0MBnopwRwMK7/c+sq3CNngs4RmkcfR/ksyIniX0='
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.post('/users', (req,res) => {
  const { username } = req.body
  chatkit
  .createUser({
    id: username,
    name: username
  })
  .then(() => res.sendStatus(201))
  .catch(error => {
    if(error.error_type === 'services/chatkit/user_already_exists'){
      res.sendStatus(200)
    } else {
      res.status(error.status).json(error)
    }
  })
})

app.post('/authenticate', (req,res) => {
  const authData = chatkit.authenticate({ userId: req.query.user_id })
  res.status(authData.status).send(authData.body)
})

const PORT = 3001
app.listen(PORT, err => {
  if (err) {
    console.error(err)
  } else {
    console.log(`Running on port ${PORT}`)
  }
})
