// monitoring/stats-guardian.js
// Monitors and calibrates engagement ratios to avoid statistical anomalies

class StatsGuardian {
    constructor() {
        this.targetRatios = {
            'music': { likeView: 0.12, commentView: 0.03, shareView: 0.01 },
            'gaming': { likeView: 0.09, commentView: 0.04, shareView: 0.005 },
            'education': { likeView: 0.08, commentView: 0.02, shareView: 0.002 },
            'entertainment': { likeView: 0.10, commentView: 0.02, shareView: 0.008 },
            'news': { likeView: 0.05, commentView: 0.01, shareView: 0.02 },
            'sports': { likeView: 0.07, commentView: 0.015, shareView: 0.01 },
            'technology': { likeView: 0.11, commentView: 0.03, shareView: 0.007 },
            'comedy': { likeView: 0.12, commentView: 0.025, shareView: 0.01 },
            'default': { likeView: 0.10, commentView: 0.02, shareView: 0.01 }
        };
        
        this.currentRatios = {};
        this.localStats = new Map();
        this.adjustments = new Map();
        this.monitoringInterval = null;
    }

    startMonitoring(globalStats) {
        console.log('[StatsGuardian] Starting ratio monitoring...');
        
        this.monitoringInterval = setInterval(() => {
            this.recalibrate(globalStats);
        }, 3600000); // Recalibrate hourly
    }

    updateLocalStats(phoneId, category, stats) {
        if (!this.localStats.has(phoneId)) {
            this.localStats.set(phoneId, {});
        }
        
        const phoneStats = this.localStats.get(phoneId);
        if (!phoneStats[category]) {
            phoneStats[category] = { views: 0, likes: 0, comments: 0, shares: 0 };
        }
        
        const catStats = phoneStats[category];
        catStats.views += stats.views || 0;
        catStats.likes += stats.likes || 0;
        catStats.comments += stats.comments || 0;
        catStats.shares += stats.shares || 0;
    }

    recalibrate(globalStats) {
        console.log('[StatsGuardian] Recalibrating engagement ratios...');
        
        // Aggregate stats by category
        const aggregated = {};
        
        for (const [phoneId, phoneStats] of this.localStats) {
            for (const [category, stats] of Object.entries(phoneStats)) {
                if (!aggregated[category]) {
                    aggregated[category] = { views: 0, likes: 0, comments: 0, shares: 0 };
                }
                aggregated[category].views += stats.views;
                aggregated[category].likes += stats.likes;
                aggregated[category].comments += stats.comments;
                aggregated[category].shares += stats.shares;
            }
        }
        
        // Calculate current ratios
        for (const [category, stats] of Object.entries(aggregated)) {
            if (stats.views === 0) continue;
            
            this.currentRatios[category] = {
                likeView: stats.likes / stats.views,
                commentView: stats.comments / stats.views,
                shareView: stats.shares / stats.views
            };
            
            const target = this.targetRatios[category] || this.targetRatios.default;
            const current = this.currentRatios[category];
            
            // Check if ratios are within acceptable range
            const likeDiff = Math.abs(current.likeView - target.likeView) / target.likeView;
            const commentDiff = Math.abs(current.commentView - target.commentView) / target.commentView;
            
            if (likeDiff > 0.3) {
                console.log(`[StatsGuardian] Like ratio for ${category} off by ${(likeDiff*100).toFixed(0)}%`);
                this.adjustments.set(`${category}_like`, current.likeView > target.likeView ? -0.1 : 0.1);
            }
            
            if (commentDiff > 0.4) {
                console.log(`[StatsGuardian] Comment ratio for ${category} off by ${(commentDiff*100).toFixed(0)}%`);
                this.adjustments.set(`${category}_comment`, current.commentView > target.commentView ? -0.05 : 0.05);
            }
        }
        
        // Reset local stats periodically
        if (Math.random() < 0.3) { // 30% chance to reset
            this.localStats.clear();
            console.log('[StatsGuardian] Reset local stats');
        }
    }

    getTargetRatios(category) {
        const target = this.targetRatios[category] || this.targetRatios.default;
        const adjustment = {
            like: this.adjustments.get(`${category}_like`) || 0,
            comment: this.adjustments.get(`${category}_comment`) || 0
        };
        
        return {
            likeView: Math.max(0.01, Math.min(0.2, target.likeView + adjustment.like)),
            commentView: Math.max(0.005, Math.min(0.1, target.commentView + adjustment.comment)),
            shareView: target.shareView
        };
    }

    getStats() {
        return {
            currentRatios: this.currentRatios,
            targetRatios: this.targetRatios,
            adjustments: Array.from(this.adjustments.entries())
        };
    }
}

module.exports = StatsGuardian;
