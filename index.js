const express = require('express')
const app = express()

const PORT = 3000

app.get('/', (req, res) => {
    res.send('I am the personal budget basic endpoint')
})

app.listen(PORT, () => {
    console.log('Server is working at ' + PORT)
})