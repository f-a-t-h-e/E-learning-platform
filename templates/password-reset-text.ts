export function passwordResetText({ username, otp }): string {
    return `
Hello ${username},

We received a request to reset your password on E-Learning Platform. Use the code below to reset your password:

Your reset code is: ${otp}

If you didn't request this, you can safely ignore this email.

Best regards,
E-Learning Platform Team
${new Date().getFullYear()}
`;
  }
  