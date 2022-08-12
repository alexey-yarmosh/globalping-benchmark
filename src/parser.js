const fs = require('fs');

class Parser {
  constructor() { }

  analyzeData(data) {
    const { duration, rps, numberOfRequests, numberOfFinishedRequests, time, disconnects, responses } = data;
    const result = {
      duration,
      rps,
      time,
      numberOfRequests,
      successfullResponses: numberOfFinishedRequests,
      averageOneRequestTime: null,
      longestOneRequestTime: null,
      disconnects,
      progressProblemsIds: [],
      resultProblemsIds: [],
      progressItems: {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0
      },
      sampleResponse: {},
      problemsRaw: {}
    };

    for (let id in responses) {
      const response = responses[id];

      if (!response.progress || response.progress.some(progress => progress.rawOutput.length === 0)) {
        result.progressProblemsIds.push(id);
        result.problemsRaw[id] = response;
      }
      result.progressItems[response.progress.length] ? result.progressItems[response.progress.length]++ : result.progressItems[response.progress.length] = 1;

      if (response.time && response.result.rawOutput.length === 0) {
        result.resultProblemsIds.push(id);
        result.problemsRaw[id] = response;
      }
    }

    const validTimes = Object.values(responses)
      .map(({ time }) => time)
      .filter(time => time !== null);
    result.averageOneRequestTime = Math.round(validTimes.reduce((sum, time) => sum + time, 0) / validTimes.length * 100) / 100;
    result.longestOneRequestTime = validTimes.reduce((max, time) => Math.max(max, time), -Infinity);

    result.sampleResponse = responses['1-1'];

    fs.writeFileSync('./result.json', JSON.stringify(result, null, 2));
    console.log('FILE SAVED');
    process.exit(0);
  }
}

module.exports = new Parser();
