import { Telegraf } from 'telegraf';
interface PaymentSubmission {
    studentId: number;
    amount: number;
    month: string;
    imageUrl: string;
    status: string;
    note: string;
}
export declare class PaymentService {
    static submitPayment(data: PaymentSubmission): Promise<void>;
    static sendToGroup(bot: Telegraf, nick: string, fullName: string, room: string, month: string, fileId: string, fileType: 'photo' | 'document'): Promise<void>;
}
export {};
