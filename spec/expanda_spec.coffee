vows   = require 'vows'
assert = require 'assert'

Expanda = require('../')

examples = require('./fixtures/examples')

vows
  .describe('Expanda')
  .addBatch
    'expansion for: ':
      'ow.ly':
        topic: -> Expanda.process examples.owly.input, @callback
        'should have the expected url' : (err, output) ->
          assert.equal output, examples.owly.output
        'should return the proper array of urls': (err, ouput, urls) ->
          assert.equal urls.length, 1
          assert.equal urls[0], 'http://blogs.forbes.com/tomtaulli/2011/05/19/the-linkedin-ipo-a-valuable-lesson-for-entrepreneurs/'
      'bit.ly':
        topic: -> Expanda.process examples.bitly.input, @callback
        'should have the expected url' : (err, output) ->
          assert.equal output, examples.bitly.output
        'should return the proper array of urls': (err, ouput, urls) ->
          assert.equal urls.length, 1
          assert.equal urls[0], 'http://www.yelp.ca/biz/q-smokehouse-and-southern-barbecue-halifax'
      'is.gd':
        topic: -> Expanda.process examples.isgd.input, @callback
        'should have the expected url' : (err, output) ->
          assert.equal output, examples.isgd.output
        'should return the proper array of urls': (err, ouput, urls) ->
          assert.equal urls.length, 1
          assert.equal urls[0], 'http://maps.google.co.uk/maps?f=q&source=s_q&hl=en&geocode=&q=louth&sll=53.800651,-4.064941&sspn=33.219383,38.803711&ie=UTF8&hq=&hnear=Louth,+United+Kingdom&z=14'
      't.co':
        topic: -> Expanda.process examples.tco.input, @callback
        'should have the expected url' : (err, output) ->
          assert.equal output, examples.tco.output
        'should return the proper array of urls': (err, ouput, urls) ->
          assert.equal urls.length, 1
          assert.equal urls[0], 'http://epic.io'
  .export module