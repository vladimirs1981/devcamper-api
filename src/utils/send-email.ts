import nodemailer from 'nodemailer';

type SendEmailOptions = {
	email: string;
	subject: string;
	message: string;
};

const sendEmail = async (options: SendEmailOptions) => {
	// create reusable transporter object using the default SMTP transport
	const transporter = nodemailer.createTransport({
		port: Number(process.env.SMTP_PORT),
		host: process.env.SMTP_HOST,

		auth: {
			user: process.env.SMTP_EMAIL,
			pass: process.env.SMTP_PASSWORD,
		},
	});

	// send mail with defined transport object
	let message = {
		from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
		to: options.email,
		subject: options.subject,
		text: options.message,
	};

	const info = await transporter.sendMail(message);

	console.log('Message sent: %s', info.messageId);
};

export default sendEmail;
