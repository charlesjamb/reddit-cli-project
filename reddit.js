var core = require('./library/basicpromises.js');
var reddit = require('./library/redditpromises.js');
var prompt = require('prompt');
var request = require('request');
var inquirer = require('inquirer');
var Table = require('cli-table');
var colors = require('colors');

var menuChoices = [
  {name: 'Show homepage', value: 'homepage'},
  {name: 'Show subreddit', value: 'showsub'},
  {name: 'List subreddits', value: 'listsubs'}
];

function displayPost(post) {
  console.log(post.data.title.bold);
  console.log( ('https://reddit.com' + post.data.permalink).blue.underline );
  console.log('Author: ' + post.data.author + ', from r/' + post.data.subreddit)
  console.log('\n');
}


function mainMenu() {
  return inquirer.prompt({
    type: 'list',
    name: 'menu',
    message: 'What do you want to do?',
    choices: menuChoices
  })
  .then(function(data) {
    
    switch(data.menu) {
      case 'homepage':

        return reddit.getHomepage()
        .then(function(data) {
        data.forEach(displayPost);
        })

      case 'showsub':

        return inquirer.prompt({
          type: 'input',
          name: 'choice',
          message: 'Which subreddit:',
        })
        .then(function(answer) {
          var userChoice = String(answer.choice).toLowerCase();
          
          return reddit.getSubreddit(userChoice)
          .then(function(data) {
            data.forEach(displayPost);
          })
        })

      case 'listsubs':
        skip = 'listsubs'
        console.log('nothing in showsub yet');
        return;

      default:
        return;
    }
  })
  .then(function() {
    return mainMenu();
  })
  .catch(function(error) {
    console.log(error);
  })
}

mainMenu();
