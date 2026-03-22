#!/bin/bash

# Check if genuine OpenClaw configuration exists
if [ ! -f "$HOME/.openclaw/openclaw.json" ]; then
    echo "========================================================================="
    echo "GENUINE OPENCLAW REQUIRES ONBOARDING!"
    echo "Please run this command on your host terminal to initialize the daemon:"
    echo "docker exec -it clawlearn-backend npx openclaw onboard"
    echo "========================================================================="
else
    # Start the OpenClaw Gateway (Headless Agent Orchestrator)
    echo "Starting OpenClaw Gateway Server..."
    npx openclaw gateway start --config agents.yaml > /dev/null 2>&1 &
fi

# Start the Node.js Express server
echo "Starting Express backend..."
exec npm start
