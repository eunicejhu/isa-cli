#!/usr/bin/env node
const github = require("./github");
const repo = require("./repo.js");
const chalk = require("chalk");

// retrieve & set Github authentication token
// create remote repository
// create .gitignore
// setup local repository & push to remote

async function run() {
  try {
    await github.authenticate();
    const url = await repo.createRemoteRepo();
    await repo.createGitignore();
    await repo.setUpRepo(url);
  } catch (e) {
    switch (e.status) {
      case 401:
        console.log(
          chalk.red("Cannot login, please provide correct credentials")
        );
      case 422:
        console.log(chalk.red("A remote repository already exists"));

      default:
        console.log({ e });
    }
  }
}

run();
