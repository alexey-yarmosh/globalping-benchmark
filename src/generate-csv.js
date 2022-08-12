const fs = require('fs');
const path = require('path');

const COMMAND_FOLDERS = ['../reports/ping', '../reports/dns', '../reports/http', '../reports/mtr', '../reports/traceroute'];

function getRpsFolders(commandFolder) {
  const files = fs.readdirSync(commandFolder, { withFileTypes: true });
  const rpsFolders = files
    .filter(dirent => dirent.isDirectory())
    .map(dirent => path.join(commandFolder, dirent.name));
  return rpsFolders;
}

function getLinesPerRps(folder) {
  const files = fs.readdirSync(folder);
  const lines = files.map(file => getLines(folder, file));
  return lines;
}

function getLines(folder, file) {
  const json = fs.readFileSync(path.join(folder, file), 'utf-8');
  const obj = JSON.parse(json);
  return [obj.rps, file.split('-')[0], obj.numberOfRequests, obj.successfullResponses, obj.time, obj.averageOneRequestTime, obj.longestOneRequestTime, obj.disconnects.length, obj.resultProblemsIds.length].join(',');
}

COMMAND_FOLDERS.forEach((commandFolder) => {
  const rpsFolders = getRpsFolders(commandFolder);
  const linesPerRps = rpsFolders.map(folder => getLinesPerRps(folder));
  const results = ['rps,cores,total requests,total responses,time,average one request time,max one request time,number of disconnects,response problems', ...linesPerRps.flat()];
  fs.writeFileSync(path.join(commandFolder, 'result.csv'), results.join('\n'));
});
