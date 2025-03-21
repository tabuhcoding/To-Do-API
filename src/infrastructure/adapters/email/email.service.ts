
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { TaskDto } from 'src/shared/dto/task.dto';

@Injectable()
export class EmailService implements OnModuleInit {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT', 587),
      secure: false, // true for 465, false for 587
      auth: {
        user: this.configService.get<string>('EMAIL_USERNAME'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendTaskReminder(tasks: TaskDto[], email: string): Promise<void> {
    if (tasks.length === 0) return;
  
    const appName = "TODO LIST";
    const recipientEmail = email;
  
    const taskListHtml = tasks
      .map(
        (task) => `
      <tr>
        <td style="border-bottom: 1px solid #eaeaea; padding: 12px 8px; text-align: left;">${task.title}</td>
        <td style="border-bottom: 1px solid #eaeaea; padding: 12px 8px; text-align: center;">${new Date(task.dueDate).toLocaleDateString()}</td>
        <td style="border-bottom: 1px solid #eaeaea; padding: 12px 8px; text-align: center;">
          <span style="display: inline-block; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500; 
          background-color: #fff8e1; color: #ff8f00;}">
            ${task.status}
          </span>
        </td>
      </tr>
    `,
      )
      .join('');
  
    const emailHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #333333; margin: 0; font-size: 24px;">${appName}</h1>
          <p style="color: #666666; margin: 5px 0 0;">Task Reminder</p>
        </div>
        
        <div style="background-color: #f9f9f9; border-radius: 6px; padding: 15px; margin-bottom: 20px;">
          <p style="margin: 0; color: #555555; font-size: 16px;">Hello,</p>
          <p style="margin: 10px 0 0; color: #555555;">The following tasks ${tasks.length > 1 ? 'are' : 'is'} either due soon or overdue and ${tasks.length > 1 ? 'require' : 'requires'} your attention:</p>
        </div>
        
        <table style="border-collapse: collapse; width: 100%; margin: 20px 0; border-radius: 6px; overflow: hidden;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 12px 8px; text-align: left; border-bottom: 2px solid #dddddd; color: #333333;">Task</th>
              <th style="padding: 12px 8px; text-align: center; border-bottom: 2px solid #dddddd; color: #333333;">Due Date</th>
              <th style="padding: 12px 8px; text-align: center; border-bottom: 2px solid #dddddd; color: #333333;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${taskListHtml}
          </tbody>
        </table>
        
        <div style="background-color: #f9f9f9; border-radius: 6px; padding: 15px; margin-top: 20px;">
          <p style="margin: 0; color: #555555;">Please complete these tasks before their deadlines.</p>
          <p style="margin: 15px 0 0; color: #555555;">You can view and manage your tasks by logging into your account.</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee;">
          <p style="margin: 0; color: #888888; font-size: 14px;">Best regards,</p>
          <p style="margin: 5px 0 0; color: #888888; font-size: 14px; font-weight: 600;">${appName} Team</p>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
          <p style="margin: 0; color: #aaaaaa; font-size: 12px;">© ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
        </div>
      </div>
    `;
  
    try {
      const info = await this.transporter.sendMail({
        from: `"${appName}" <${this.configService.get<string>('EMAIL_FROM', 'hello@todo.studio')}>`,
        to: recipientEmail,
        subject: `🔔 Task Reminder: ${tasks.length} ${tasks.length > 1 ? 'tasks need' : 'task needs'} your attention`,
        html: emailHtml,
      });
  
    } catch (error) {
      console.error(error);
    }
  }
  

  async sendPasswordResetConfirmation(email: string): Promise<void> {
    const appName = "TODOLIST";
    
    await this.transporter.sendMail({
      from: `"${appName}" <${this.configService.get<string>('EMAIL_FROM', 'hello@evebox.studio')}>`,
      to: email,
      subject: `${appName} - Password Reset Successful`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Successful</h2>
          <p>Your password has been successfully reset.</p>
          <p>If you did not perform this action, please contact our support team immediately.</p>
          <p>Best regards,<br>${appName} Team</p>
        </div>
      `,
    });
  }
}

