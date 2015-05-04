var loadTest = require('./');
var args = {
	url: 'http://search-site.prod-uswest2.otenv.com/s',
numberOfRequest: 100,
statusCodeToExpect: 200,
waitBetweenCalls: 50,
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
},
runInParallel: true
};

loadTest.init(args);
