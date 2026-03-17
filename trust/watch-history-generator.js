// trust/watch-history-generator.js
// Generates realistic watch history for account warming

class WatchHistoryGenerator {
    constructor() {
        this.categories = [
            'music', 'gaming', 'education', 'entertainment',
            'news', 'sports', 'technology', 'comedy'
        ];
        
        this.channels = {
            'music': ['T-Series', 'Cocomelon', 'Blackpink', 'Justin Bieber', 'Ariana Grande'],
            'gaming': ['PewDiePie', 'Markiplier', 'Jacksepticeye', 'DanTDM'],
            'education': ['Khan Academy', 'CrashCourse', 'TED-Ed', 'Vsauce'],
            'entertainment': ['MrBeast', 'Dude Perfect', 'The Try Guys', 'Good Mythical Morning'],
            'news': ['CNN', 'BBC News', 'Sky News', 'Al Jazeera'],
            'sports': ['ESPN', 'Bleacher Report', 'NFL', 'NBA'],
            'technology': ['Marques Brownlee', 'Linus Tech Tips', 'Unbox Therapy'],
            'comedy': ['The Late Show', 'Jimmy Fallon', 'Jimmy Kimmel Live']
        };
    }

    generateHistory(days, videosPerDay = null) {
        const history = [];
        const now = Date.now();
        
        // If videosPerDay not specified, use realistic distribution
        if (!videosPerDay) {
            videosPerDay = this.generateDailyDistribution(days);
        }
        
        for (let day = 0; day < days; day++) {
            const dayStart = now - (days - day) * 24 * 60 * 60 * 1000;
            const videosToday = videosPerDay[day] || 2 + Math.floor(Math.random() * 4);
            
            for (let i = 0; i < videosToday; i++) {
                const category = this.categories[Math.floor(Math.random() * this.categories.length)];
                const channel = this.getRandomChannel(category);
                
                const hourOffset = this.generateHourOffset();
                const timestamp = dayStart + hourOffset * 60 * 60 * 1000;
                
                history.push({
                    videoId: this.generateVideoId(),
                    title: this.generateVideoTitle(category),
                    channel,
                    category,
                    timestamp,
                    duration: this.generateWatchDuration(category),
                    percentage: this.generateWatchPercentage(),
                    liked: Math.random() < 0.1,
                    commented: Math.random() < 0.02
                });
            }
        }
        
        // Sort by timestamp
        return history.sort((a, b) => a.timestamp - b.timestamp);
    }

    generateDailyDistribution(days) {
        const distribution = [];
        
        for (let day = 0; day < days; day++) {
            // Weekends have higher activity
            const dayOfWeek = (day + new Date().getDay()) % 7;
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            
            // Base: 2-6 videos per day
            let videos = 2 + Math.floor(Math.random() * 4);
            
            // Weekends: 30-50% more
            if (isWeekend) {
                videos = Math.floor(videos * (1.3 + Math.random() * 0.2));
            }
            
            distribution.push(videos);
        }
        
        return distribution;
    }

    generateHourOffset() {
        // Realistic hour distribution
        const hourWeights = {
            0: 0.02, 1: 0.01, 2: 0.005, 3: 0.005, 4: 0.01,
            5: 0.02, 6: 0.04, 7: 0.06, 8: 0.08, 9: 0.07,
            10: 0.06, 11: 0.05, 12: 0.06, 13: 0.06, 14: 0.05,
            15: 0.05, 16: 0.06, 17: 0.07, 18: 0.08, 19: 0.09,
            20: 0.1, 21: 0.1, 22: 0.08, 23: 0.04
        };
        
        const rand = Math.random();
        let sum = 0;
        
        for (let hour = 0; hour < 24; hour++) {
            sum += hourWeights[hour];
            if (rand < sum) return hour;
        }
        
        return 20; // Default to peak hour
    }

    generateWatchDuration(category) {
        const durations = {
            'music': 180 + Math.random() * 120, // 3-5 min
            'gaming': 600 + Math.random() * 600, // 10-20 min
            'education': 480 + Math.random() * 480, // 8-16 min
            'entertainment': 300 + Math.random() * 300, // 5-10 min
            'news': 240 + Math.random() * 240, // 4-8 min
            'sports': 360 + Math.random() * 360, // 6-12 min
            'technology': 480 + Math.random() * 480, // 8-16 min
            'comedy': 240 + Math.random() * 240 // 4-8 min
        };
        
        return Math.round(durations[category] || 300);
    }

    generateWatchPercentage() {
        // Distribution: 40% watch most, 30% watch half, 30% drop early
        const rand = Math.random();
        if (rand < 0.4) return 0.9 + Math.random() * 0.1; // 90-100%
        if (rand < 0.7) return 0.5 + Math.random() * 0.2; // 50-70%
        return 0.2 + Math.random() * 0.3; // 20-50%
    }

    getRandomChannel(category) {
        const channels = this.channels[category] || this.channels.entertainment;
        return channels[Math.floor(Math.random() * channels.length)];
    }

    generateVideoId() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
        let id = '';
        for (let i = 0; i < 11; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    generateVideoTitle(category) {
        const titles = {
            'music': ['Official Music Video', 'Live Performance', 'Music Audio'],
            'gaming': ['Gameplay Walkthrough', 'Let\'s Play', 'Live Stream'],
            'education': ['Tutorial', 'Lecture', 'Explanation'],
            'entertainment': ['Vlog', 'Challenge', 'Reaction'],
            'news': ['Breaking News', 'Update', 'Report'],
            'sports': ['Highlights', 'Full Game', 'Analysis'],
            'technology': ['Review', 'Unboxing', 'Comparison'],
            'comedy': ['Sketch', 'Stand-up', 'Parody']
        };
        
        const titleList = titles[category] || titles.entertainment;
        return titleList[Math.floor(Math.random() * titleList.length)];
    }
}

module.exports = WatchHistoryGenerator;
