# Navigo bot

A NavigoLearn project!

## How to get started?

Getting started is easy! Just follow the steps given...

### Step 1: Clone the repository

```bash
git clone https://github.com/NavigoLearn/navigolearn-bot.git
```

### Step 2: Install dependencies

```bash
cd navigolearn-bot
npm i
```

### Step 3: Create a config.json file

> [!NOTE]\
> You can use the `config.example.json` file as a template.

This step is very short, just rename `configexample.json` to `config.json` and include the necessary info. (refer to the info below)

#### Info on each config variable

- `token`: The Discord bot token. You can get this from the [Discord Developer Portal](https://discord.com/developers/applications).
- `clientId` - The Discord bot client ID. You can get this from the [Discord Developer Portal](https://discord.com/developers/applications) and is used to deploy commands.
- `activity` - A list of activites for the bot to show.
- `DebugLogging` - Whether to log debug messages to the console.
- `authusers`- A list of user IDs that are allowed to use special dev commands.
- `othernavigodevs` - A list of user IDs that are allowed to use a few special dev commands.
- `ghtoken` - A GitHub token used to access the GitHub API. You can get this from the [GitHub Developer Settings](https://github.com/settings/tokens).

### Step 4: Run the bot

> [!NOTE]\
> Remember to run `node deploy` beforehand to ensure all commands are deployed.

```bash
node index
```

## How to contribute?

Contributing is a very helpful thing if we forget something or mess something up!

Just submit a [pull request](https://github.com/NavigoLearn/DiscordBot/pulls) and we'll review it!

## How to report a bug?

> [!NOTE]\
> We do not currently have a bug format, so just report it as you see fit. (include as much info as possible)

If you wish to report a bug just open an issue, and we'll look into it!

## How to suggest a feature?

Well basically the same way you do for a bug, just open an issue and we'll look into it!
