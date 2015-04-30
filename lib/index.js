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
};
loadTest.counter = 1;
loadTest.results = {
  success: 0,
  failure: 0,
  unknown: 0
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

  // setInterval(loadTest.createRequest, loadTest.defaultOptions.waitBetweenCalls);

  loadTest.requestAtInterval(loadTest.buildUrl(), loadTest.defaultOptions);

  console.log(loadTest.defaultOptions);
};


loadTest.fakeParamValue = function(args) {
	if (!args || !args.type) {
		throw new Error(errors.missingParamsArgs);
	}

	switch (args.type.toLowerCase()){
		case 'array':
			return fake.generateFakeElementFromAnArray(args.options);
			break;
		case 'date':
			return fake.generateFakeDate();
			break;
		case 'number':
			return fake.generateFakeNumber(args);
			break;
		case 'string':
			return fake.generateFakeString();
			break;
		default:
			return fake.generateFakeString();
			break;
	}
};

// Makes requests at regular intervals.
// Returns stream object which prints results.
loadTest.requestAtInterval = function (url, opts) {
  var wrappedRequest = hl.wrapCallback(request);

  var successes = 0;
  var successRgx = new RegExp(opts.statusCodeToExpect);
  return hl(function (push, next) {
    push(null, wrappedRequest(url));
    next();
  })
  .errors(function (err, push) {
    push(null, err);
  })
  .ratelimit(1, opts.waitBetweenCalls)
  .take(opts.numberOfRequest)
  .through(function (stream) {
    return opts.parallel ? stream.merge() : stream.series();
  })
  .on('end', function () {
    console.log('Finished with a success rate of: ' + 
        successes/opts.numberOfRequest * 100 + '%');
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
	return loadTest.defaultOptions.url + '?' + querystring.stringify(query);
};

module.exports = loadTest;
