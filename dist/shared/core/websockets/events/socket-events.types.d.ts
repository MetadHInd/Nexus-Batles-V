export declare enum SocketEventTypes {
    USER_MESSAGE = "USER_MESSAGE",
    USER_JOIN = "USER_JOIN",
    USER_LEAVE = "USER_LEAVE"
}
export interface UserMessagePayload {
    userId: string;
    message: string;
}
export declare enum SocketEventDirection {
    IN = "in",
    OUT = "out",
    BOTH = "both"
}
export interface UserJoinPayload {
    userId: string;
    username: string;
}
export interface UserLeavePayload {
    userId: string;
}
export interface SocketEventPayloadMap {
    [SocketEventTypes.USER_MESSAGE]: UserMessagePayload;
    [SocketEventTypes.USER_JOIN]: UserJoinPayload;
    [SocketEventTypes.USER_LEAVE]: UserLeavePayload;
}
