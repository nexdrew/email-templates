import test from 'ava'
import { loadTemplate } from './_utils'
import Handlebars from 'handlebars'

test.before(t => {
  Handlebars.registerHelper('tokenHelper', () => {
    return '&123=='
  })
})

test.after(t => {
  Handlebars.unregisterHelper('tokenHelper')
})

test('expansion of meta', async t => {
  const template = await loadTemplate('confirm-email-change.meta.hbs')
  const metaString = template({
    name: 'Exquisite Disaster',
    changeEmailTo: 'nunya@biznazz.yo',
    from: 'website@npmjs.com'
  })
  const meta = JSON.parse(metaString)
  t.is(meta.subject, 'Please confirm your new npm email')
  t.is(meta.to, '"Exquisite Disaster" <nunya@biznazz.yo>')
  t.is(meta.from, '"npm, Inc." <website@npmjs.com>')
  t.same(meta.headers, { 'X-SMTPAPI': { 'category': 'email-change-confirm' } })
})

test('expansion of text', async t => {
  const template = await loadTemplate('confirm-email-change.text.hbs')
  const text = template({
    name: 'fidget',
    changeEmailFrom: 'hello.fidget@gmail.co',
    changeEmailTo: 'f@idg.et',
    host: 'https://www.npmjs.com',
    support_email: 'support@npmjs.com'
  })
  t.ok(text.match(/the email address of the 'fidget' npm user account be changed/))
  t.ok(text.match(/old address: <hello\.fidget@gmail\.co>/))
  t.ok(text.match(/new address: <f@idg\.et>/))
  t.ok(text.match(/https:\/\/www\.npmjs\.com\/email-edit\/confirm\/&123==/))
  t.ok(text.match(/reply to this message or send an email to support@npmjs\.com/))
  t.ok(text.match(/npm loves you/))
})
