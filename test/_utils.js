const Handlebars = require('handlebars')
const fs = require('fs')
const path = require('path')

exports.loadTemplate = function loadTemplate (file) {
  return new Promise(function (resolve, reject) {
    fs.readFile(path.join('..', file), 'utf-8', function (err, source) {
      if (err) return reject(err)
      return resolve(Handlebars.compile(source))
    })
  })
}
