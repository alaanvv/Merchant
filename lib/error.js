const handleErr = err => {
  if (/An invalid token was provided/.test(err.stack)) console.log('Invalid bot token')

  else console.log(err)
}

process
  .on('uncaughtException', handleErr)
  .on('uncaughtExceptionMonitor', handleErr)
  .on('unhandledRejection', handleErr)