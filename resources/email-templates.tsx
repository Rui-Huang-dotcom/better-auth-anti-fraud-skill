// resources/email-templates.tsx
// Professional React-style email templates for Better Auth.

import * as React from 'react';

interface EmailTemplateProps {
  url: string;
  userName?: string;
}

export const VerificationEmail = ({ url, userName }: EmailTemplateProps) => (
  <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #eee', borderRadius: '10px' }}>
    <h2 style={{ color: '#333' }}>Welcome to Vibe Auth!</h2>
    <p>Hi {userName || 'there'},</p>
    <p>Please verify your email address by clicking the button below:</p>
    <a href={url} style={{ display: 'inline-block', padding: '12px 24px', backgroundColor: '#000', color: '#fff', textDecoration: 'none', borderRadius: '6px', margin: '20px 0' }}>
      Verify Email
    </a>
    <p style={{ color: '#666', fontSize: '14px' }}>If you didn't create an account, you can safely ignore this email.</p>
  </div>
);

export const ResetPasswordEmail = ({ url }: EmailTemplateProps) => (
  <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #eee', borderRadius: '10px' }}>
    <h2 style={{ color: '#333' }}>Reset Your Password</h2>
    <p>We received a request to reset your password. Click the button below to proceed:</p>
    <a href={url} style={{ display: 'inline-block', padding: '12px 24px', backgroundColor: '#000', color: '#fff', textDecoration: 'none', borderRadius: '6px', margin: '20px 0' }}>
      Reset Password
    </a>
    <p style={{ color: '#666', fontSize: '14px' }}>This link will expire in 1 hour. If you didn't request this, please secure your account.</p>
  </div>
);
