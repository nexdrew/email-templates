import test from 'ava'
import { loadTemplate } from './_utils'

test('expansion of meta', async t => {
  const template = await loadTemplate('enterprise-verification.meta.hbs')
  const metaString = template({
    name: 'Exquisite Disaster',
    email: 'nunya@biznazz.yo',
    from: 'website@npmjs.com'
  })
  const meta = JSON.parse(metaString)
  t.is(meta.subject, 'Your npm On-Site trial license key and instructions')
  t.is(meta.to, '"Exquisite Disaster" <nunya@biznazz.yo>')
  t.is(meta.from, '"npm, Inc." <website@npmjs.com>')
})

test('expansion of text', async t => {
  const template = await loadTemplate('enterprise-verification.text.hbs')
  const text = template({
    name: 'Fundip Stick',
    email: 'jiminy@cricket.xyz',
    license_key: '00000000-0000-0000-0000-000000000000',
    support_email: 'support@npmjs.com'
  })
  t.ok(text.match(/Hi Fundip Stick—/))
  t.ok(text.match(/billing email: jiminy@cricket\.xyz/))
  t.ok(text.match(/license key: 00000000-0000-0000-0000-000000000000/))
  t.ok(text.match(/support@npmjs\.com/))
  t.ok(text.match(/npm loves you/))
})
