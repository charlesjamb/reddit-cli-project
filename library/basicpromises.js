var request = require('request');
var prompt = require('prompt');

// request promise
function requestPromise(url) {
	return new Promise(function(resolve, reject) {
		request(url, function(err, result) {
			if (err) {
				reject(err);
			}
			else {
				resolve(result);
			}
		})
	});
}

// prompt promise
function promptPromise(question) {
	return new Promise(function(resolve, reject) {
		prompt.get(question, function(err, answer) {
			if (err) {
				reject(err);
			}
			else {
				resolve(answer);
			}
		})
	});
}

// request as JSON
function requestJSON(url) {
	return ( 
		requestPromise(url)
		.then(function(result) {
			var actualResult = JSON.parse(result.body);
			return actualResult;
		})
	);	
}

exports.requestPromise = requestPromise;
exports.promptPromise = promptPromise;
exports.requestJSON = requestJSON;