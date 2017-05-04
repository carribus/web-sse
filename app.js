const config = require('./config.json');
const argv = require('optimist').argv;
const App = require('./js/server');

// Parse the command line into an object
// if new command line arguments are required, remember to read them into this object
config.cmdLine = (function(args) {
    return {
    };
})(argv);

const app = new App(config);
app.start();

