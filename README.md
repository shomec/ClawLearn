# ClawLearn - Personal AI Tutor (Offline/Cloud Hybrid)

ClawLearn is a local-first AI tutor that adapts to how a student learns, explains concepts, generates quizzes, and tracks progress.
The entire app natively bridges a custom Node.js (Express) backend serving [OpenClaw](https://openclaw.ai/) agents to OpenWebUI for a fluid user experience.

## Tech Stack
- LLM: Ollama Cloud (`ollama/kimi-k2.5:cloud`)
- Agents: [OpenClaw](https://openclaw.ai/) Gateway (`openclaw gateway`) running locally along with defined `agents.yaml` tools.
- Backend: Node.js (Express) routing custom logic to [OpenClaw](https://openclaw.ai/) via `@openclaw/sdk`
- Storage: SQLite3 via `sqlite3` driver
- UI: OpenWebUI
## Architecture

![System Architecture Diagram](./architecture_diagram.svg)

## Quick Start
To set up and run ClawLearn on your machine, simply follow these steps:

1. **Start the Docker Containers**
   Initialize the system and securely pass your Ollama cloud API key by starting the Docker Compose stack:
   ```bash
   OLLAMA_API_KEY="your_api_key_here" docker compose up -d --build
   ```

3. **Access the Application**
   - **OpenWebUI**: Open [http://localhost:3000](http://localhost:3000) in your browser. *(Note: The OpenWebUI container can take 1-3 minutes to become fully available on the first boot as it initializes its database. If it is not working immediately, please wait a minute or run `docker compose logs -f openwebui` to check its progress.)*

## Usage Guide
OpenWebUI is directly hooked up to the Node.js Express backend API via standard OpenAI connections to seamlessly serve agents.
When you chat:
1. Select one of the injected ClawLearn models in the top-left corner of OpenWebUI:
   - **`claw-tutor-agent`**: Adapts dynamically as a Personal Tutor to simplify and explain concepts.
   - **`claw-quiz-generator`**: Provide a topic in your prompt, and it generates and formats a targeted quiz.
2. The UI natively talks to the Express service (`localhost:8000/v1/chat/completions`).
3. Behind the scenes, the Express.js server leverages the official **`@openclaw/sdk`** natively to contact the local API Gateway and seamlessly orchestrate your request across memory-enabled agents!