var loadTest = require('../');
var args = {
	url: 'http://search-site.ci-uswest2.otenv.com/s',
	numberOfRequest: 10,
	statusCodeToExpect: 200,
	waitBetweenCalls: 400,
	runInParallel: true,
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
	}
};

loadTest.init(args);