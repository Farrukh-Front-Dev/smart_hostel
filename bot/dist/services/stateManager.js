"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateManager = void 0;
class StateManager {
    static get(userId) {
        return this.states.get(userId);
    }
    static set(userId, state) {
        this.states.set(userId, state);
    }
    static delete(userId) {
        this.states.delete(userId);
    }
    static has(userId) {
        return this.states.has(userId);
    }
    static updateData(userId, data) {
        const state = this.states.get(userId);
        if (state) {
            state.data = { ...state.data, ...data };
            this.states.set(userId, state);
        }
    }
}
exports.StateManager = StateManager;
StateManager.states = new Map();
//# sourceMappingURL=stateManager.js.map