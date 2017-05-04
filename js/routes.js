module.exports = function(Handlers) {
    return [
        {
            method: 'GET',
            path: '/',
            handler: Handlers.serverIndex.bind(Handlers),
            config: {
                tags: ['api'],
                description: "Delivers the index page",
                cors: true
            }
        },
        {
            method: 'GET',
            path: '/events',
            handler: Handlers.allEvents.bind(Handlers),
            config: {
                tags: ['api'],
                description: "Deliver all events to the subscribers",
                cors: true
            }
        }
    ];
};
