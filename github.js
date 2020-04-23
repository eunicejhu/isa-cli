const inquirer = require("./inquirer");
const { createBasicAuth } = require("@octokit/auth");
const { Octokit } = require("@octokit/rest");
const Configstore = require("configstore");
const packageJson = require("./package.json");
const CLI = require("clui");

const Spinner = CLI.Spinner;

const conf = new Configstore(packageJson.name);

let octokit;

const getStoredGithubToken = () => conf.get("github.token");
const getPersonalGithubToken = async () => {
  const status = new Spinner("Authenticating you, please wait...");
  try {
    const { username, password } = await inquirer.askGithubCredentials();

    status.start();
    const auth = createBasicAuth({
      username,
      password,
      async on2Fa() {
        status.stop();
        const { code } = await inquirer.getTwoFactorAuthenticationCode();
        status.start();
        return code;
      },
      token: {
        scopes: ["user", "public_repo", "repo", "repo:status"],
        note: "ginit, the command-line tool for initalizing Git repos",
      },
    });
    const res = await auth();
    if (res.token) {
      conf.set("github.token", res.token);
      return res.token;
    } else {
      throw new Error("GitHub token was not found in the response");
    }
  } catch (e) {
    console.error(e);
  } finally {
    status.stop();
  }
};

module.exports = {
  authenticate: async () => {
    let token;
    token = getStoredGithubToken();
    if (!token) {
      token = await getPersonalGithubToken();
    }
    console.log("token -----: ", token);
    octokit = new Octokit({ auth: token });
  },
  getInstance: () => {
    return octokit;
  },
  clear: () => conf.clear(),
  getStoredGithubToken,
  getPersonalGithubToken,
};
