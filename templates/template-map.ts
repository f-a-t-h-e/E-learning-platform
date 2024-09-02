import { emailVerificationText } from './email-verification-text';
import { passwordResetText } from './password-reset-text';

export const templatesMap = {
  'email-verification': {
    templateFile: 'email-verification',
    textVersion: emailVerificationText,
  },
  'password-reset': {
    templateFile: 'password-reset',
    textVersion: passwordResetText,
  },
} as const;