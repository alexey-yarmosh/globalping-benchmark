module.exports = {
  DURATION: 60,
  NO_RESPONSE_TIMEOUT: 0.5 * 60 * 1000,
  MEASUREMENT: {
    ping: {
      type: 'ping',
      target: 'google.com',
    },
    dns: {
      type: 'dns',
      target: 'google.com',
      query: {}
    },
    traceroute: {
      type: 'traceroute',
      target: 'google.com',
      protocol: 'TCP',
      port: 443
    },
    mtr: {
      type: 'mtr',
      target: 'google.com',
      protocol: 'TCP',
      port: 443
    },
    http: {
      type: 'http',
      target: 'www.google.com',
      port: 443,
      request: {
        method: 'GET',
        host: 'www.google.com'
      }
    }
  }
}
