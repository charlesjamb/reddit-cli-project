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
var choices;

function displayPost(info, choices) {
  return inquirer.prompt({
    type:'list',
    name: 'post',
    message: 'Choose a post',
    choices: choices
  })
  .then(function(userChoice) {
    choices.push(new inquirer.Separator(), 'Main Menu', new inquirer.Separator());

    switch(userChoice.post) {
      case 'Main Menu':
        return mainMenu();

      default:
        var filteredChoice = info.filter(function(onePost) {
          return onePost.data.title === userChoice.post;
        });

        console.log('\n');
        console.log(filteredChoice[0].data.title.white.bold);
        console.log( ('https://reddit.com' + filteredChoice[0].data.permalink).blue.underline );
        console.log('Author: ' + filteredChoice[0].data.author + ', from r/' + filteredChoice[0].data.subreddit)
        console.log('\n');

        return mainMenu();
    }
  })
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
          choices = data.map(function(post) {
            return post.data.title;
          });
          
          return displayPost(data, choices);
        });

      case 'showsub':

        return inquirer.prompt({
          type: 'input',
          name: 'choice',
          message: 'Which subreddit:',
        })
        .then(function(answer) {
          var userChoice = '/r/' + String(answer.choice).toLowerCase() + '/';
          
          return reddit.getSubreddit(userChoice)
          .then(function(data) {
            choices = data.map(function(post) {
              return post.data.title;
            });
            
            return displayPost(data, choices);
          });
        })

      case 'listsubs':

        return reddit.getSubreddits()
        .then(function(data) {
          choices = data.map(function(post) {
            return post.data.title;
          });
          choices.push(new inquirer.Separator(), 'Main Menu', new inquirer.Separator());

          return inquirer.prompt({
          type: 'list',
          name: 'subs',
          message: 'Which subreddit would you like to go to?',
          choices: choices
          })
          .then(function(userChoice) {
            
          switch(userChoice.subs) {
            case 'Main Menu':
              return mainMenu()
            
            default:
              return reddit.getSubreddit(userChoice.subs)
              .then(function(data) {
                choices = data.map(function(post) {
                  return post.data.title;
                });

                return displayPost(data, choices);
              })
            }
          })
        })

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
