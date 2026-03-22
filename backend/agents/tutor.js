const { exec } = require('child_process');

class OpenClawTutor {
    explain(topic, user_level, user_query) {
        return new Promise((resolve) => {
            const prompt = `You are an Adaptive AI Tutor.\nTopic: ${topic}\nUser's Learning Level: ${user_level}\nUser's Query: ${user_query}\nProvide an explanation that adapts to the user's level.`;
            
            // Execute genuine openclaw daemon natively via CLI
            exec(`openclaw tell "${prompt.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
                if (error) {
                    console.error('OpenClaw exec error:', error);
                    resolve(`Error contacting OpenClaw Daemon: ${error.message}. Please ensure the daemon is onboarded.`);
                    return;
                }
                resolve(stdout.trim());
            });
        });
    }
}

module.exports = OpenClawTutor;
