export declare const getMainKeyboard: () => {
    keyboard: {
        text: string;
    }[][];
    resize_keyboard: boolean;
    persistent: boolean;
};
export declare const getWeeklyScheduleKeyboard: () => {
    inline_keyboard: {
        text: string;
        callback_data: string;
    }[][];
};
export declare const getMainMenuKeyboard: () => {
    inline_keyboard: {
        text: string;
        callback_data: string;
    }[][];
};
export declare const getHelpKeyboard: () => {
    inline_keyboard: {
        text: string;
        callback_data: string;
    }[][];
};
export declare const getPaymentStartKeyboard: () => {
    keyboard: {
        text: string;
    }[][];
    resize_keyboard: boolean;
    one_time_keyboard: boolean;
};
export declare const getPaymentConfirmKeyboard: () => {
    inline_keyboard: {
        text: string;
        callback_data: string;
    }[][];
};
export declare const removeKeyboard: () => {
    remove_keyboard: boolean;
};
