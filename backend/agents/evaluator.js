const { Client, GatewayIntentBits } = require('discord.js');
const { exec } = require('child_process');
const db = require('../database');

class GradeEvaluatorAgent {
    constructor(token, channelId) {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });
        this.token = token;
        this.channelId = channelId;
        this.isReady = false;

        this.client.once('ready', () => {
            console.log('Grade Evaluator Discord Bot is ready!');
            this.isReady = true;
        });

        this.client.on('messageCreate', async (message) => {
            if (message.author.bot) return;
            if (message.channelId !== this.channelId) return;

            // Handle user feedback/replies
            console.log(`Received feedback from ${message.author.username}: ${message.content}`);
            await this.handleFeedback(message);
        });
    }

    async start() {
        if (!this.token) {
            console.warn('Discord token missing. Evaluator agent started without Discord.');
            return;
        }
        try {
            await this.client.login(this.token);
        } catch (e) {
            console.error('Failed to login to Discord:', e.message);
        }
    }

    async evaluateAndNotify(userId, topic, score, percentage) {
        const grade = this.assignGrade(percentage);
        const msg = `User ID ${userId} completed the quiz on "${topic}". Score: ${score}/10 (${percentage}%). Assigned Grade: ${grade}.`;
        
        console.log(`Evaluating results: ${msg}`);
        
        if (this.isReady) {
            const channel = await this.client.channels.fetch(this.channelId);
            if (channel) {
                await channel.send(msg);
            }
        }

        // Store grade in DB if needed (optional based on user request "store the result for each user-topic-score combination")
        // The user already asked to store user-topic-score, which we do in quiz_results.
    }

    assignGrade(percentage) {
        if (percentage >= 90) return 'A';
        if (percentage >= 80) return 'B';
        if (percentage >= 70) return 'C';
        if (percentage >= 60) return 'D';
        if (percentage >= 50) return 'E';
        return 'F';
    }

    async handleFeedback(message) {
        const prompt = `User feedback on Discord: "${message.content}". Respond to this feedback appropriately.`;
        
        exec(`npx openclaw agent --agent grade-evaluator --message "${prompt.replace(/"/g, '\\"')}"`, async (error, stdout, stderr) => {
            if (error) {
                console.error('Grade Evaluator Error:', error);
                return;
            }
            const response = stdout.trim();
            await message.reply(response || "I have received your feedback. Thank you!");
        });
    }
}

module.exports = GradeEvaluatorAgent;
