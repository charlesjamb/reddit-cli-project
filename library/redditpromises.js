var core = require('./basicpromises.js');
var prompt = require ('prompt');
var request = require ('request');
var Table = require('cli-table');

function getHomepage() {
	return (
		core.requestJSON('https://reddit.com/.json')
		.then(function(result) {
			var homePage = result.data.children;
			
			return homePage;
		})
	);
}

function getSortedHomepage(sorting) {
	var sortingMethod = String(sorting).toLowerCase();
	return (
		core.requestJSON('https://reddit.com/' + sortingMethod + '.json')
		.then(function(result) {
			var homeSorted = result.data.children;
			
			return homeSorted;
		})
	)
}

function getSubreddit(subreddit) {
	var sub = String(subreddit).toLowerCase();
	return (
		core.requestJSON('https://reddit.com/r/' + sub + '.json')
		.then(function(result) {
			var subReddit = result.data.children;
			
			return subReddit;
		})
	)
}

function getSortedSubreddit(sorting, subreddit) {
	var sortingSub = String(sorting).toLowerCase();
	var subToSort = String(subreddit).toLowerCase();
	return (
		core.requestJSON('https://reddit.com/r/' + subToSort + '/' + sortingSub + '.json')
		.then(function(result) {
			var sortedSub = result.data.children
			
			return sortedSub;
		})
	)
}

function getSubreddits() {
	return (
		core.requestJSON('https://reddit.com/subreddits.json')
		.then(function(result) {
			var subReddits = result.data.children
			console.log(subReddits);
			return subReddits;
		})
	)
}

exports.getHomepage = getHomepage;
exports.getSortedHomepage = getSortedHomepage;
exports.getSubreddit = getSubreddit;
exports.getSortedSubreddit = getSortedSubreddit
exports.getSubreddits = getSubreddits;