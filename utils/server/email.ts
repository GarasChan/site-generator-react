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
        to,
        subject,
        text: `${text} 请勿回复该邮件。`,
        from: `${process.env.EMAIL_USER} <${process.env.EMAIL_ACCOUNT}>`,
        attachment
      })
    );
    return { success: true, message };
  } catch (error) {
    return { success: false, error };
  }
};
