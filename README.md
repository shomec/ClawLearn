# ClawLearn - Personal AI Tutor (Offline)

ClawLearn is a local-first AI tutor that adapts to how a student learns, explains concepts, generates quizzes, and tracks progress.
The entire app natively bridges a custom Node.js (Express) backend serving [OpenClaw](https://openclaw.ai/) agents to OpenWebUI for a fluid user experience.

## Tech Stack
- LLM: Ollama (`glm-4.7-flash`)
- Agents: [OpenClaw](https://openclaw.ai/) Daemon (`openclaw daemon`) running locally via Node
- Backend: Node.js (Express) routing custom logic to [OpenClaw](https://openclaw.ai/) via child processes
- Storage: SQLite3 via `sqlite3` driver
- UI: OpenWebUI
## Architecture

![System Architecture Diagram](./architecture_diagram.svg)

## Quick Start
To set up and run ClawLearn on your machine, simply follow these steps:

1. **Start the Docker Containers**
   Initialize the system by starting the Docker Compose stack:
   ```bash
   docker compose up -d --build
   ```

2. **Onboard the [OpenClaw](https://openclaw.ai/) Daemon**
   The background Node.js daemon requires an interactive setup wizard to initialize its memory system. Run this once:
   ```bash
   docker exec -it clawlearn-backend openclaw onboard
   ```
   *(Follow the prompts on your screen! [OpenClaw](https://openclaw.ai/) will **automatically download the `glm-4.7-flash` model**, but you must select **Local** as the Ollama mode. When asked for the Ollama URL, you MUST explicitly specify `http://ollama:11434` instead of the local 127.0.0.1 default so it can resolve through the container proxy network!)*

3. **Access the Application**
   - **OpenWebUI**: Open [http://localhost:3000](http://localhost:3000) in your browser. *(Note: The OpenWebUI container can take 1-3 minutes to become fully available on the first boot as it initializes its database. If it is not working immediately, please wait a minute or run `docker compose logs -f openwebui` to check its progress.)*

## Usage Guide
OpenWebUI is directly hooked up to the Node.js Express backend API via standard OpenAI connections to seamlessly serve agents.
When you chat:
1. Select one of the injected ClawLearn models in the top-left corner of OpenWebUI:
   - **`claw-tutor-agent`**: Adapts dynamically as a Personal Tutor to simplify and explain concepts.
   - **`claw-quiz-generator`**: Provide a topic in your prompt, and it generates and formats a targeted quiz.
2. The UI natively talks to the Express service (`localhost:8000/v1/chat/completions`).
3. Behind the scenes, the Express.js server invokes the **[OpenClaw](https://openclaw.ai/) Agent Daemon** bundled inside the backend container via native Node `child_process.exec` hooks to execute and orchestrate your request natively on the standard [OpenClaw](https://openclaw.ai/) interface!