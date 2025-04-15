import { NextResponse } from 'next/server';
import { createTransport } from 'nodemailer';

export async function GET() {
  const transporter = createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    logger: true,
    debug: true
  });

  try {
    await transporter.sendMail({
      from: `"Test Sender" <${process.env.EMAIL_FROM}>`,
      to: process.env.ADMIN_EMAIL,
      subject: 'SMTP Test Successful',
      text: 'Your email configuration is working!',
    });

    return NextResponse.json(
      { success: true, message: 'Test email sent' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        details: error.response || null 
      },
      { status: 500 }
    );
  }
}