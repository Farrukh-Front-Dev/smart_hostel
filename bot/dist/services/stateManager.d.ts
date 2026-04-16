import { UserState, PaymentData } from '../types';
export declare class StateManager {
    private static states;
    static get(userId: number): UserState | undefined;
    static set(userId: number, state: UserState): void;
    static delete(userId: number): void;
    static has(userId: number): boolean;
    static updateData(userId: number, data: Partial<PaymentData>): void;
}
