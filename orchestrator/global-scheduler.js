// orchestrator/global-scheduler.js
// Advanced scheduling with decoy traffic and asynchronous engagement

class GlobalScheduler {
    constructor(phoneFarm) {
        this.phoneFarm = phoneFarm;
        this.activeCampaigns = new Map();
        this.decoyQueue = [];
        this.trendingCache = new Map();
    }

    async scheduleTargetViews(surgeId, targetVideoId, totalViews, category, timeWindowHours) {
        const phones = this.phoneFarm.getReadyPhones();
        const viewsPerPhone = Math.ceil(totalViews / phones.length);
        const baseDelay = (timeWindowHours * 3600000) / totalViews;
        
        console.log(`[Scheduler] Distributing ${totalViews} views across ${phones.length} phones over ${timeWindowHours}h`);
        
        for (const phone of phones) {
            // Calculate random start offset (0 to timeWindowHours)
            const startOffset = Math.random() * timeWindowHours * 3600000;
            
            setTimeout(() => {
                this.executePhoneCampaign(phone, surgeId, targetVideoId, viewsPerPhone, category);
            }, startOffset);
        }
        
        this.activeCampaigns.set(surgeId, {
            targetVideoId,
            totalViews,
            category,
            startTime: Date.now(),
            timeWindow: timeWindowHours,
            phones: phones.length
        });
    }

    async executePhoneCampaign(phone, surgeId, targetVideoId, views, category) {
        console.log(`[Phone ${phone.id}] Starting campaign: ${views} views`);
        
        for (let i = 0; i < views; i++) {
            // Before each target view, perform 2-5 decoy actions
            await this.runDecoySession(phone, category);
            
            // Target view
            await this.executeTargetView(phone, targetVideoId, category);
            
            // Random interval between 30-90 minutes
            const interval = 1800000 + Math.random() * 3600000;
            await this.delay(interval);
        }
        
        console.log(`[Phone ${phone.id}] Campaign completed`);
    }

    async runDecoySession(phone, category) {
        // Get trending videos in this category (cached for 1 hour)
        let trending = this.trendingCache.get(category);
        if (!trending || Date.now() - trending.timestamp > 3600000) {
            trending = {
                videos: await this.fetchTrendingVideos(category, phone.region),
                timestamp: Date.now()
            };
            this.trendingCache.set(category, trending);
        }
        
        const numVideos = 2 + Math.floor(Math.random() * 4); // 2-5 videos
        
        for (let i = 0; i < numVideos; i++) {
            const video = trending.videos[i % trending.videos.length];
            
            // Watch decoy video
            await this.watchVideo(phone, video.id, this.getNaturalWatchTime(video));
            
            // 10-20% chance to engage
            if (Math.random() < 0.15) {
                await this.likeVideo(phone);
            }
            if (Math.random() < 0.05) {
                await this.commentOnVideo(phone, this.generateRandomComment());
            }
            
            await this.delay(2000 + Math.random() * 5000);
        }
    }

    async executeTargetView(phone, videoId, category) {
        // Get natural watch time based on video metadata
        const watchTime = this.getNaturalWatchTime({ category, duration: 300 });
        
        // Execute view
        await this.watchVideo(phone, videoId, watchTime);
        
        // Possibly engage based on category norms
        const engagementProb = this.getEngagementProbability(category);
        
        if (Math.random() < engagementProb.like) {
            await this.likeVideo(phone);
        }
        if (Math.random() < engagementProb.comment) {
            await this.commentOnVideo(phone, this.generateTargetedComment(videoId));
        }
    }

    async watchVideo(phone, videoId, duration) {
        // In production, actual app control
        console.log(`[Phone ${phone.id}] Watching ${videoId} for ${duration}s`);
        await this.delay(duration * 1000);
        return true;
    }

    async likeVideo(phone) {
        console.log(`[Phone ${phone.id}] Liking video`);
        await this.delay(500 + Math.random() * 500);
        return true;
    }

    async commentOnVideo(phone, comment) {
        console.log(`[Phone ${phone.id}] Commenting: ${comment.substring(0, 20)}...`);
        await this.delay(2000 + Math.random() * 2000);
        return true;
    }

    getNaturalWatchTime(videoMetadata) {
        // Real distribution from session database
        const baseTime = videoMetadata.duration || 300;
        
        // 40% watch almost full
        if (Math.random() < 0.4) {
            return baseTime * (0.9 + Math.random() * 0.1);
        }
        // 30% watch half
        if (Math.random() < 0.5) {
            return baseTime * (0.5 + Math.random() * 0.2);
        }
        // 30% drop early
        return baseTime * (0.2 + Math.random() * 0.3);
    }

    getEngagementProbability(category) {
        const probs = {
            'music': { like: 0.15, comment: 0.03 },
            'gaming': { like: 0.12, comment: 0.04 },
            'education': { like: 0.08, comment: 0.02 },
            'entertainment': { like: 0.10, comment: 0.02 },
            'default': { like: 0.10, comment: 0.02 }
        };
        return probs[category] || probs.default;
    }

    async fetchTrendingVideos(category, region) {
        // In production, fetch from YouTube API
        return [
            { id: 'trending1', title: 'Trending Video 1', category, duration: 240 },
            { id: 'trending2', title: 'Trending Video 2', category, duration: 360 },
            { id: 'trending3', title: 'Trending Video 3', category, duration: 180 },
            { id: 'trending4', title: 'Trending Video 4', category, duration: 420 },
            { id: 'trending5', title: 'Trending Video 5', category, duration: 300 }
        ];
    }

    generateRandomComment() {
        const comments = [
            'Nice video!',
            'Thanks for sharing',
            'Very cool content',
            'Subscribed!',
            'Keep it up'
        ];
        return comments[Math.floor(Math.random() * comments.length)];
    }

    generateTargetedComment(videoId) {
        const comments = [
            'Great video! Really helpful content',
            'This is exactly what I was looking for',
            'Amazing work, thanks for posting',
            'Learned a lot from this, subscribed!',
            'Quality content as always'
        ];
        return comments[Math.floor(Math.random() * comments.length)];
    }

    estimateCompletion(totalViews) {
        const avgViewsPerHour = 30; // Conservative estimate
        const hours = totalViews / avgViewsPerHour;
        return `${hours.toFixed(1)} hours`;
    }

    delay(ms) {
        return new Promise(r => setTimeout(r, ms));
    }
}

module.exports = GlobalScheduler;
