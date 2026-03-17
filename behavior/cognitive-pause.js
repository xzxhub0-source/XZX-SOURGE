// behavior/cognitive-pause.js
// Adds human-like cognitive delays based on video complexity

class CognitivePause {
    constructor() {
        this.complexityFactors = {
            'education': 1.5,
            'tutorial': 1.4,
            'news': 1.2,
            'documentary': 1.3,
            'gaming': 0.9,
            'music': 0.7,
            'entertainment': 0.8,
            'comedy': 0.7,
            'default': 1.0
        };
        
        this.actionFactors = {
            'decide_next': 5000,
            'click': 800,
            'scroll': 1200,
            'type': 300,
            'process_info': 2000,
            'watch': 0 // handled separately
        };
    }

    addPauses(session, category) {
        const pausedSession = {
            ...session,
            actions: []
        };
        
        let lastTimestamp = 0;
        
        for (const action of session.actions) {
            // Add cognitive pause before action
            const pause = this.getPause({ category, action: action.type }, action);
            
            pausedSession.actions.push({
                type: 'cognitive_pause',
                duration: pause,
                timestamp: lastTimestamp
            });
            
            lastTimestamp += pause;
            
            // Add the actual action with updated timestamp
            pausedSession.actions.push({
                ...action,
                timestamp: lastTimestamp
            });
            
            lastTimestamp += action.duration || 0;
        }
        
        return pausedSession;
    }

    getPause(context, action) {
        const basePause = this.getBasePause(context.action);
        const complexity = this.complexityFactors[context.category] || this.complexityFactors.default;
        
        // Add randomness
        const variance = 0.3;
        const randomFactor = 1 + (Math.random() * variance * 2 - variance);
        
        let pause = basePause * complexity * randomFactor;
        
        // Sometimes user gets distracted
        if (Math.random() < 0.05) {
            pause += 15000 + Math.random() * 30000; // 15-45 second distraction
        }
        
        // After watching, pause depends on video engagement
        if (context.action === 'watch') {
            const engagement = Math.random();
            if (engagement > 0.8) {
                pause += 2000; // Highly engaged, pause less
            } else {
                pause += 8000; // Less engaged, pause more
            }
        }
        
        return Math.round(pause);
    }

    getBasePause(actionType) {
        switch(actionType) {
            case 'decide_next':
                return 3000 + Math.random() * 4000;
            case 'click':
                return 500 + Math.random() * 600;
            case 'scroll':
                return 800 + Math.random() * 800;
            case 'type':
                return 200 + Math.random() * 200;
            case 'watch':
                return 0;
            default:
                return 1000 + Math.random() * 2000;
        }
    }

    // Get pause based on video complexity (for external use)
    getComplexityPause(videoMetadata) {
        const basePause = 2000;
        const complexity = this.complexityFactors[videoMetadata.category] || 1.0;
        const variance = 0.4;
        
        return Math.round(basePause * complexity * (1 + (Math.random() * variance * 2 - variance)));
    }
}

module.exports = CognitivePause;
