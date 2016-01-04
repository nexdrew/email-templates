import test from 'ava'
import { loadTemplate } from './_utils'

test('expansion of meta', async t => {
  const template = await loadTemplate('enterprise-confirm-email.meta.hbs')
  const metaString = template({
    email: 'nunya@biznazz.yo',
    from: 'website@npmjs.com'
  })
  const meta = JSON.parse(metaString)
  t.is(meta.subject, 'Welcome to npm On-Site! Please verify your email address')
  t.is(meta.to, '"nunya@biznazz.yo" <nunya@biznazz.yo>')
  t.is(meta.from, '"npm, Inc." <website@npmjs.com>')
})

test('expansion of text', async t => {
  const template = await loadTemplate('enterprise-confirm-email.text.hbs')
  const text = template({
    host: 'https://www.npmjs.com',
    email: 'jiminy@cricket.xyz',
    verification_key: '00000000-0000-0000-0000-000000000000',
    support_email: 'support@npmjs.com'
  })
  t.ok(text.match(/Thanks for verifying your email address\. To continue licensing npm On-Site, simply click this link/))
  t.ok(text.match(/https:\/\/www\.npmjs\.com\/enterprise\/license-options\?email=jiminy@cricket\.xyz&trial=00000000-0000-0000-0000-000000000000/))
  t.ok(text.match(/just reply to this message or send an email to support@npmjs\.com/))
  t.ok(text.match(/npm loves you/))
})
