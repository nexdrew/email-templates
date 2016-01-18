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
  let template = await loadTemplate('revert-email-change.meta.hbs')
  let metaString = template({
    name: 'Exquisite Disaster',
    changeEmailFrom: 'nunya@biznazz.yo',
    from: 'support@npmjs.com'
  })
  let meta = JSON.parse(metaString)
  t.is(meta.subject, 'Your npm email change')
  t.is(meta.to, '"Exquisite Disaster" <nunya@biznazz.yo>')
  t.is(meta.from, '"npm, Inc. support" <support@npmjs.com>')
  t.same(meta.headers, { 'X-SMTPAPI': { 'category': 'email-change-revert' } })
})

test('expansion of text', async t => {
  let template = await loadTemplate('revert-email-change.text.hbs')
  let text = template({
    name: 'fidget',
    changeEmailFrom: 'hello.fidget@gmail.co',
    changeEmailTo: 'f@idg.et',
    host: 'https://www.npmjs.com',
    support_email: 'support@npmjs.com'
  })
  t.ok(text.match(/requested that the email address of the 'fidget' npm user account be changed/))
  t.ok(text.match(/old address: <hello\.fidget@gmail\.co>/))
  t.ok(text.match(/new address: <f@idg\.et>/))
  t.ok(text.match(/a confirmation email was sent to <f@idg\.et>/))
  t.ok(text.match(/Please click the following link to revert the change immediately/))
  t.ok(text.match(/https:\/\/www\.npmjs\.com\/email-edit\/revert\/&123==/))
  t.ok(text.match(/visit https:\/\/www\.npmjs\.com and change your password right away/))
  t.ok(text.match(/reply to this message, or email support@npmjs\.com/))
  t.ok(text.match(/npm loves you/))
})
