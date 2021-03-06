require('dotenv').config();

const http = require("http");
const appInsights = require("applicationinsights");
appInsights.setup()
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true)
    .start();

// assign common properties to all telemetry sent from the default client
appInsights.client.commonProperties = {
    applicationName: process.env.APPLICATION_NAME,
    enviroment: process.env.NODE_ENV
};

// track a system startup event
appInsights.client.trackEvent("server start");

// create server
const port = process.env.port || 1337
const server = http.createServer(function (req, res) {
    // track all "GET" requests
	res.writeHead(200, { "Content-Type": "text/plain" });

    // test using trackEvent
    appInsights.client.trackEvent("TrackEvent - custom", { pid: process.id, 
        pname: process.env.APPLICATION_NAME,
        env: process.env.NODE_ENV });

    // test using trackTrace
    appInsights.client.trackTrace("TrackTrace - Test appInsights real tracking");

    if(req.method === "GET" || req.method === "POST") {
        // test using tarckRequest
        appInsights.client.trackRequest(req, res);
    }

    if(req.method === "GET") {
    	res.end("Hello World\n");
    }

    if(req.method === "POST") {
    	res.end("Received data ");
    	console.log(res);
    }

}).listen(port);

// track startup time of the server as a custom metric
const start = +new Date;
server.on("listening", () => {
    const end = +new Date;
    const duration = end - start;
    appInsights.client.trackMetric("StartupTime", duration);
    appInsights.client.trackEvent("Started On", new Date());
});
