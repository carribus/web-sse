const config = require('../config.json');
const Stream = require('stream');
const Boom = require('boom');

class ServerEventHandlers {
    constructor() {
        this.stream = new Stream.PassThrough();
        this.eventId = 0;
    }

    serverIndex(req, reply) {
        reply.file(process.cwd() + "/public/index.html");
    }

    allEvents(req, reply) {
        console.log("allEvents endpoint hit:\nreq.params: %j\nreq.payload: %j", req.params, req.payload);

        reply(this.stream)
            .header('content-type', 'text/event-stream')
            .header('content-encoding', 'identity');

        setInterval(this.sendEvent.bind(this), 100);
    }

    sendEvent() {
        if ( this.eventId % 2 == 0 ) {
            this.stream.write("id: " + this.eventId++ + "\nevent: test\ndata: Test Data\n\n");
        } else {
            this.stream.write("id: " + this.eventId++ + "\ndata: nameless event data\n\n");
        }
    }
}

module.exports = ServerEventHandlers;