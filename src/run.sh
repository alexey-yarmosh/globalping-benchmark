#!/usr/bin/env bash

set -e

docker stop globalping-probe-benchmark || true
docker rm globalping-probe-benchmark || true

echo 'START'

command='';
declare -a rps=();

mkdir -p ../reports/dns
mkdir -p ../reports/http
mkdir -p ../reports/mtr
mkdir -p ../reports/ping
mkdir -p ../reports/traceroute

##################################################################

command='dns';
rps=('30' '50' '70' '90');

for rps in "${rps[@]}"
  do
    mkdir -p ../reports/$command/$rps-rps
    
    echo "command: $command, RPS: $rps, cores: 1"
    docker run -d --name globalping-probe-benchmark --cpuset-cpus=0 globalping-probe-benchmark
    node server.js $command $rps
    docker stop globalping-probe-benchmark
    docker rm globalping-probe-benchmark
    mv ./result.json ../reports/$command/$rps-rps/1-core.json
    
    echo "command: $command, RPS: $rps, cores: 2"
    docker run -d --name globalping-probe-benchmark --cpuset-cpus=0-1 globalping-probe-benchmark
    node server.js $command $rps
    docker stop globalping-probe-benchmark
    docker rm globalping-probe-benchmark
    mv ./result.json ../reports/$command/$rps-rps/2-cores.json
    
    echo "command: $command, RPS: $rps, cores: 3"
    docker run -d --name globalping-probe-benchmark --cpuset-cpus=0-2 globalping-probe-benchmark
    node server.js $command $rps
    docker stop globalping-probe-benchmark
    docker rm globalping-probe-benchmark
    mv ./result.json ../reports/$command/$rps-rps/3-cores.json
    
    echo "command: $command, RPS: $rps, cores: 4"
    docker run -d --name globalping-probe-benchmark --cpuset-cpus=0-3 globalping-probe-benchmark
    node server.js $command $rps
    docker stop globalping-probe-benchmark
    docker rm globalping-probe-benchmark
    mv ./result.json ../reports/$command/$rps-rps/4-cores.json
  done

echo "Generating csvs"
node generate-csv.js

##################################################################

command='http';
rps=('300' '350' '400' '500');

for rps in "${rps[@]}"
  do
    mkdir -p ../reports/$command/$rps-rps
    
    echo "command: $command, RPS: $rps, cores: 1"
    docker run -d --name globalping-probe-benchmark --cpuset-cpus=0 globalping-probe-benchmark
    node server.js $command $rps
    docker stop globalping-probe-benchmark
    docker rm globalping-probe-benchmark
    mv ./result.json ../reports/$command/$rps-rps/1-core.json
    
    echo "command: $command, RPS: $rps, cores: 2"
    docker run -d --name globalping-probe-benchmark --cpuset-cpus=0-1 globalping-probe-benchmark
    node server.js $command $rps
    docker stop globalping-probe-benchmark
    docker rm globalping-probe-benchmark
    mv ./result.json ../reports/$command/$rps-rps/2-cores.json
    
    echo "command: $command, RPS: $rps, cores: 3"
    docker run -d --name globalping-probe-benchmark --cpuset-cpus=0-2 globalping-probe-benchmark
    node server.js $command $rps
    docker stop globalping-probe-benchmark
    docker rm globalping-probe-benchmark
    mv ./result.json ../reports/$command/$rps-rps/3-cores.json
    
    echo "command: $command, RPS: $rps, cores: 4"
    docker run -d --name globalping-probe-benchmark --cpuset-cpus=0-3 globalping-probe-benchmark
    node server.js $command $rps
    docker stop globalping-probe-benchmark
    docker rm globalping-probe-benchmark
    mv ./result.json ../reports/$command/$rps-rps/4-cores.json
  done

echo "Generating csvs"
node generate-csv.js

##################################################################

command='mtr';
rps=('15' '20' '25' '30');

for rps in "${rps[@]}"
  do
    mkdir -p ../reports/$command/$rps-rps
    
    echo "command: $command, RPS: $rps, cores: 1"
    docker run -d --name globalping-probe-benchmark --cpuset-cpus=0 globalping-probe-benchmark
    node server.js $command $rps
    docker stop globalping-probe-benchmark
    docker rm globalping-probe-benchmark
    mv ./result.json ../reports/$command/$rps-rps/1-core.json
    
    echo "command: $command, RPS: $rps, cores: 2"
    docker run -d --name globalping-probe-benchmark --cpuset-cpus=0-1 globalping-probe-benchmark
    node server.js $command $rps
    docker stop globalping-probe-benchmark
    docker rm globalping-probe-benchmark
    mv ./result.json ../reports/$command/$rps-rps/2-cores.json
    
    echo "command: $command, RPS: $rps, cores: 3"
    docker run -d --name globalping-probe-benchmark --cpuset-cpus=0-2 globalping-probe-benchmark
    node server.js $command $rps
    docker stop globalping-probe-benchmark
    docker rm globalping-probe-benchmark
    mv ./result.json ../reports/$command/$rps-rps/3-cores.json
    
    echo "command: $command, RPS: $rps, cores: 4"
    docker run -d --name globalping-probe-benchmark --cpuset-cpus=0-3 globalping-probe-benchmark
    node server.js $command $rps
    docker stop globalping-probe-benchmark
    docker rm globalping-probe-benchmark
    mv ./result.json ../reports/$command/$rps-rps/4-cores.json
  done

echo "Generating csvs"
node generate-csv.js

##################################################################

command='ping';
rps=('30' '40' '50' '60');

for rps in "${rps[@]}"
  do
    mkdir -p ../reports/$command/$rps-rps
    
    echo "command: $command, RPS: $rps, cores: 1"
    docker run -d --name globalping-probe-benchmark --cpuset-cpus=0 globalping-probe-benchmark
    node server.js $command $rps
    docker stop globalping-probe-benchmark
    docker rm globalping-probe-benchmark
    mv ./result.json ../reports/$command/$rps-rps/1-core.json
    
    echo "command: $command, RPS: $rps, cores: 2"
    docker run -d --name globalping-probe-benchmark --cpuset-cpus=0-1 globalping-probe-benchmark
    node server.js $command $rps
    docker stop globalping-probe-benchmark
    docker rm globalping-probe-benchmark
    mv ./result.json ../reports/$command/$rps-rps/2-cores.json
    
    echo "command: $command, RPS: $rps, cores: 3"
    docker run -d --name globalping-probe-benchmark --cpuset-cpus=0-2 globalping-probe-benchmark
    node server.js $command $rps
    docker stop globalping-probe-benchmark
    docker rm globalping-probe-benchmark
    mv ./result.json ../reports/$command/$rps-rps/3-cores.json
    
    echo "command: $command, RPS: $rps, cores: 4"
    docker run -d --name globalping-probe-benchmark --cpuset-cpus=0-3 globalping-probe-benchmark
    node server.js $command $rps
    docker stop globalping-probe-benchmark
    docker rm globalping-probe-benchmark
    mv ./result.json ../reports/$command/$rps-rps/4-cores.json
  done

echo "Generating csvs"
node generate-csv.js

##################################################################

command='traceroute';
rps=('40' '50' '60' '70');

for rps in "${rps[@]}"
  do
    mkdir -p ../reports/$command/$rps-rps
    
    echo "command: $command, RPS: $rps, cores: 1"
    docker run -d --name globalping-probe-benchmark --cpuset-cpus=0 globalping-probe-benchmark
    node server.js $command $rps
    docker stop globalping-probe-benchmark
    docker rm globalping-probe-benchmark
    mv ./result.json ../reports/$command/$rps-rps/1-core.json
    
    echo "command: $command, RPS: $rps, cores: 2"
    docker run -d --name globalping-probe-benchmark --cpuset-cpus=0-1 globalping-probe-benchmark
    node server.js $command $rps
    docker stop globalping-probe-benchmark
    docker rm globalping-probe-benchmark
    mv ./result.json ../reports/$command/$rps-rps/2-cores.json
    
    echo "command: $command, RPS: $rps, cores: 3"
    docker run -d --name globalping-probe-benchmark --cpuset-cpus=0-2 globalping-probe-benchmark
    node server.js $command $rps
    docker stop globalping-probe-benchmark
    docker rm globalping-probe-benchmark
    mv ./result.json ../reports/$command/$rps-rps/3-cores.json
    
    echo "command: $command, RPS: $rps, cores: 4"
    docker run -d --name globalping-probe-benchmark --cpuset-cpus=0-3 globalping-probe-benchmark
    node server.js $command $rps
    docker stop globalping-probe-benchmark
    docker rm globalping-probe-benchmark
    mv ./result.json ../reports/$command/$rps-rps/4-cores.json
  done

echo "Generating csvs"
node generate-csv.js

##################################################################

echo 'END'
