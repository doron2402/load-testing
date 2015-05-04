# load-testing - Ver 0.0.2

## Need to test your app? want to check how its stand DDOS attack?

## How to start
```js
var loadTest = require('load-testing');
var args = {
	url: 'http://www.example.com', //URL
	numberOfRequest: 100, 		//Number of request you want to create could be any number (Numer)
	statusCodeToExpect: 200, // Status code expecting as response (Numer)
	waitBetweenCalls: 50,		// Wait between calls in MS (Number)
	runInParallel: true,		// run in parallel or seriers default is parallel (BOOL)
	requestMethod: 'get'		// request Method could be 'post', 'get', 'put', 'delete' (String)
	params: {								// add param to your url
		username: {						// in this param ?username could be equal to doron or max or evan randomly
			type: 'Array',
			options: ['doron', 'max', 'evan']
		},
		age: {							// in this param ?age will be a random number between 1 to 100
			type: 'Number',
			min: 1,
			max: 100
		},
		date: {						// in this param ?data= will be equal to a date
			type: 'Date'
		}
	}
};

loadTest.init(args); //Start

```



### Options
	- url (MUST)
	-	numberOfRequest (Number)		- default 100
	-	statusCodeToExpect (Number) - default 200
	- waitBetweenCalls (Number)   - default 200MS
	- runInParallel (BOOL)			  - default TRUE
	- params (Object)							- Optional
	- params type :
		- type: 'Array' or 'array' will return random value from array
			- options: []
		- type: 'Number' or 'number' will return a number
			- min: number
			- max: number
		- type: 'Date' or 'date'
