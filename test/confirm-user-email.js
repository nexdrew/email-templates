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
  let template = await loadTemplate('confirm-user-email.meta.hbs')
  let metaString = template({
    name: 'Exquisite Disaster',
    email: 'nunya@biznazz.yo',
    from: 'website@npmjs.com'
  })
  let meta = JSON.parse(metaString)
  t.is(meta.subject, 'Welcome to npm! Please confirm your email address')
  t.is(meta.to, '"Exquisite Disaster" <nunya@biznazz.yo>')
  t.is(meta.from, '"npm, Inc." <website@npmjs.com>')
  t.same(meta.headers, { 'X-SMTPAPI': { 'category': 'password-reset' } })
})

test('expansion of text', async t => {
  let template = await loadTemplate('confirm-user-email.text.hbs')
  let text = template({
    name: 'fidget',
    host: 'https://www.npmjs.com',
    support_email: 'support@npmjs.com'
  })
  t.ok(text.match(/signed up for an npm user account with the username 'fidget'/))
  t.ok(text.match(/https:\/\/www\.npmjs\.com\/confirm-email\/&123==/))
  t.ok(text.match(/reply to this message or send an email to support@npmjs\.com/))
  t.ok(text.match(/npm loves you/))
})
