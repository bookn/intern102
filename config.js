module.exports = {
  urlString: process.env.URL,
  urlDestString: process.env.DESTINATION_URL,
  cronMinute: process.env.CRON_MINUTE || 1,
  intervalMillisec: process.env.RETRY_INTERVAL || 3000,
  retryTimes: process.env.RETRY_TIMES || 5
}
