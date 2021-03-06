const AWS = require('aws-sdk')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.sendgridAPIKey)

module.exports.handler = async (event, context, callback) => {
  try {
    await Promise.all(event.Records.map(async (message) => {
      const data = JSON.parse(message.body)

      // Send email
      const mail = {
        to: data.to,
        from: 'noreply@fakenews.co',
        subject: data.subject,
        html: data.html
      }

      sgMail.send(mail)
    }))

    console.log(`${event.Records.length} emails sent!`)
    callback(null, 'Queue processed successfully!')
  } catch (err) {
    // TODO: Save error cases to an SQS queue for post processing
    console.log('Error ->', err.message)
    callback(null, `Error -> ${err.message}`)
  }
}
