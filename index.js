const express = require('express')
const app = express()
const port = 3001

const apiRoutes = require('./src/routes/index')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('REST API Server - Use /api/* endpoints')
})

app.use('/api', apiRoutes)

app.listen(port, () => {
    console.log(`REST API server listening on port ${port}`)
})
