const Hapi = require('hapi');
const Good = require('good');
const Inert = require('inert');

class RESTServer {
    constructor(host, port) {
        this.host = null;
        this.port = null;
        this.server = null;

        if ( host && port ) {
            this.create(host, port);
        }
    }

    create(host, port) {
        this.server = new Hapi.Server();
        this.server.connection({
            host: host,
            port: port,
            routes: {
                cors: {
                    origin: ['*']
                }
            }
        });
        this.host = host;
        this.port = port;
    }

    routes(routes) {
        if ( this.server ) {
            this.server.route(routes);
        }
    }

    start(cb) {
        if ( this.server ) {
            this.server.register([
                Inert,
                {
                    register: Good,
                    options: {
                        reporters: {
                            console: [{
                                module: 'good-squeeze',
                                name: 'Squeeze',
                                args: [{
                                    response: '*',
                                    log: '*'
                                }]
                            }, {
                                module: 'good-console'
                            }, 'stdout']
                        }
                    }
                }
            ], (err) => {
                if ( !err ) {
                    this.server.start((err) => {
                        if ( !err ) {
                            console.log('REST server up and running');
                            this.printRESTRoutes(this.server);
                        } else {
                            console.error(err);
                        }
                        if ( cb ) {
                            cb(err);
                        }
                    });
                } else {
                    throw err; // something bad happened loading the plugins
                }
            });
        }
    }

    printRESTRoutes(server) {
        var table = server.connections[0].table();
        console.log('Rest endpoints:');

        //sort them for better visibility of the rest paths
        var restRoutesArray = [];

        table.forEach(function (r) {
            restRoutesArray.push("\t" + r.method.toUpperCase() + "\t" + r.path);
        });

        restRoutesArray.sort();

        restRoutesArray.forEach(function (r) {
            console.log(r);
        });
    }
}

module.exports = RESTServer;