const { render } = require('@pintora/cli')

process.on('message', m => {
  try {
    const opts = JSON.parse(m)
    render(opts)
      .then(result => {
        if (result instanceof Buffer) process.send({ result: { data: result.toString('base64'), encoding: 'base64'}, success: true })
        else if (typeof result === 'string') process.send({ result: { data: result, encoding: 'utf8'}, success: true })
        else {
          const error = new Error('Unexpected result type' + result)
          console.error(error)
          process.send({ result: { data: error.stack }, success: false })
        }
      }, result => {
        process.send({
          result: result.stack,
          success: false
        })
        process.exit(0)
      })
  } catch (error) {
    console.error(`CHILD: error happened: ${error}`)
    process.send({
      result: error.stack,
      success: false
    })
    process.exit(1)
  }
})
