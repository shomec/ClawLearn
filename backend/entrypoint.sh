#!/bin/bash

# Start the OpenClaw Gateway (Headless Agent Orchestrator)
echo "Starting OpenClaw Gateway Server..."
openclaw gateway start --config agents.yaml > /dev/null 2>&1 &

# Start the Node.js Express server
echo "Starting Express backend..."
exec npm start
