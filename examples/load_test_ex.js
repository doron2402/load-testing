var loadTest = require('../');
var args = {
	// url: 'http://search-site.ci-uswest2.otenv.com/s',
	url: 'http://www.opentable.com/s/',
	numberOfRequest: 30,
	statusCodeToExpect: 200,
	checkForStatusCode: true,
	waitBetweenCalls: 250,
	params: {
		metroId: {
			type: 'Number',
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