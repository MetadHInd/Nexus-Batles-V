export interface PushConfig {
  APP_ID?: string;
  API_KEY?: string;
  PROVIDER: 'onesignal' | 'firebase';
  CHANNEL?: string;
}
