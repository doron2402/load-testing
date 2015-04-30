var moment = require('moment');
var fake = {};

fake.generateFakeString = function() {
  var text = '';
  var lengthOfString = 8;
  var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for( var i=0; i < lengthOfString; i++ ) {
    text += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return text;
};


fake.generateFakeNumber = function(args) {
  var min = 0, max = 100;

  if (args && args.max) {
    max = args.max;
  }

  if (args && args.min) {
    min = args.min;
  }

  return Math.floor(Math.random()*(max-min+1)+min);
};

fake.generateFakeElementFromAnArray = function(array) {
  return array[Math.floor(Math.random()*array.length)];
};

fake.generateFakeDate = function() {
  var num = fake.generateFakeNumber({min: 1, max: 30});
  return moment().add(num, 'day').format('YYYY-MM-DD hh:mm');
};
module.exports = fake;