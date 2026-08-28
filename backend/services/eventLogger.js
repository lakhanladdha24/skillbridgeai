/**
 * Event Telemetry Logger Service
 * Records structured user interaction events for feature store generation & ML training.
 */

const eventStore = []; // Memory buffer, backed by MongoDB when connected

export function logLearningEvent(userId, eventType, eventData = {}) {
    const event = {
        eventId: 'evt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        userId: userId || 'anonymous',
        eventType,
        eventData,
        timestamp: new Date().toISOString()
    };

    eventStore.push(event);

    // Keep memory store bounded (last 5000 events)
    if (eventStore.length > 5000) {
        eventStore.shift();
    }

    return event;
}

export function getUserEvents(userId) {
    return eventStore.filter(e => e.userId === userId || userId === 'all');
}
