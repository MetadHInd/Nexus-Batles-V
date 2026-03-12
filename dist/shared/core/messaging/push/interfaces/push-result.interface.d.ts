export interface PushResultSuccess {
    success: true;
    error: null;
    id: string;
    recipients?: number;
    details?: any;
}
export interface PushResultFailure {
    success: false;
    error: any;
    code?: string;
    id: null;
}
export type PushResult = PushResultSuccess | PushResultFailure;
