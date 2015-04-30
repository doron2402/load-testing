var assert = require('assert');
var sinon = require('sinon');
var loadTesting = require('../');
var http = require('http');
var PORT = 9876;
var httpServer;

httpServer = http.createServer(function (request, response) {
  response.writeHead(200, {"Content-Type": "text/html"});
  response.end("Load Test!!!");
});

describe('Acceptance Test', function() {
	var sandbox;
	before(function(done){
		sandbox = sinon.sandbox.create();
    sandbox.stub(console, "log");
    httpServer.listen(PORT, done);
	});

	after(function(done){
		sandbox.restore();
		httpServer.close(done);
	});

	describe('When Config', function(){
		var configJson = {
			url: 'http://localhost:' + PORT,
			numberOfRequest: 10,
			statusCodeToExpect: 200,
			waitBetweenCalls: 100,
			runInParallel: true,
			params: {
				username: {
					type: 'Array',
					options: ['doron', 'max', 'evan']
				},
				age: {
					type: 'Number',
					min: 20,
					max: 30
				},
				dataTime: {
					type: 'Date'
				}
			}
		};

		before(function(){
			loadTesting.init(configJson);
		});

		it('Should Start Load Test', function(){
			sinon.assert.calledWithExactly(console.log, '>> Starting Load Test');
		});

		it('Should return status 200', function(){
			sinon.assert.calledWithExactly(console.log, 'Request: status = 200');
		});
	});
});