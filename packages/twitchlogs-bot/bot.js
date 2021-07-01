require("dotenv").config();
const chalk = require("chalk");
const Sequelize = require("sequelize");
const { ChatClient } = require("dank-twitch-irc");

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USER,
  process.env.PASS,
  {
    host: process.env.HOST,
    dialect: "mysql",
    operatorsAliases: 0,
    pool: {
      max: 15,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
);

const client = new ChatClient({
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  rateLimits: "default",
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log(chalk.cyan("Connection has been established successfully.👍"));
  } catch (error) {
    console.error(chalk.red("Unable to connect to the database: ", error));
  }
})();

client.on("ready", () =>
  console.log(chalk.green("Twitch client is ready. 👌")),
);
client.on("close", (error) => {
  console.error(chalk.red(`Twitch client was closed | ${error}`));
});

client.connect();
