import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import livereload from 'livereload'
import connectLiveReload from 'connect-livereload'
import { RegistrationTemplate } from '../services/communication/templates/RegistrationTemplate'
import { SignInTemplate } from '../services/communication/templates/SignInTemplate'
import { SupportRequestTemplate } from '../services/communication/templates/SupportRequestTemplate'
import { AppLogger } from 'app/services/Logger'
import { VerificationRequestTemplate } from 'app/services/communication/templates/VerificationRequestTemplate'
import { VerificationSubject } from 'shared/endpoints/kycAdmin'
const PORT = 7000

const liveReloadServer = livereload.createServer()
liveReloadServer.watch(
  path.join(__dirname, '../services/communication/templates')
)
liveReloadServer.watch(path.join(__dirname, './try-template.ts'))
liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('/')
  }, 0)
})

const app = express()
app.use(connectLiveReload())
app.get('/', async (req, res) => {
  const templates = await fs.readdir(
    path.join(__dirname, '../services/communication/templates')
  )
  res
    .status(200)
    .contentType('text/html')
    .send(
      templates
        .filter((link) => link.indexOf('BaseTemplate') == -1)
        .map((link) => path.basename(link))
        .map(
          (link) =>
            `<a href='/template/${path.basename(link)}'>${path.basename(
              link
            )}</a></br>`
        )
        .join('')
    )
})
app.get('/template/RegistrationTemplate.ts', async (req, res) => {
  res.end(
    new RegistrationTemplate().renderBody({
      link: 'http://google.com'
    })
  )
})
app.get('/template/SignInTemplate.ts', async (req, res) => {
  res.send(
    new SignInTemplate().renderBody({
      link: 'http://google.com',
      userName: 'test'
    })
  )
})
app.get('/template/SupportRequestTemplate.ts', async (req, res) => {
  res.send(
    new SupportRequestTemplate().renderBody({
      email: 'test@test.hu',
      message: 'Hi! Please help me. Thanks, Test',
      username: 'test'
    })
  )
})
app.get('/template/VerificationRequestTemplate.ts', async (req, res) => {
  res.send(
    new VerificationRequestTemplate().renderBody({
      subject: VerificationSubject.Identity,
      username: 'exampleuser',

      // case: approved
      approved: true

      // case: rejected
      // approved: false,
      // reason: 'You look like another person, please renew your document.'
    })
  )
})
app.get('/template/:noname', async (req, res) => {
  res.send(`
        <!DOCTYPE html><html>
        <body>
            <h1 style='color:red'>
            Please add an example usage to this template
            </h1>
        </body>
        </html>
    `)
})
app.listen(PORT, () => {
  AppLogger.log(`Email template dev server is running on port ${PORT}.`)
})
