const { OpenClawSDK } = require('@openclaw/sdk');
const oc = new OpenClawSDK(); // Defaults to local gateway

class OpenClawTutor {
    async explain(topic, user_level, user_query) {
        try {
            const prompt = `Topic: ${topic}\nLearning Level: ${user_level}\nQuery: ${user_query}`;
            const result = await oc.agents.get('tutor-agent').message.send({ text: prompt });
            return result.text;
        } catch (error) {
            console.error('SDK Tutor Error:', error);
            return `Gateway Error: ${error.message}`;
        }
    }
}

module.exports = OpenClawTutor;
