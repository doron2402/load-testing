var loadTest = require('../');
var args = {
	url: 'http://someurl.com/path',
	numberOfRequests: 10,
	statusCodeToExpect: 200,
	waitBetweenCalls: 50,
	runInParallel: false,
	params: {
		metroId: {
			type: 'Array',
			options: [8, 4, 72]
		},
		covers: {
			type: 'Number',
			min: 1,
			max: 10
		},
		dataTime: {
			type: 'Date'
		}
	},
	runInParallel: true,
	requestMethod: 'post'
};

loadTest.init(args);
