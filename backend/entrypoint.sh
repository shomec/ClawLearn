#!/bin/bash

# Check if genuine OpenClaw configuration exists
if [ ! -f "$HOME/.openclaw/openclaw.json" ]; then
    echo "========================================================================="
    echo "GENUINE OPENCLAW REQUIRES ONBOARDING!"
    echo "Please run this command on your host terminal to initialize the daemon:"
    echo "docker exec -it clawlearn-backend npx openclaw onboard"
    echo "========================================================================="
else
    # Register the user agents automatically to bypass missing YAML ingestion
    echo "Initializing OpenClaw agent profiles from config..."
    npx openclaw agents add tutor-agent --workspace "$HOME/.openclaw/agents/tutor-agent" --model ollama/kimi-k2.5:cloud --non-interactive > /dev/null 2>&1 || true
    npx openclaw agents add quiz-generator --workspace "$HOME/.openclaw/agents/quiz-generator" --model ollama/kimi-k2.5:cloud --non-interactive > /dev/null 2>&1 || true

    # Start the OpenClaw Gateway (Headless Agent Orchestrator)
    echo "Starting OpenClaw Gateway Server..."
    npx openclaw gateway start > /dev/null 2>&1 &
fi

# Start the Node.js Express server
echo "Starting Express backend..."
exec npm start
