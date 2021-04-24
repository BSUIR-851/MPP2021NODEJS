
const app = require('./app.js');
const port = process.env.PORT || 5000;

const http = require('http');
const server = http.createServer();

const ws = require('ws');
const WSServer = ws.Server;
const wss = new WSServer({ server: server });

server.on('request', app);

wss.on('connection', (socket, req) => {
	console.log(req.socket.remoteAddress + ': connected');
	socket.on('message', (msg) => {
		console.log(req.socket.remoteAddress + ': ' + msg);
		wss.clients.forEach((client) => {
			if (client !== socket && client.readyState === ws.OPEN) {
				client.send(msg);
			}
		});
	});
});

server.listen(port, () => {
	console.log(`Server has been started on port: ${ port }`)
});

