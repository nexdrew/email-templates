import test from 'ava'
import { loadTemplate } from './_utils'

test('expansion of meta', async t => {
  let template = await loadTemplate('npme-trial-verification.meta.hbs')
  let metaString = template({
    name: 'Exquisite Disaster',
    email: 'nunya@biznazz.yo',
    from: 'website@npmjs.com'
  })
  let meta = JSON.parse(metaString)
  t.is(meta.subject, 'Welcome to npm Enterprise! Please verify your email address')
  t.is(meta.to, '"Exquisite Disaster" <nunya@biznazz.yo>')
  t.is(meta.from, '"npm, Inc." <website@npmjs.com>')
})

test('expansion of text', async t => {
  let template = await loadTemplate('npme-trial-verification.text.hbs')
  let text = template({
    name: 'Fundip Stick',
    host: 'https://www.npmjs.com',
    verification_key: '00000000-0000-0000-0000-000000000000'
  })
  t.ok(text.match(/Hi Fundip Stick/))
  t.ok(text.match(/please click this link to verify your email address/))
  t.ok(text.match(/https:\/\/www\.npmjs\.com\/enterprise-verify\?v=00000000-0000-0000-0000-000000000000/))
  t.ok(text.match(/If you have questions or problems, you can reply to this message, or email support@npmjs\.com\./))
  t.ok(text.match(/npm loves you/))
})
