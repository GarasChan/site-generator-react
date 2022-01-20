import { Message, MessageAttachment, SMTPClient } from 'emailjs';

export interface EmailParams {
  to: string;
  subject: string;
  text?: string;
  attachment?: MessageAttachment[];
}

const client = new SMTPClient({
  user: process.env.EMAIL_ACCOUNT,
  password: process.env.EMAIL_PASSWORD,
  host: 'smtp.qq.com',
  ssl: true
});

export const sendEmail = async (params: EmailParams) => {
  const { to, subject, text, attachment } = params;
  try {
    const message = await client.sendAsync(
      new Message({
        from: `${process.env.EMAIL_USER} <${process.env.EMAIL_ACCOUNT}>`,
        to,
        subject,
        text,
        attachment
      })
    );
    return { success: true, message };
  } catch (error) {
    return { success: false, error };
  }
};
