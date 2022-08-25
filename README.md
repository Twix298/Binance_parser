# Binance_parser
Binance p2p parser with notification in telegram

## Tool Setup
### Setup configuration

Setup file `config.json`, then add your chat Id and API keys for notification in Telegram.
If you are interested in running a Telegram bot, more information can be found at [Telegram's official documentation](https://core.telegram.org/bots).

**The configuration file consists of the following fields:**
-   **chatId** -your chat id fot notification.
-   **token** - token created BotFather.
-   **transAmount** - count money of transaction.
-   **payTypes** - pay types of exchenge coins/money.
-   **difference** - difference between the buy price and the sell price.

## Getting Started

Script can only be run through terminal/command prompt

```shell
# clone this repository
$ git clone https://github.com/Twix298/Binance_parser.git

# go to directory
$ cd Binance_parser

# install dependencies
$ npm install

# run the script
$ npm start
```

