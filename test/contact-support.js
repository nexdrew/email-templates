import test from 'ava'
import { loadTemplate } from './_utils'

test('expansion of meta', async t => {
  let template = await loadTemplate('contact-support.meta.hbs')
  let metaString = template({
    subject: 'Pick a subject. Any subject.',
    email: 'nunya@biznazz.yo',
    from: 'website@npmjs.com'
  })
  let meta = JSON.parse(metaString)
  t.is(meta.subject, 'Pick a subject. Any subject.')
  t.is(meta.to, 'nunya@biznazz.yo')
  t.is(meta.from, '"npm, Inc. Support" <support@npmjs.com>')
})

test('expansion of text', async t => {
  let template = await loadTemplate('contact-support.text.hbs')
  let text = template({
    name: 'Fundip Stick',
    email: 'jiminy@cricket.xyz',
    message: 'Uhh, this is a weird template.'
  })
  t.ok(text.match(/From: "Fundip Stick" <jiminy@cricket\.xyz>/))
  t.ok(text.match(/Uhh, this is a weird template\./))
})
