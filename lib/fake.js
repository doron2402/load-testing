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

fake.generateFakeData = function() {

  function randomDate(start, end) {
    console.log(start);
    console.log(end);
    var date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    console.log(date);
    return date;
  }

  var today = new Date();
  var year = today.getYear();
  var month = today.getMonth();
  var day = today.getDate();

  return randomDate(new Date(year, month, day), new Date(year, (month+1), day));
};
module.exports = fake;