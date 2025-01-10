// email.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });
  }

  // Method to render the HTML template with dynamic data
  public renderTemplate(templateName: string, data: any): string {
    const filePath = path.resolve(
      __dirname,
      '../../src/email/templates/',
      `${templateName}.html`,
    );
    const templateSource = fs.readFileSync(filePath, 'utf-8');
    const template = handlebars.compile(templateSource);
    return template(data);
  }

  async sendMail(to: string, subject: string, html: string) {
    const mailOptions = {
      from: 'support@example.com',
      to,
      subject,
      // text,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
