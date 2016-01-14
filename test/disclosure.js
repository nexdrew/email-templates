import test from 'ava'
import { loadTemplate } from './_utils'

test('expansion of meta', async t => {
  let template = await loadTemplate('disclosure.meta.hbs')
  let metaString = template({
    name: 'Exquisite Disaster',
    email: 'nunya@biznazz.yo',
    from: 'security@npmjs.com',
    disclosure_subject: 'I need to disclose something'
  })
  let meta = JSON.parse(metaString)
  t.is(meta.subject, 'I need to disclose something')
  t.is(meta.to, '"Exquisite Disaster" <nunya@biznazz.yo>')
  t.is(meta.from, '"npm, Inc. Security" <security@npmjs.com>')
})

test('expansion of text', async t => {
  let template = await loadTemplate('disclosure.text.hbs')
  let text = template({
    disclosure_message: 'Something went wrong, but we\'re gonna fix it.'
  })
  t.ok(text.match(/Something went wrong, but we're gonna fix it\./))
})
