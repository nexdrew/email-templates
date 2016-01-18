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
  let template = await loadTemplate('forgot-password.meta.hbs')
  let metaString = template({
    name: 'Exquisite Disaster',
    email: 'nunya@biznazz.yo',
    from: 'support@npmjs.com'
  })
  let meta = JSON.parse(metaString)
  t.is(meta.subject, 'Your npm password reset')
  t.is(meta.to, '"Exquisite Disaster" <nunya@biznazz.yo>')
  t.is(meta.from, '"npm, Inc. support" <support@npmjs.com>')
  t.same(meta.headers, { 'X-SMTPAPI': { 'category': 'password-reset' } })
})

test('expansion of text', async t => {
  let template = await loadTemplate('forgot-password.text.hbs')
  let text = template({
    name: 'fidget',
    host: 'https://www.npmjs.com',
    support_email: 'support@npmjs.com'
  })
  t.ok(text.match(/requested the reset of the 'fidget' npm user account/))
  t.ok(text.match(/https:\/\/www\.npmjs\.com\/forgot\/&123==/))
  t.ok(text.match(/You can reply to this message, or email support@npmjs\.com if you have questions./))
  t.ok(text.match(/npm loves you/))
})
