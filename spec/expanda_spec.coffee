vows   = require 'vows'
assert = require 'assert'

Expando = require('../')

examples = require('./fixtures/examples')

vows
  .describe('Expando')
  .addBatch
    'ow.ly' :
      topic: -> Expando.process examples.owly.input, @callback
      'should have the expected url' : (err, output) ->
        assert.equal output, examples.owly.output
    'bit.ly' :
      topic: -> Expando.process examples.bitly.input, @callback
      'should have the expected url' : (err, output) ->
        assert.equal output, examples.bitly.output
  .export module