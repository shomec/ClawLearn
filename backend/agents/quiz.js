const { exec } = require('child_process');

class OpenClawQuizAgent {
    generate(topic, difficulty) {
        return new Promise((resolve) => {
            const prompt = `Generate a short quiz (3 questions) about "${topic}" at a "${difficulty}" level. Output MUST be valid JSON format representing a list of objects: [{"question": "...", "options": ["...", "..."], "correct": "...", "type": "mcq"}]`;
            
            exec(`openclaw tell "${prompt.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
                if (error) {
                    console.error('Quiz Generator Error:', error);
                    resolve([]);
                    return;
                }
                const content = stdout.trim();
                const start = content.indexOf('[');
                const end = content.lastIndexOf(']') + 1;
                const rawJson = start !== -1 ? content.slice(start, end) : '[]';
                try {
                    resolve(JSON.parse(rawJson));
                } catch (e) {
                    resolve([]);
                }
            });
        });
    }

    evaluate(questions, answers) {
        return new Promise((resolve) => {
            const prompt = `Evaluate these quiz answers. Output MUST be valid JSON: {"score": 80, "feedback": "...", "weak_areas": ["..."]}.`;
            exec(`openclaw tell "${prompt.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
                if (error) {
                    resolve({ score: 0, feedback: "Evaluation failed via OpenClaw Daemon.", weak_areas: [] });
                    return;
                }
                const content = stdout.trim();
                const start = content.indexOf('{');
                const end = content.lastIndexOf('}') + 1;
                const rawJson = start !== -1 ? content.slice(start, end) : '{}';
                try {
                    resolve(JSON.parse(rawJson));
                } catch (e) {
                    resolve({ score: 0, feedback: "Evaluation failed.", weak_areas: [] });
                }
            });
        });
    }
}

module.exports = OpenClawQuizAgent;
