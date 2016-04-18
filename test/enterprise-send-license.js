import test from 'ava'
import { loadTemplate } from './_utils'

test('expansion of meta', async t => {
  let template = await loadTemplate('enterprise-send-license.meta.hbs')
  let metaString = template({
    name: 'Exquisite Disaster',
    email: 'nunya@biznazz.yo',
    from: 'website@npmjs.com'
  })
  let meta = JSON.parse(metaString)
  t.is(meta.subject, 'Your npm Enterprise license')
  t.is(meta.to, '"Exquisite Disaster" <nunya@biznazz.yo>')
  t.is(meta.from, '"npm, Inc." <website@npmjs.com>')
})

test('expansion of text', async t => {
  let template = await loadTemplate('enterprise-send-license.text.hbs')
  let text = template({
    name: 'Fundip Stick',
    email: 'jiminy@cricket.xyz',
    license_key: '00000000-0000-0000-0000-000000000000',
    requirementsUrl: 'https://docs.npmjs.com/enterprise/requirements',
    instructionsUrl: 'https://docs.npmjs.com/enterprise/installation',
    support_email: 'support@npmjs.com'
  })
  t.ok(text.match(/Hi Fundip Stick/))
  t.ok(text.match(/https:\/\/docs\.npmjs\.com\/enterprise\/requirements/))
  t.ok(text.match(/https:\/\/docs\.npmjs\.com\/enterprise\/installation/))
  t.ok(text.match(/billing email: jiminy@cricket\.xyz/))
  t.ok(text.match(/license key: 00000000-0000-0000-0000-000000000000/))
  t.ok(text.match(/reply to this message or send an email to support@npmjs\.com/))
  t.ok(text.match(/npm loves you/))
})
