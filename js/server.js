const fs = require('fs');
const RESTServer = require('./restserver');
const ServiceHandlers = require('./handlers');
const Routes = require('./routes');

class Server {
    constructor(config) {
        this.config = config;
        this.servers = [];
        this.handlers = null;
    }

    start() {
        const _this = this;
        const completeServerInit = (servers) => {
            // handler in case we need to do any final-stage initialisation logic
            console.log('Completing server initialisations');
        };
        const createHttpServer = (endpoint, cb) => {
            let server;
            let Handlers = _this.handlers;
            let routes = Routes(Handlers);

            server = new RESTServer(endpoint.host, endpoint.port);
            server.routes(routes);
            _this.servers.push(server);

            server.start(cb);
        };

        _this.handlers = new ServiceHandlers();

        let endpointCount = _this.config.server.endpoints.length, endpointIndex = 0;

        const onServerStarted = (err) => {
            endpointIndex++;
            if (endpointIndex == endpointCount - 1) {
                // complete server init here
                completeServerInit(_this.servers);
            }
        };

        for (let endpoint of _this.config.server.endpoints) {
            console.log(endpoint);
            switch (endpoint.type) {
                case    'http':
                    createHttpServer(endpoint, onServerStarted);
                    break;

                default:
                    console.warn('Unknown server type: %s', endpoint.type);
                    break;
            }
        }
    }
}

module.exports = Server;