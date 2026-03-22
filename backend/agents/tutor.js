const { exec } = require('child_process');

class OpenClawTutor {
    explain(topic, user_level, user_query) {
        return new Promise((resolve) => {
            const prompt = `System: You are an Adaptive Personal AI Tutor. Break down complex topics simply.\n\nTopic: ${topic}\nLearning Level: ${user_level}\nQuery: ${user_query}`;
            
            // Execute locally installed openclaw natively via CLI
            exec(`npx openclaw agent --agent tutor-agent --message "${prompt.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
                if (error) {
                    console.error('OpenClaw exec error:', error);
                    resolve(`Error contacting local OpenClaw Gateway: ${error.message}. Please ensure the daemon is onboarded.`);
                    return;
                }
                resolve(stdout.trim());
            });
        });
    }
}

module.exports = OpenClawTutor;
