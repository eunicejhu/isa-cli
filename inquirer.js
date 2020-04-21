const inquirer = require("inquirer");
const parseArgs = require("minimist");

const { getCurrentDirectoryName } = require("./file");

const argv = parseArgs(process.argv.slice(2));

const githubCredentialsQuestions = [
  {
    type: "input",
    name: "username",
    message: "Type your Github username:",
    validate: (input) => {
      if (!input.length) {
        return "you need to input something";
      } else {
        return true;
      }
    },
  },
  {
    type: "password",
    name: "password",
    mask: true,
    message: "Type your Github password:",
    validate: (input) => {
      if (!input.length) {
        return "you need to input something";
      } else {
        return true;
      }
    },
  },
];

const repoDetailsQuestions = [
  {
    type: "input",
    name: "name",
    message: "Type your Repo name:",
    default: argv._[0] || getCurrentDirectoryName(),
    validate: (input) => {
      if (!input.length) {
        return "you need to input something";
      } else {
        return true;
      }
    },
  },
  {
    type: "input",
    name: "description",
    message: "Optionally enter a description of the repository",
    default: argv._[1] || null,
  },
  {
    type: "list",
    name: "visibility",
    message: "public or private",
    default: "public",
    choices: ["public", "private"],
  },
];

inquirer.prompt(repoDetailsQuestions);

module.exports = {
  askGithubCredentials: () => {
    inquirer.prompt(githubCredentialsQuestions);
  },
  askRepoDetails: () => {
    inquirer.prompt(repoDetailsQuestions);
  },
};
