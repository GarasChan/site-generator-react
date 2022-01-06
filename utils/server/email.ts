import { Message, SMTPClient } from 'emailjs';

export interface EmailParams {
  subject: string;
  text: string;
  to: string;
}

console.log({ EMAIL_USER: process.env.EMAIL_USER, EMAIL_PASSWORD: process.env.EMAIL_PASSWORD });

const client = new SMTPClient({
  user: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASSWORD,
  host: 'smtp.qq.com',
  ssl: true
});

export const sendEmail = async (params: EmailParams) => {
  const { subject, text, to } = params;
  try {
    const message = await client.sendAsync(
      new Message({
        subject,
        text,
        from: process.env.EMAIL_USER,
        to
      })
    );
    return { success: true, message };
  } catch (error) {
    return { success: false, error };
  }
};
