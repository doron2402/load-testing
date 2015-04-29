var request = require('request');
var loadTest = {};
var errors = require('./errors');

var defaultOptions = {
	numberOfRequest: 1000,
	statusCodeToExpect: 200, //status code to expect we can set it like a test we are expecting to get 200 but we get 400 so we have a bug
	checkForStatusCode: true //if set to true we can defined the check for status code and compare with the status code we are expecting to get
};

loadTest.init = function(options) {
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
		options.numberOfRequest = defaultOptions.numberOfRequest;
	}

	if (options.checkForStatusCode === true || options.checkForStatusCode === undefined) {
		if (!options.statusCodeToExpect) {
			console.log('options.statusCodeToExpect is undefined set it to : '  + defaultOptions.statusCodeToExpect);
			options.statusCodeToExpect = defaultOptions.statusCodeToExpect;
		}
	}




	var i = 0;
	while(i < options.numberOfRequest) {
		request
		  .get(options.url)
		  .on('response', function(response) {
		  	if (options.statusCodeToExpect && (options.statusCodeToExpect !== response.statusCode)) {
		  		console.log('Wrong Status Code: Expected: ' + options.statusCodeToExpect + ' response code: ' + response.statusCode);
		  	} else {
		  		console.log(' response code: ' + response.statusCode);
		  	}
		  });
		i++;
	}
};

module.exports = loadTest;