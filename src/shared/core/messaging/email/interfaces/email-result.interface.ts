export interface EmailResultSuccess {
  success: true;
  error: null;
  info: any;
}

export interface EmailResultFailure {
  success: false;
  error: any;
  info: null;
}

export type EmailResult = EmailResultSuccess | EmailResultFailure;
