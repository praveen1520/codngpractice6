const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const direcpa = path.join(__dirname, 'covid19India.db')
const app = express()
app.use(express.json())
let db = null
const intilaizedb = async () => {
  try {
    db = await open({
      filename: direcpa,
      driver: sqlite3.Database,
    })
    app.listen(3000, async () => {
      console.log('server is started at https//localhost/3000')
    })
  } catch (e) {
    console.log(`error happened at ${e.message}`)
  }
}
intilaizedb()
const converttodbobject = dbobj => {
  return {
    stateId: dbobj.state_id,
    stateName: dbobj.state_name,
    population: dbobj.population,
  }
}
app.get('/states/', async (request, response) => {
  const sqlquery = 'SELECT * FROM state ORDER BY state_id;'
  const list = await db.all(sqlquery)
  response.send(list.map(sateobj => converttodbobject(sateobj)))
})

app.get('/states/:stateId/', async (request, response) => {
  let {stateId} = request.params
  const getbookquery = `SELECT * FROM state WHERE state_id='${stateId}'`
  const getdeta = await db.get(getbookquery)
  response.send(converttodbobject(getdeta))
})
module.exports = app
