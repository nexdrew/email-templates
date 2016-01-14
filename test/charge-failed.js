import test from 'ava'
import { loadTemplate } from './_utils'

test('expansion of meta', async t => {
  let template = await loadTemplate('charge-failed.meta.hbs')
  let metaString = template({
    name: 'Exquisite Disaster',
    email: 'nunya@biznazz.yo',
    from: 'website@npmjs.com'
  })
  let meta = JSON.parse(metaString)
  t.is(meta.subject, 'npm, Inc.: charge failed')
  t.is(meta.to, '"Exquisite Disaster" <nunya@biznazz.yo>')
  t.is(meta.from, '"npm, Inc." <website@npmjs.com>')
})

test('expansion of text', async t => {
  let template = await loadTemplate('charge-failed.text.hbs')
  let text = template({
    amount: '$700.00',
    card: '9876',
    support_email: 'support@npmjs.com'
  })
  t.ok(text.match(/We attempted to charge \$700\.00, to your card ending in 9876/))
  t.ok(text.match(/reply to this message or send an email to support@npmjs\.com/))
})
