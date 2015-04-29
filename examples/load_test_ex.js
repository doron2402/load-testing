var loadTest = require('../');
var args = {
	url: 'http://search-site.ci-uswest2.otenv.com/s',
	numberOfRequest: 100,
	statusCodeToExpect: 200,
	checkForStatusCode: true,
	waitBetweenCalls: 2000
};

loadTest.init(args);