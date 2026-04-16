export declare const MESSAGES: {
    WELCOME: string;
    HELP: string;
    PAYMENT_START: string;
    PAYMENT_CANCELLED: string;
    NO_ACTIVE_OPERATION: string;
    STUDENT_NOT_FOUND: (nick: string) => string;
    STUDENT_FOUND: (fullName: string, room: string) => string;
    PAYMENT_SENT: (nick: string, fullName: string, room: string, month: string) => string;
    ERROR: string;
    DUTIES_NOT_FOUND: string;
    SESSION_EXPIRED: string;
    SENDING: string;
    CANCELLED: string;
    PAYMENT_CANCELLED_FULL: string;
};
export declare const formatPaymentMessage: (nick: string, fullName: string, room: string, month: string, date: string) => string;
export declare const formatDutiesMessage: (title: string, duties: any) => string;
