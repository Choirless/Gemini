#!/bin/bash
npm cache clean -f
npm install -g n
n 12.13.0
echo "Waiting for 5 seconds..."
sleep 5
npm i