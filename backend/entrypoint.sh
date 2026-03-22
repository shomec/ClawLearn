#!/bin/bash

# Check if genuine OpenClaw configuration exists
if [ ! -f "$HOME/.openclaw/openclaw.json" ]; then
    echo "========================================================================="
    echo "GENUINE OPENCLAW REQUIRES ONBOARDING!"
    echo "Please run this command on your host terminal to initialize the daemon:"
    echo "docker exec -it clawlearn-backend npx openclaw onboard"
    echo "========================================================================="
else
    echo "Initializing OpenClaw agent profiles from config..."
    
    # Register agents into OpenClaw Router state natively
    npx openclaw agents add tutor-agent --workspace "$HOME/.openclaw/agents/tutor-agent" --model ollama/kimi-k2.5:cloud --non-interactive > /dev/null 2>&1 || true
    npx openclaw agents add quiz-generator --workspace "$HOME/.openclaw/agents/quiz-generator" --model ollama/kimi-k2.5:cloud --non-interactive > /dev/null 2>&1 || true

    # Push configuration into exact agent state directory for Gateway Engine
    mkdir -p "$HOME/.openclaw/agents/tutor-agent/agent"
    cat <<EOF > "$HOME/.openclaw/agents/tutor-agent/agent/agent.yaml"
system_prompt: "You are an Adaptive Personal AI Tutor. Break down complex topics simply."
provider: "ollama"
model: "kimi-k2.5:cloud"
tools:
  - "web_search"
EOF

    mkdir -p "$HOME/.openclaw/agents/quiz-generator/agent"
    cat <<EOF > "$HOME/.openclaw/agents/quiz-generator/agent/agent.yaml"
system_prompt: "Generate formatted JSON quizzes containing exactly 3 multi-choice questions."
provider: "ollama"
model: "kimi-k2.5:cloud"
tools:
  - "web_search"
EOF

    # Start the OpenClaw Gateway (Headless Agent Orchestrator) in foreground backgrounded
    echo "Starting OpenClaw Gateway Server..."
    npx openclaw gateway run > /dev/null 2>&1 &
fi

# Start the Node.js Express server
echo "Starting Express backend..."
exec npm start
