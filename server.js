'use strict'

const http = require('http')
const fs = require('fs')
const path = require('path')
const readline = require('readline')

const PORT = 3000

const rl = readline.createInterface(process.stdin, process.stdout)

rl.question(
  'Provide a path to the HTML template (template/index.html): ',
  templatePath => {
    templatePath = path.resolve(__dirname, templatePath)
    fs.readFile(templatePath, 'utf8', (err, template) => {
      if (err) {
        console.error(`Couldn't read file ${templatePath}: `, err.message)
        process.exit(1)
      }

      rl.question(
        'Provide a path to the data file (data/data.json): ',
        dataPath => {
          dataPath = path.resolve(__dirname, dataPath)
          fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
              console.error(`Couldn't read file ${dataPath}: `, err.message)
              process.exit(1)
            }

            try {
              data = JSON.parse(data)
            } catch (err) {
              console.error(`Couldn't parse JSON data: `, err.message)
              process.exit(1)
            }

            let renderedTemplate = template
            Object.entries(data).forEach(([key, value]) => {
              renderedTemplate = renderedTemplate.replace(`{{ ${key} }}`, value)
            })

            const server = http.createServer((req, res) => {
              res.setHeader('Content-Type', 'text/html')
              res.write(renderedTemplate)
              res.end()
            })

            server.listen(PORT, () => {
              console.log(`Listening on port ${PORT}`)
            })
          })
        }
      )
    })
  }
)
