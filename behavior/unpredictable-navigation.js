// behavior/unpredictable-navigation.js
// Injects human-like errors and distractions into sessions

class UnpredictableNavigation {
    constructor(sessionRecorder) {
        this.sessionRecorder = sessionRecorder;
        this.errorPatterns = this.loadErrorPatterns();
        this.distractionProbability = 0.07; // 7% chance of distraction
    }

    loadErrorPatterns() {
        // Loaded from real session database
        return [
            {
                type: 'misclick',
                probability: 0.3,
                recovery: 'back_button',
                duration: 2000
            },
            {
                type: 'accidental_scroll',
                probability: 0.4,
                recovery: 'scroll_back',
                duration: 1500
            },
            {
                type: 'fat_finger',
                probability: 0.2,
                recovery: 'correct_typo',
                duration: 3000
            },
            {
                type: 'wrong_video',
                probability: 0.1,
                recovery: 'back_and_retry',
                duration: 5000
            }
        ];
    }

    injectMistakes(session) {
        const newActions = [];
        
        for (let i = 0; i < session.actions.length; i++) {
            const action = session.actions[i];
            newActions.push(action);
            
            // Chance to inject error after action
            if (Math.random() < this.errorProbability(action)) {
                const error = this.getRandomError();
                newActions.push({
                    type: 'error',
                    errorType: error.type,
                    duration: error.duration,
                    timestamp: action.timestamp + (action.duration || 0) + 100
                });
                
                // Add recovery action
                newActions.push({
                    type: 'recovery',
                    recoveryType: error.recovery,
                    duration: error.duration * 0.5,
                    timestamp: action.timestamp + (action.duration || 0) + 100 + error.duration
                });
            }
            
            // Chance for distraction
            if (Math.random() < this.distractionProbability) {
                const distraction = this.getRandomDistraction();
                newActions.push({
                    type: 'distraction',
                    distractionType: distraction.type,
                    duration: distraction.duration,
                    timestamp: action.timestamp + (action.duration || 0) + 200
                });
            }
        }
        
        return {
            ...session,
            actions: newActions
        };
    }

    errorProbability(action) {
        // Different actions have different error probabilities
        const probs = {
            'click': 0.05,
            'type': 0.08,
            'scroll': 0.03,
            'search': 0.04,
            'watch': 0.01
        };
        
        return probs[action.type] || 0.02;
    }

    getRandomError() {
        const rand = Math.random();
        let sum = 0;
        
        for (const error of this.errorPatterns) {
            sum += error.probability;
            if (rand < sum) return error;
        }
        
        return this.errorPatterns[0];
    }

    getRandomDistraction() {
        const distractions = [
            {
                type: 'check_notifications',
                duration: 5000 + Math.random() * 10000
            },
            {
                type: 'open_new_tab',
                duration: 3000 + Math.random() * 5000
            },
            {
                type: 'respond_to_message',
                duration: 10000 + Math.random() * 20000
            },
            {
                type: 'adjust_volume',
                duration: 2000 + Math.random() * 3000
            },
            {
                type: 'change_video_quality',
                duration: 4000 + Math.random() * 4000
            }
        ];
        
        return distractions[Math.floor(Math.random() * distractions.length)];
    }

    // Add random path deviations
    addPathDeviation(plannedPath) {
        const deviations = {
            'search->results->click': ['search->refine->search', 'search->scroll->click'],
            'home->video': ['home->trending->video', 'home->subscriptions->video'],
            'video->comments': ['video->related->comments', 'video->pause->comments']
        };
        
        if (Math.random() < 0.15 && deviations[plannedPath]) {
            const alternatives = deviations[plannedPath];
            return alternatives[Math.floor(Math.random() * alternatives.length)];
        }
        
        return plannedPath;
    }
}

module.exports = UnpredictableNavigation;
