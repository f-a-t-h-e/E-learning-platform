export function emailVerificationText({ username, otp }): string {
    return `
Hello ${username},

Thank you for registering with E-Learning Platform. Please verify your email address to complete the registration process.

Your verification code is: ${otp}

If you didn't request this email, please ignore it.

Best regards,
E-Learning Platform Team
${new Date().getFullYear()}
`;
  }