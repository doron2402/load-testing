var request = require('request');
var loadTest = {};
var errors = require('./errors');
var _ = require('lodash');

loadTest.defaultOptions = {
	numberOfRequest: 1000,
	statusCodeToExpect: 200, //status code to expect we can set it like a test we are expecting to get 200 but we get 400 so we have a bug
	checkForStatusCode: true, //if set to true we can defined the check for status code and compare with the status code we are expecting to get
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

	setInterval(loadTest.createRequest, loadTest.defaultOptions.waitBetweenCalls);

	console.log(loadTest.defaultOptions);
};

loadTest.buildUrl = function() {
	if (!loadTest.defaultOptions.params) {
		return loadTest.defaultOptions.url;
	}
	var query;

	Object.keys(loadTest.defaultOptions.params).forEach(function(val){

		console.log(loadTest.defaultOptions.params[val]);
	});
	return loadTest.defaultOptions.url;
};

loadTest.createRequest = function() {
	console.log('>> Running # ' + loadTest.counter);
	var url = loadTest.buildUrl();
	request.get(url)
		.on('response', function(response) {
		  if (loadTest.defaultOptions.statusCodeToExpect != response.statusCode) {
		  	loadTest.results.failure++;
		  	console.log('Wrong Status Code: Expected: ' + loadTest.defaultOptions.statusCodeToExpect + ' response code: ' + response.statusCode);
		  } else if (loadTest.defaultOptions.statusCodeToExpect == response.statusCode) {
		  	loadTest.results.success++;
		  	console.log('Status Code: Expected: ' + loadTest.defaultOptions.statusCodeToExpect + ' response code: ' + response.statusCode);
		  } else {
		  	loadTest.results.unknown++;
		  	console.log('Unknown.');
		  }
	});

	loadTest.counter++;
	if (loadTest.counter === loadTest.defaultOptions.numberOfRequest) {
		console.log('>>> Summerize <<<');
		console.log('Success: ' + loadTest.results.success + ' out of ' + loadTest.defaultOptions.numberOfRequest);
		console.log('Failure: ' + loadTest.results.failure + ' out of ' + loadTest.defaultOptions.numberOfRequest);
		console.log('Unknown: ' + loadTest.results.unknown + ' out of ' + loadTest.defaultOptions.numberOfRequest);
		console.log('>>>> ' + parseInt((loadTest.results.success/loadTest.defaultOptions.numberOfRequest) * 100) + '% VS ' + parseInt((loadTest.results.failure/loadTest.defaultOptions.numberOfRequest) * 100) + '% <<<<');
		console.log('>>> Summerize <<<');
		process.exit(0);
	}
}

module.exports = loadTest;