# Globalping benchmark

This tool runs 5 commands that `globalping-probe` can handle with different cores number and rps value. Parameters are stored in `src/config.js` and `src/run.sh`. Results for every test are stored in json files in `reports` folder, also there are csv files to accumulate the data.

## Run the tests

1. Edit `production.json` file in `globalping-probe` repo with:
```json
{
  "api": {
    "host": "ws://host.docker.internal:3000"
  }
}
```
2. Build `globalping-probe` docker image with the `globalping-probe-benchmark` tagname.
```
docker build -t globalping-probe-benchmark .
```
3. Clone and npm i `globalping-benchmark` repo
4. cd to `src` folder and run `bash run.sh`

## Results

Results can be reviewed under 'reports' folder or further at this page. There are folders for every command with json files for every rps. csv file is an accumulation of json data for every command.

### JSON files description

```json5
{
  "duration": 60, // ideal duration of the test, can be changed from config.js
  "rps": 30, // rps of the measurement
  "time": 61.75, // time required by probe to handle all requests or to exit by timeout
  "numberOfRequests": 1800, // total number of requests (duration * rps)
  "successfullResponses": 1800, // total number of 'probe:measurement:result' messages, if it is not equal to numberOfRequests then there were no 'probe:measurement:result' messages for NO_RESPONSE_TIMEOUT time.
  "averageOneRequestTime": 2.61, // average time from 'probe:measurement:request' to 'probe:measurement:result'
  "longestOneRequestTime": 3.94, // max time from 'probe:measurement:request' to 'probe:measurement:result'
  "disconnects": [], // reason messages if disconnects took place
  "progressProblemsIds": [], // ids where 'probe:measurement:progress' response was bad
  "resultProblemsIds": [], // ids where 'probe:measurement:result' response was bad
  "progressItems": { // distribution of 'probe:measurement:progress' items. Key is the number of progress messages, value is the number of requests with such number of progress messages
    "0": 0,
    "1": 1798, // E.g. there are 1798 requests with 1 'probe:measurement:progress' before 'probe:measurement:result'.
    "2": 2, // E.g. there are 2 requests with 2 'probe:measurement:progress' before 'probe:measurement:result'.
    "3": 0,
    "4": 0,
    "5": 0,
    "6": 0,
    "7": 0,
    "8": 0,
    "9": 0,
    "10": 0
  },
  "sampleResponse": { // sample response
    "progress": [], // array of data objects from 'probe:measurement:progress'
    "startTime": 4016.483757019043,
    "time": 0.13, // time from 'probe:measurement:request' to 'probe:measurement:result'
    "result": {} // data object from 'probe:measurement:result'
  },
  "problemsRaw": {} // keys here are ids from progressProblemsIds and resultProblemsIds, values are response objects
}
```

## Results

Results depends a lot from command, command parameters, connection speed, target host and socket.io pingInterval/pingTimeout. RPS values for every command where chosen manually.

If `Total requests` !== `Total responses` then probe didn't send all required resonses and test exited after `NO_RESPONSE_TIMEOUT` time.

`Number of disconnects` is a length of `disconnects` field from json and is a number of disconnects for any reason.

`Number of response problems` is a length of `resultProblemsIds` field from json and is a number of results with invalid data.

### dns command

|RPS|Cores|Total requests|Total responses|Time |Average one request time|Max one request time|Number of disconnects|Number of response problems|
|---|-----|--------------|---------------|-----|------------------------|--------------------|---------------------|-----------------|
|30 |1    |1800          |1800           |61.75|2.61                    |3.94                |0                    |0                |
|30 |2    |1800          |1800           |60.12|0.64                    |2.5                 |0                    |0                |
|30 |3    |1800          |1800           |60.15|0.58                    |1.09                |0                    |0                |
|30 |4    |1800          |1800           |60.15|0.59                    |1.64                |0                    |0                |
|50 |1    |3000          |821            |58.48|11.33                   |19.19               |1                    |0                |
|50 |2    |3000          |3000           |62.2 |1.58                    |5.24                |0                    |0                |
|50 |3    |3000          |3000           |60.59|0.66                    |1.88                |0                    |0                |
|50 |4    |3000          |3000           |60.12|0.63                    |2.09                |0                    |0                |
|70 |1    |4200          |507            |53.48|10.88                   |19.39               |1                    |0                |
|70 |2    |4200          |2149           |67.57|6.41                    |12.17               |1                    |0                |
|70 |3    |4200          |4200           |60.88|1.55                    |2.75                |0                    |0                |
|70 |4    |4200          |4200           |60.63|1.54                    |3.33                |0                    |0                |
|90 |1    |5400          |415            |46.83|9.53                    |13.77               |1                    |0                |
|90 |2    |5400          |1419           |54.62|8.16                    |14.36               |1                    |0                |
|90 |3    |5400          |3660           |82.11|10.07                   |19.74               |1                    |0                |
|90 |4    |5400          |3460           |82.55|8.72                    |16.86               |1                    |0                |

### ping command

|RPS|Cores|Total requests|Total responses|Time |Average one request time|Max one request time|Number of disconnects|Number of response problems|
|---|-----|--------------|---------------|------|------------------------|--------------------|---------------------|-----------------|
|30 |1    |1800          |1800           |79.02 |15.53                   |23.97               |0                    |0                |
|30 |2    |1800          |1800           |75.12 |12.21                   |16.62               |0                    |0                |
|30 |3    |1800          |1800           |75.01 |11.9                    |16.13               |0                    |0                |
|30 |4    |1800          |1800           |73.73 |11.84                   |16.07               |0                    |0                |
|40 |1    |2400          |1625           |93.89 |17.26                   |26.25               |1                    |0                |
|40 |2    |2400          |2400           |74.43 |13.56                   |17.64               |0                    |0                |
|40 |3    |2400          |2400           |75.18 |13.42                   |16.73               |0                    |0                |
|40 |4    |2400          |2400           |75.28 |13.34                   |17.12               |0                    |0                |
|50 |1    |3000          |1350           |83.26 |21.04                   |30.11               |1                    |0                |
|50 |2    |3000          |2461           |100.29|17.2                    |25.45               |1                    |0                |
|50 |3    |3000          |3000           |79.84 |17.5                    |25.2                |0                    |0                |
|50 |4    |3000          |3000           |81.38 |18.76                   |28.78               |0                    |0                |
|60 |1    |3600          |520            |64.24 |22.36                   |30.99               |1                    |0                |
|60 |2    |3600          |1704           |82.53 |19.48                   |25.65               |1                    |0                |
|60 |3    |3600          |2815           |105.36|26.33                   |42.95               |1                    |0                |
|60 |4    |3600          |3159           |117.87|25.57                   |41.46               |1                    |0                |

### mtr command

|RPS|Cores|Total requests|Total responses|Time |Average one request time|Max one request time|Number of disconnects|Number of response problems|
|---|-----|--------------|---------------|------|------------------------|--------------------|---------------------|-----------------|
|15 |1    |900           |900            |68.2  |8.39                    |11.18               |0                    |0                |
|15 |2    |900           |900            |64.93 |5.55                    |7                   |0                    |0                |
|15 |3    |900           |900            |64.92 |5.41                    |6.03                |0                    |0                |
|15 |4    |900           |900            |64.93 |5.4                     |5.98                |0                    |0                |
|20 |1    |1200          |563            |78.54 |14.35                   |20.15               |1                    |0                |
|20 |2    |1200          |1200           |65.07 |5.68                    |6.4                 |0                    |0                |
|20 |3    |1200          |1200           |65.02 |6.81                    |25.19               |0                    |0                |
|20 |4    |1200          |1200           |65.17 |5.62                    |6.87                |0                    |0                |
|25 |1    |1500          |395            |61.97 |15.12                   |21.08               |1                    |0                |
|25 |2    |1500          |1071           |98.92 |12.47                   |33.71               |1                    |0                |
|25 |3    |1500          |1500           |65.2  |5.88                    |6.72                |0                    |0                |
|25 |4    |1500          |1500           |65.19 |5.84                    |6.92                |0                    |0                |
|30 |1    |1800          |428            |68.88 |18.77                   |27.78               |1                    |0                |
|30 |2    |1800          |1556           |104.59|19.23                   |33.37               |1                    |0                |
|30 |3    |1800          |1800           |71.37 |11.57                   |16.7                |0                    |0                |
|30 |4    |1800          |1800           |70.14 |9.47                    |13.78               |0                    |0                |

### http command

|RPS|Cores|Total requests|Total responses|Time |Average one request time|Max one request time|Number of disconnects|Number of response problems|
|---|-----|--------------|---------------|------|------------------------|--------------------|---------------------|-----------------|
|300|1    |18000         |18000          |75.65 |19.93                   |34.12               |0                    |0                |
|300|2    |18000         |18000          |73.92 |14.24                   |23.14               |0                    |0                |
|300|3    |18000         |18000          |70.78 |10.95                   |12.63               |0                    |0                |
|300|4    |18000         |18000          |71.83 |12.23                   |16.04               |0                    |0                |
|350|1    |21000         |57             |40.49 |9.94                    |10.49               |0                    |0                |
|350|2    |21000         |2218           |47.43 |11.4                    |15.46               |0                    |0                |
|350|3    |21000         |1878           |47.09 |12.37                   |14.54               |0                    |0                |
|350|4    |21000         |2              |35.57 |4.37                    |5.57                |0                    |0                |
|400|1    |24000         |6914           |69.57 |29.07                   |34.75               |1                    |0                |
|400|2    |24000         |9358           |74.45 |29.77                   |37.82               |0                    |0                |
|400|3    |24000         |7566           |70.79 |29.67                   |36.21               |0                    |0                |
|400|4    |24000         |8820           |70.15 |27.27                   |35.52               |0                    |0                |
|500|1    |30000         |6187           |66.49 |29.03                   |32.34               |0                    |0                |
|500|2    |30000         |6118           |62.67 |25.29                   |29.1                |0                    |0                |
|500|3    |30000         |6108           |62.34 |25.08                   |29.37               |0                    |0                |
|500|4    |30000         |6917           |65.99 |27.45                   |31.16               |1                    |0                |

### traceroute command

|RPS|Cores|Total requests|Total responses|Time |Average one request time|Max one request time|Number of disconnects|Number of response problems|
|---|-----|--------------|---------------|------|------------------------|--------------------|---------------------|-----------------|
|40 |1    |2400          |1060           |70.62 |10.14                   |18.71               |1                    |0                |
|40 |2    |2400          |2400           |64.07 |4.57                    |14.54               |0                    |0                |
|40 |3    |2400          |2400           |70.97 |4.59                    |14.9                |0                    |0                |
|40 |4    |2400          |2400           |64.12 |4.73                    |14.78               |0                    |0                |
|50 |1    |3000          |873            |65.01 |10.97                   |18.21               |1                    |0                |
|50 |2    |3000          |3000           |64.11 |1.79                    |5.11                |0                    |0                |
|50 |3    |3000          |3000           |64.17 |4.57                    |5.29                |0                    |0                |
|50 |4    |3000          |3000           |64.19 |4.79                    |9.99                |0                    |0                |
|60 |1    |3600          |958            |60.3  |13.49                   |19.35               |1                    |0                |
|60 |2    |3600          |1187           |58.73 |8.78                    |12.75               |1                    |0                |
|60 |3    |3600          |3600           |68.77 |7.32                    |13.59               |0                    |0                |
|60 |4    |3600          |3600           |69.64 |8.28                    |14.87               |0                    |0                |
|70 |1    |4200          |754            |77.04 |18.79                   |27.82               |1                    |0                |
|70 |2    |4200          |1956           |75.17 |12.38                   |18.78               |1                    |0                |
|70 |3    |4200          |2200           |70.47 |9.58                    |15.11               |1                    |0                |
|70 |4    |4200          |2102           |72.21 |12.62                   |19.3                |1                    |0                |
