const { Telegraf, Markup } = require('telegraf');
const p2p = require('./bot.js');
var config = require('./config.json');

const bot = new Telegraf(config.Telegram.token);
if (config.Telegram.token === undefined) {
    throw new Error('BOT_TOKEN must be provided!')
}
bot.use(Telegraf.log())


bot.command('/start', async (ctx) => {
    return await ctx.reply('Привет! Это бот для поиска выгодных сделок', Markup
        .keyboard([
            ['Start', 'Stop'],
            ['help']
        ])
        .oneTime()
        .resize()
    )
})
bot.hears('Start', ctx => {
    p2p.start();
    ctx.telegram.sendMessage(Number(config.Telegram.chatId), "Bot is start");
} )
bot.hears('Stop', ctx => {p2p.stop()} )

let sendMessage = function(message) {
    bot.telegram.sendMessage( Number(config.Telegram.chatId), message);
}

bot.launch();
module.exports.sendMessage = sendMessage;
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))



