/**
 * Git repetitive tasks:
 * run git init
 * add the .gitignore file
 * add the remaining contents of the working directory
 * perform an initial commit
 * add the newly created remote repository
 * push the working directory up to the remote.
 */

/**
 * Repo.js
 * - setupRepo: accept url
 */

/**
 * github api
 *
 */
const github = require("./github");
const inquirer = require("./inquirer");
const git = require("simple-git/promise")();
const CLI = require("clui");
const Spinner = CLI.Spinner;
const fs = require("fs");
const _without = require("lodash.without");
const parseArgs = require("minimist");

const argv = parseArgs(process.argv.slice(2));

module.exports = {
  createRemoteRepo: async () => {
    const status = new Spinner("Creating Remote Repo...");
    try {
      const githubInstance = github.getInstance();

      const { name, description, visibility } = await inquirer.askRepoDetails();
      status.start();
      const data = {
        name,
        description,
        private: visibility === "private",
      };
      const res = await githubInstance.repos.createForAuthenticatedUser(data);
      console.log({ res });
      return res.data.ssh_url;
    } finally {
      status.stop();
    }
  },
  createGitignore: async () => {
    // get filelist except .git and .gitignore
    const filelist = _without(fs.readdirSync("."), ".git", ".gitignore");
    const { gitignore = "" } = await inquirer.askGitignore(
      filelist.map((file) => `/${file}`)
    );
    fs.writeFileSync(".gitignore", gitignore);
  },
  setUpRepo: async (url) => {
    const status = new Spinner("setup Repo...");
    try {
      status.start();
      git
        .init()
        .then(git.add(".gitignore"))
        .then(git.add("./*"))
        .then(git.commit("Initial commit"))
        .then(git.addRemote("origin", url))
        .then(git.push("origin", "master"));
    } finally {
      status.stop();
    }
  },
};
