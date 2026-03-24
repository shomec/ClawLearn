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
            // Count correct answers
            let correct = 0;
            questions.forEach((q, index) => {
                if (answers[index] === q.correct_answer) {
                    correct++;
                }
            });
            
            const total = questions.length;
            const percentage = total > 0 ? (correct / total) * 100 : 0;
            
            const prompt = `Grade this quiz with ${correct} correct out of ${total} (${percentage}%). Provide brief qualitative feedback and list weak areas based on the following questions and answers: ${JSON.stringify({questions, answers})}`;
            
            exec(`npx openclaw agent --agent quiz-generator --message "${prompt.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
                if (error) {
                    resolve({ score: correct, percentage, feedback: "Evaluation failed.", weak_areas: [] });
                    return;
                }
                const content = stdout.trim();
                const start = content.indexOf('{');
                const end = content.lastIndexOf('}') + 1;
                const rawJson = start !== -1 ? content.slice(start, end) : '{}';
                try {
                    const result = JSON.parse(rawJson);
                    resolve({
                        score: correct,
                        percentage: percentage,
                        feedback: result.feedback || "Good job!",
                        weak_areas: result.weak_areas || []
                    });
                } catch (e) {
                    resolve({ score: correct, percentage, feedback: "Evaluation failed.", weak_areas: [] });
                }
            });
        });
    }
}

module.exports = OpenClawQuizAgent;
