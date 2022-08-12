const { Server } = require('socket.io');
const { createServer } = require('http');
const Measurer = require('./measurer');

const httpServer = createServer();
const io = new Server(httpServer, {
	transports: ['websocket'],
	serveClient: false,
	pingInterval: 10_000,
	pingTimeout: 4000,
});

const command = process.argv[2];
const rps = parseInt(process.argv[3], 10);
const measurer = new Measurer(command, rps);

const errorHandler = (next) => async (socket, mwNext) => {
	try {
		await next(socket, mwNext);
	} catch (error) {
		console.error(error);
	}
};

io
	.of('/probes')
	.on('connect', errorHandler(async (socket) => {
		const probe = {
			"client": socket.id,
			"version": "0.9.1",
			"ipAddress": "::ffff:127.0.0.1",
			"location": {
				"continent": "EU",
				"region": "Western Europe",
				"normalizedRegion": "western europe",
				"country": "FR",
				"city": "Paris",
				"normalizedCity": "paris",
				"asn": 12876,
				"latitude": 48.8534,
				"longitude": 2.3488,
				"network": "ONLINE S.A.S.",
				"normalizedNetwork": "online s.a.s."
			},
			"index": [
				"eu",
				"western europe",
				"fr",
				"paris",
				"online s.a.s.",
				"as12876",
				"france",
				"fra"
			],
			"resolvers": [],
			"ready": true
		};
		socket.emit('api:connect:location', probe.location);
		console.log('CONNECTED', socket.id);

		socket.on('probe:status:ready', () => {
			console.log('READY');
			measurer.start(socket);
		});
		socket.on('probe:status:not_ready', () => console.log('NOT READY'));
		socket.on('probe:dns:update', () => console.log('DNS UPDATE'));
		socket.on('probe:measurement:ack', (data, ack) => {
			ack();
		});
		socket.on('probe:measurement:progress', (data) => {
			measurer.saveProgress(data);
		});
		socket.on('probe:measurement:result', (data) => {
			measurer.saveResult(data);
		});
		socket.on('disconnect', reason => {
			console.log(`PROBE DISCONNECT: ${reason}, socket.id: ${socket.id}`);
			measurer.saveDisconnect(reason);
		});
	}));

httpServer.listen(3000, () => console.log('Server started!'));
