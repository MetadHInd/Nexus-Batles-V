export enum GenericErrorMessages {
  JWT_ENV_TOKEN_MISSING = 'JWT_SECRET is not defined in the environment variables',
  INVALID_OBJECT = 'Invalid object',
  INVALID_JWT_TOKEN = 'Invalid Authorization Token',
  INVALID_CRECENTIALS = 'Invalid Credentials',
  PASSWORD_REQUIRED_SIZE = 'Password must be at least {0} characters long',
  FORBIDDEN_ACCESS = "Forbidden: You don't have access",
  UNKNOWN_ERROR = 'Unknown error occurred',
}
