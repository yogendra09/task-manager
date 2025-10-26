const nodemailer = require('nodemailer');
const ErrorHandler = require('../utils/ErrorHandler');
const process = require('process');
exports.sendEmail = async (options, next) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST, 
      service: 'gmail',
      port: 587,
      secure: false, 
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: options.email,
      subject: options?.subject,
      text: options?.message,
      html: options?.html,
      attachments: options?.attachments ? options.attachments : [],
    };

    console.log('Mail options:', mailOptions);

    if (options.ccEmails) {
      mailOptions.cc = options.ccEmails;
    }

    const response = await transporter.sendMail(mailOptions);
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    return next(new ErrorHandler(error.message, 500));
  }
};
