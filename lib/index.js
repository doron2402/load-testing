var _ = require('lodash');
var request = require('request');
var querystring = require('querystring');

var loadTest = {};
var errors = require('./errors');
var _ = require('lodash');
var hl = require('highland');
var fake = require('./fake');

loadTest.defaultOptions = {
  numberOfRequest: 1000,
  statusCodeToExpect: 200, //status code to expect we can set it like a test we are expecting to get 200 but we get 400 so we have a bug
  waitBetweenCalls: 200,
  runInParallel: true,
  requestMethod: 'get'
};

loadTest.init = function(options) {
  console.log('>> Starting Load Test');
  if (!options) {
    throw new Error(errors.optionsIsUndefind);
  }

  if (!options.params) {
    options.params = '';
  }

  if (!options.url) {
    throw new Error(errors.optionsUrlIsUndefined);
  }

  if (!options.numberOfRequest) {
    console.log('options.numberOfRequest is undefined set it to : '  + loadTest.defaultOptions.numberOfRequest);
  }

  if (!options.statusCodeToExpect) {
    console.log('options.statusCodeToExpect is undefined set it to : '  + loadTest.defaultOptions.statusCodeToExpect);
  }

  loadTest.defaultOptions = _.assign(loadTest.defaultOptions, options);
  loadTest.requestAtInterval();
};


loadTest.fakeParamValue = function(args) {
  if (!args || !args.type) {
    throw new Error(errors.missingParamsArgs);
  }

  switch (args.type.toLowerCase()){
    case 'array':
      return fake.generateFakeElementFromAnArray(args.options);
    case 'date':
      return fake.generateFakeDate();
    case 'number':
      return fake.generateFakeNumber(args);
    case 'string':
      return fake.generateFakeString();
    default:
      return fake.generateFakeString();
  }
};

loadTest.requestAtInterval = function () {
  var wrappedRequest = hl.wrapCallback(request[loadTest.defaultOptions.requestMethod]);
  var successes = 0;
  var successRgx = new RegExp(loadTest.defaultOptions.statusCodeToExpect);
  hl(function (push, next) {
    push(null, wrappedRequest(loadTest.buildUrl()));
    next();
  })
  .errors(function (err, push) {
    push(null, err);
  })
  .ratelimit(1, loadTest.defaultOptions.waitBetweenCalls)
  .take(loadTest.defaultOptions.numberOfRequest)
  .through(function (stream) {
    return loadTest.defaultOptions.runInParallel ? stream.merge() : stream.series();
  })
  .on('end', function () {
    console.log('>>>> Finished <<<<');
    console.log('success rate of: ' + successes/loadTest.defaultOptions.numberOfRequest * 100 + '%');
    console.log('failure rate of: ' + (loadTest.defaultOptions.numberOfRequest - successes)/loadTest.defaultOptions.numberOfRequest * 100 + '%');
    process.exit(0);
  })
  .each(function (res) {
    if (successRgx.test(res.statusCode)) { successes++ }
    console.log('Request: status = ' + res.statusCode);
  });
}

loadTest.buildUrl = function() {
  if (!loadTest.defaultOptions.params) {
    return loadTest.defaultOptions.url;
  }
  var query = {};

  Object.keys(loadTest.defaultOptions.params).forEach(function(val){
    query[val] = loadTest.fakeParamValue(loadTest.defaultOptions.params[val]);
  });
  var url = loadTest.defaultOptions.url + '?' + querystring.stringify(query);
  console.log('>> Url: ' + url);
  return url;
};

module.exports = loadTest;
