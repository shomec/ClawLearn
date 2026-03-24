const express = require('express');
const cors = require('cors');
const db = require('./database');
const OpenClawTutor = require('./agents/tutor');
const OpenClawQuizAgent = require('./agents/quiz');
const { v4: uuidv4 } = require('uuid');
const { exec } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

const tutorAgent = new OpenClawTutor();
const quizAgent = new OpenClawQuizAgent();

const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID || 'YOUR_CHANNEL_ID';

app.get('/', (req, res) => {
    res.json({ message: "Welcome to ClawLearn Node.js API" });
});

// OpenAI Compatible Models Endpoint
app.get('/v1/models', (req, res) => {
    res.json({
        object: "list",
        data: [
            { id: "claw-tutor-agent", object: "model", owned_by: "clawlearn" },
            { id: "claw-quiz-generator", object: "model", owned_by: "clawlearn" }
        ]
    });
});

// OpenAI Compatible Chat Completions Endpoint
app.post('/v1/chat/completions', async (req, res) => {
    try {
        const { model, messages, stream } = req.body;
        if (!messages || messages.length === 0) {
            return res.status(400).json({ error: "No messages provided" });
        }
        
        const lastMessage = messages[messages.length - 1].content;
        let responseContent = "";
        
        if (model === "claw-tutor-agent") {
            responseContent = await tutorAgent.explain("General Topic", "Beginner", lastMessage);
        } else if (model === "claw-quiz-generator") {
            if (lastMessage.toLowerCase().includes("evaluate")) {
                const result = await quizAgent.evaluate([], {}); 
                
                // Use OpenClaw grade-evaluator agent with built-in Discord skill
                const evalPrompt = `Assign a grade for score ${result.score}/10 (${result.percentage}%) in topic "Sample Topic" and send the result to Discord channel ${DISCORD_CHANNEL_ID}.`;
                exec(`npx openclaw agent --agent grade-evaluator --message "${evalPrompt.replace(/"/g, '\\"')}"`, (err, stdout) => {
                    if (err) console.error('Discord Notification Error:', err);
                });

                responseContent = JSON.stringify(result, null, 2);
            } else {
                const quiz = await quizAgent.generate(lastMessage, "Beginner");
                responseContent = JSON.stringify(quiz, null, 2);
            }
        } else {
            responseContent = "Unknown model requested.";
        }

        if (stream) {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            const chunkId = `chatcmpl-${uuidv4()}`;
            const chunk = {
                id: chunkId,
                object: "chat.completion.chunk",
                created: Math.floor(Date.now() / 1000),
                model: model,
                choices: [{ delta: { content: responseContent }, index: 0, finish_reason: "stop" }]
            };

            res.write(`data: ${JSON.stringify(chunk)}\n\n`);
            res.write(`data: [DONE]\n\n`);
            res.end();
        } else {
            res.json({
                id: `chatcmpl-${uuidv4()}`,
                object: "chat.completion",
                created: Math.floor(Date.now() / 1000),
                model: model,
                choices: [{
                    index: 0,
                    message: { role: "assistant", content: responseContent },
                    finish_reason: "stop"
                }],
                usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
            });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

const PORT = 8000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express server running natively on port ${PORT}`);
});
