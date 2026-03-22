const { exec } = require('child_process');

class OpenClawQuizAgent {
    generate(topic, difficulty) {
        return new Promise((resolve) => {
            const prompt = `Topic: "${topic}"\nDifficulty: "${difficulty}"`;
            
            exec(`npx openclaw agent --agent quiz-generator --message "${prompt.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
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
            const prompt = `Evaluate answers: ${JSON.stringify(answers)}`;
            exec(`npx openclaw agent --agent quiz-generator --message "${prompt.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
                if (error) {
                    resolve({ score: 0, feedback: "Evaluation failed.", weak_areas: [] });
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
