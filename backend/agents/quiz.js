const { OpenClawSDK } = require('@openclaw/sdk');
const oc = new OpenClawSDK(); // Defaults to local gateway

class OpenClawQuizAgent {
    async generate(topic, difficulty) {
        try {
            const prompt = `Topic: "${topic}"\nDifficulty: "${difficulty}"`;
            const result = await oc.agents.get('quiz-generator').message.send({ text: prompt });
            
            const content = result.text.trim();
            const start = content.indexOf('[');
            const end = content.lastIndexOf(']') + 1;
            const rawJson = start !== -1 ? content.slice(start, end) : '[]';
            return JSON.parse(rawJson);
        } catch (error) {
            console.error('Quiz Generator Error:', error);
            return [];
        }
    }

    async evaluate(questions, answers) {
        try {
            const prompt = `Evaluate answers: ${JSON.stringify(answers)}`;
            const result = await oc.agents.get('quiz-generator').message.send({ text: prompt });
            
            const content = result.text.trim();
            const start = content.indexOf('{');
            const end = content.lastIndexOf('}') + 1;
            const rawJson = start !== -1 ? content.slice(start, end) : '{}';
            return JSON.parse(rawJson);
        } catch (error) {
            console.error('Quiz Eval Error:', error);
            return { score: 0, feedback: "Evaluation failed.", weak_areas: [] };
        }
    }
}

module.exports = OpenClawQuizAgent;
