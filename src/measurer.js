const parser = require('./parser');
const config = require('./config');

class Measurer {
  constructor(command, RPS) {
    this.socket = null;
    this.responses = {};
    this.numberOfFinishedRequests = 0;
    this.rps = RPS;
    this.command = command;
    this.numberOfRequests = config.DURATION * this.rps;
    this.startTime = null;
    this.disconnects = [];
    this.timeout = null;
  }

  start(socket) {
    if (!this.socket) {
      this.socket = socket;
      this.runMeasurement();
    }
  }

  runMeasurement() {
    this.startTime = performance.now();
    this.runBatch(1);
  }

  runBatch(batchNumber) {
    console.log('RUNNING BATCH', batchNumber);
    const delay = 1000 / this.rps;
    for (let i = 1; i <= this.rps; i++) {
      const measurementId = `${batchNumber}-${i}`;
      this.responses[measurementId] = {
        progress: [],
        startTime: performance.now(),
        time: null
      };
      setTimeout(() => this.socket.emit('probe:measurement:request', {
        id: measurementId,
        measurement: config.MEASUREMENT[this.command]
      }), delay * i);
    }
    if (batchNumber < config.DURATION) {
      setTimeout(() => this.runBatch(batchNumber + 1), 1000);
    }
  }

  saveProgress(data) {
    const { measurementId, result } = data;
    this.responses[measurementId].progress.push(result);
  }

  saveResult(data) {
    const { measurementId, result } = data;
    this.responses[measurementId].result = result;
    const endTime = performance.now();
    const time = (endTime - this.responses[measurementId].startTime) / 1000;
    const roundedTime = Math.round(time * 100) / 100;
    this.responses[measurementId].time = roundedTime;
    console.log('SAVE RESULT', ++this.numberOfFinishedRequests);
    if (this.numberOfFinishedRequests === this.numberOfRequests) {
      this.end();
    }
    this.resetTimeout();
  }

  resetTimeout() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      console.log('TIMEOUT');
      this.end();
    }, config.NO_RESPONSE_TIMEOUT);
  }

  saveDisconnect(reason) {
    this.disconnects.push(reason);
  }

  end() {
    console.log('MEASUREMENT END, ANALYZING');
    const timeDiff = (performance.now() - this.startTime) / 1000;
    parser.analyzeData({
      duration: config.DURATION,
      rps: this.rps,
      numberOfRequests: this.numberOfRequests,
      numberOfFinishedRequests: this.numberOfFinishedRequests,
      time: Math.round(timeDiff * 100) / 100,
      disconnects: this.disconnects,
      responses: this.responses
    });
  }
}

module.exports = Measurer;
