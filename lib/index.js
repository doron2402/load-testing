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
	failure: 0
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
		console.log('options.numberOfRequest is undefined set it to : '  + defaultOptions.numberOfRequest);
	}

	if (options.checkForStatusCode === true || options.checkForStatusCode === undefined) {
		if (!options.statusCodeToExpect) {
			console.log('options.statusCodeToExpect is undefined set it to : '  + defaultOptions.statusCodeToExpect);
		}
	} else {
		loadTest.defaultOptions.checkForStatusCode = false;
	}

	loadTest.defaultOptions = _.assign(loadTest.defaultOptions, options);

	setInterval(loadTest.createRequest, loadTest.defaultOptions.waitBetweenCalls);

	console.log(loadTest.defaultOptions);
};

loadTest.createRequest = function() {
	console.log('>> Running # ' + loadTest.counter);

	request.get(loadTest.defaultOptions.url)
		.on('response', function(response) {
		  if (loadTest.defaultOptions.checkForStatusCode && loadTest.defaultOptions.statusCodeToExpect && (loadTest.defaultOptions.statusCodeToExpect !== response.statusCode))
		  {
		  	loadTest.results.failure++;
		  	console.log('Wrong Status Code: Expected: ' + loadTest.defaultOptions.statusCodeToExpect + ' response code: ' + response.statusCode);

		  } else if (loadTest.defaultOptions.checkForStatusCode && loadTest.defaultOptions.statusCodeToExpect && (loadTest.defaultOptions.statusCodeToExpect === response.statusCode)){
		  	loadTest.results.success++;
		  	console.log('Status Code: Expected: ' + loadTest.defaultOptions.statusCodeToExpect + ' response code: ' + response.statusCode);
		  }	else  {
		  	console.log(' response code: ' + response.statusCode);
		  }
	});

	loadTest.counter++;
	if (loadTest.counter === loadTest.defaultOptions.numberOfRequest) {
		console.log('>>> Summerize <<<');
		console.log('Success: ' + loadTest.results.success + ' out of ' + loadTest.defaultOptions.numberOfRequest);
		console.log('Failure: ' + loadTest.results.failure + ' out of ' + loadTest.defaultOptions.numberOfRequest);
		console.log('>>>> ' + loadTest.results.success + ' VS ' + loadTest.results.failure + '<<<<');
		console.log('>>> Summerize <<<');
		process.exit(0);
	}
}

module.exports = loadTest;