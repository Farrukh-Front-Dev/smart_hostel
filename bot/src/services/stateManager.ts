import { UserState, PaymentData } from '../types';

export class StateManager {
  private static states = new Map<number, UserState>();

  static get(userId: number): UserState | undefined {
    return this.states.get(userId);
  }

  static set(userId: number, state: UserState): void {
    this.states.set(userId, state);
  }

  static delete(userId: number): void {
    this.states.delete(userId);
  }

  static has(userId: number): boolean {
    return this.states.has(userId);
  }

  static updateData(userId: number, data: Partial<PaymentData>): void {
    const state = this.states.get(userId);
    if (state) {
      state.data = { ...state.data, ...data };
      this.states.set(userId, state);
    }
  }
}
