/**
 * @file core-events.js
 * @description Global Event Bus for cross-component communication. 
 * Allows isolated Shadow DOM components to publish and subscribe to global custom events 
 * without tight coupling.
 */

class EventBus {
    constructor() {
        /**
         * @type {Object.<string, Function[]>}
         * @private
         */
        this._listeners = {};
    }

    /**
     * Subscribe to an event
     * @param {string} eventName - The name of the event to subscribe to.
     * @param {Function} callback - The callback function to execute when the event is fired.
     */
    on(eventName, callback) {
        if (!this._listeners[eventName]) {
            this._listeners[eventName] = [];
        }
        this._listeners[eventName].push(callback);
    }

    /**
     * Unsubscribe from an event
     * @param {string} eventName - The name of the event.
     * @param {Function} callback - The specific callback to remove.
     */
    off(eventName, callback) {
        if (!this._listeners[eventName]) return;
        this._listeners[eventName] = this._listeners[eventName].filter(cb => cb !== callback);
    }

    /**
     * Publish an event
     * @param {string} eventName - The name of the event to publish.
     * @param {*} [data] - Optional payload to pass to the event subscribers.
     */
    emit(eventName, data) {
        if (!this._listeners[eventName]) return;
        this._listeners[eventName].forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`[EventBus] Error in callback for event "${eventName}":`, error);
            }
        });
    }
}

// Export a singleton instance
export const coreEvents = new EventBus();
