#!/bin/bash

# Boot genuine OpenClaw Daemon if configured
if [ ! -f "$HOME/.openclaw/openclaw.json" ]; then
    echo "========================================================================="
    echo "GENUINE OPENCLAW REQUIRES ONBOARDING!"
    echo "Please run this command on your host terminal to initialize the daemon:"
    echo "docker exec -it clawlearn-backend openclaw onboard"
    echo "========================================================================="
    # Continue anyway so Node.js boots, but agent calls act on a dormant daemon
else
    echo "Starting Official OpenClaw Daemon..."
    openclaw daemon start > /dev/null 2>&1 &
fi

# Start the Node.js Express server
echo "Starting Express backend..."
exec npm start
