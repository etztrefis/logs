require("dotenv").config({ path: "../../.env" });
const chalk = require("chalk");
const Sequelize = require("sequelize");
const { QueryTypes } = require("sequelize");
const axios = require("axios").default;
const Twitch = require("dank-twitch-irc");
const { ChatClient } = require("dank-twitch-irc");

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USERNAME,
  process.env.PASSWORD,
  {
    host: process.env.SERVERNAME,
    dialect: "mysql",
    logging: false,
  },
);

const client = new ChatClient({
  username: process.env.NICKNAME,
  password: process.env.TOKEN,
  rateLimits: "default",
});

client.on("ready", () =>
  console.log(chalk.green("Twitch client is ready to connect.")),
);
client.on("close", (error) => {
  console.error(chalk.red(`Twitch client was closed | ${error}`));
});

client.on("error", (error) => {
  if (error instanceof Twitch.LoginError) {
    console.error(
      chalk.yellow(`"[LOGIN]" || Error logging in to Twitch: ${error}`),
    );
  }
  if (error instanceof Twitch.JoinError) {
    console.error(
      chalk.yellow(
        `"[JOIN]" || Error joining channel ${error.failedChannelName}: ${error}`,
      ),
    );
  }
  if (error instanceof Twitch.SayError) {
    console.error(
      chalk.yellow(
        `"[SAY]" || Error sending message in ${error.failedChannelName}: ${error.cause} | ${error}`,
      ),
    );
  }
  console.error(chalk.yellow(`"[ERROR]" || Error occurred in DTI: ${error}`));
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log(chalk.cyan("Connection has been established successfully."));
  } catch (error) {
    console.error(chalk.red("Unable to connect to the database: ", error));
  }
})();

const channels = [process.env.DEFAULTCHANNEL];
(async () => {
  await sequelize
    .query("SELECT ChannelID FROM TwitchLogs.Channels WHERE Availiable = 1 AND Name != 'trefis'")
    .then(async (data) => {
      data[0].forEach(async (channel) => {
        const { data } = await axios({
          method: "get",
          url: `https://api.twitch.tv/helix/users?id=${channel.ChannelID}`,
          responseType: "json",
          headers: {
            "Client-Id": process.env.CLIENTID,
            Authorization: process.env.BEARER,
          },
        });
        const channelName = data.data[0]["login"];
        channels.push(channelName);
      });
      setTimeout(() => {
        client
          .joinAll(channels)
          .catch((error) => {
            console.error(chalk.red("Timed out while connecting: ", error));
          })
          .then(() => {
            console.log(
              chalk.magenta("Successfully connected to the twitch servers."),
            );
          })
          .then(() => {
            console.log(chalk.blue("Success.. 👌"));
          });
          client.connect();
      }, 1000);
    })
    .catch((error) => {
      console.error(
        chalk.red(`Error while selecting a list of channels: ${error}`),
      );
    });
})();

const prefix = process.env.PREFIX;
const main = process.env.MAIN;
const admins = process.env.ADMINS.split(" ");

client.on("PRIVMSG", async (message) => {
  console.log(message);
  await sequelize.query(
    `INSERT INTO 
     TwitchLogs.${message.channelID} (SenderID, Name, Message, Emotes, Color, Badges)
     VALUES (?, ?, ?, ?, ?, ?)`,
    {
      replacements: [
        message.senderUserID,
        message.displayName,
        message.messageText,
        message.emotes.length === 0 ? null : JSON.stringify(message.emotes),
        message.colorRaw,
        message.badges.length === 0 ? null : JSON.stringify(message.badges),
      ],
      type: QueryTypes.INSERT,
    },
  );

  if (message.messageText.charAt(0) === prefix) {
    const args = message.messageText.substring(1).split(" ");
    if (args[0] === main) {
      if (admins.includes(message.senderUsername)) {
        switch (args[1]) {
          case "join": {
            if (!args[2]) {
              client.say(
                message.channelName,
                `@${message.displayName}, You did not specify the name of the channel`,
              );
            } else {
              let channels = args[2].includes(",")
                ? args[2].split(",").toLowerCase()
                : [args[2].toLowerCase()];
              channels.map(async (channel) => {
                const { data } = await axios({
                  method: "get",
                  url: `https://api.twitch.tv/helix/users?login=${channel}`,
                  responseType: "json",
                  headers: {
                    "Client-Id": process.env.CLIENTID,
                    Authorization: process.env.BEARER,
                  },
                });
                if (data.data[0] !== null && data.data[0] !== undefined) {
                  const channelId = data.data[0]["id"];
                  await sequelize
                    .query(
                      `SELECT * FROM TwitchLogs.Channels WHERE ChannelID = ?`,
                      { replacements: [channelId], type: QueryTypes.SELECT },
                    )
                    .then(async (data) => {
                      if (data.length == 0) {
                        await sequelize
                          .query(
                            `INSERT INTO TwitchLogs.Channels (ChannelID, Name) VALUES (?, ?)`,
                            {
                              replacements: [channelId, channel],
                              type: QueryTypes.INSERT,
                            },
                          )
                          .then(async () => {
                            await sequelize
                              .query(
                                `CREATE TABLE \`${channelId}\` (
                                \`ID\` INT(11) NOT NULL AUTO_INCREMENT,
                                \`SenderID\` VARCHAR(10) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
                                \`Name\` VARCHAR(30) NOT NULL DEFAULT 'No name provided' COLLATE 'utf8mb4_general_ci',
                                \`Message\` TEXT NULL DEFAULT 'No message provided' COLLATE 'utf8mb4_general_ci',
                                \`Emotes\` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
                                \`Color\` VARCHAR(7) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
                                \`Badges\` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
                                \`Timestamp\` TIMESTAMP NULL DEFAULT current_timestamp(),
                                PRIMARY KEY (\`ID\`) USING BTREE)
                              COMMENT='Logs from ${channel} channel.'
                              COLLATE='utf8mb4_general_ci'
                              ENGINE=InnoDB;`,
                                {
                                  type: QueryTypes.RAW,
                                },
                              )
                              .then(() => {
                                client.join(channel);
                                client.say(
                                  message.channelName,
                                  `@${message.displayName}, Successfully joined ${channel} Okayeg 👍`,
                                );
                              })
                              .catch((error) => {
                                console.error(
                                  chalk.red(
                                    `Error while creating table for the channel ${channel}: ${error}`,
                                  ),
                                );
                                client.say(
                                  message.channelName,
                                  `@${message.displayName}, Error while executing FeelsDankMan`,
                                );
                              });
                          })
                          .catch((error) => {
                            console.error(
                              chalk.red(
                                `Error while inserting channel with ID = ${channelId}: ${error}`,
                              ),
                            );
                            client.say(
                              message.channelName,
                              `@${message.displayName}, Error while executing FeelsDankMan`,
                            );
                          });
                      } else {
                        if (data[0].Availiable == 0) {
                          await sequelize
                            .query(
                              `UPDATE TwitchLogs.Channels SET Availiable = 1 WHERE ChannelID = ?`,
                              {
                                replacements: [channelId],
                                type: QueryTypes.UPDATE,
                              },
                            )
                            .then(() => {
                              client
                                .say(
                                  message.channelName,
                                  `@${message.displayName}, Successfully joined ${channel} (after leaving) Okayeg 👍`,
                                )
                                .catch((error) => {
                                  console.error(
                                    chalk.red(
                                      `Error while updating channel with ID = ${channelId}: ${error}`,
                                    ),
                                  );
                                  client.say(
                                    message.channelName,
                                    `@${message.displayName}, Error while executing FeelsDankMan`,
                                  );
                                });
                            });
                        } else {
                          client.say(
                            message.channelName,
                            `@${message.displayName}, Channel ${channel} is already in logs FeelsDankMan`,
                          );
                        }
                      }
                    })
                    .catch((error) => {
                      console.error(
                        chalk.red(
                          `Error while selecting channel with ID = ${channelId}: ${error}`,
                        ),
                      );
                      client.say(
                        message.channelName,
                        `@${message.displayName}, Error while executing FeelsDankMan`,
                      );
                    });
                } else
                  client.say(
                    message.channelName,
                    `@${message.displayName}, User: ${channel} does not exists`,
                  );
              });
            }
            break;
          }
          case "leave": {
            if (!args[2]) {
              client.say(
                message.channelName,
                `@${message.displayName}, You did not specify the name of the channel`,
              );
            } else {
              let channels = args[2].includes(",")
                ? args[2].split(",")
                : [args[2]];
              channels.map(async (channel) => {
                const { data } = await axios({
                  method: "get",
                  url: `https://api.twitch.tv/helix/users?login=${channel}`,
                  responseType: "json",
                  headers: {
                    "Client-Id": process.env.CLIENTID,
                    Authorization: process.env.BEARER,
                  },
                });
                if (data.data !== null) {
                  const channelId = data.data[0]["id"];
                  await sequelize
                    .query(
                      `SELECT * FROM TwitchLogs.Channels WHERE ChannelID = ?`,
                      { replacements: [channelId], type: QueryTypes.SELECT },
                    )
                    .then(async (data) => {
                      if (data.toString() !== ",") {
                        await sequelize
                          .query(
                            `UPDATE TwitchLogs.Channels SET Availiable = 0 WHERE ChannelID = ?`,
                            {
                              replacements: [channelId],
                              type: QueryTypes.UPDATE,
                            },
                          )
                          .then(() => {
                            client.part(channel);
                            client.say(
                              message.channelName,
                              `@${message.displayName}, Successfully parted from ${channel} Okayeg 👍`,
                            );
                          })
                          .catch((error) => {
                            console.error(
                              chalk.red(
                                `Error while creating table for the channel ${channel}: ${error}`,
                              ),
                            );
                            client.say(
                              message.channelName,
                              `@${message.displayName}, Error while executing FeelsDankMan`,
                            );
                          });
                      } else {
                        client.say(
                          message.channelName,
                          `@${message.displayName}, Specified channel does not exists in the datatbase FeelsDankMan`,
                        );
                      }
                    });
                } else
                  client.say(
                    message.channelName,
                    `@${message.displayName}, User: ${channel} does not exists`,
                  );
              });
            }
          }
        }
      } else {
        client.say(
          message.channelName,
          `@${message.displayName}, So you call these things "chips"? Instead of crispity crunchy munchie crackerjack snackernibbler snap crack n pop westpool chestershire queens lovely jubily delights? Thats rather a bit cringe, innit bruv.`,
        );
      }
    }
  }
});
