// trust/trust-builder.js
// Builds long-term trust through cross-platform Google activity

class TrustBuilder {
    constructor(phoneFarm, appController) {
        this.phoneFarm = phoneFarm;
        this.appController = appController;
        this.services = ['youtube', 'gmail', 'maps', 'search', 'photos'];
        this.running = false;
    }

    runBackgroundTasks() {
        if (this.running) return;
        this.running = true;
        
        console.log('[TrustBuilder] Starting background trust building...');
        
        setInterval(() => {
            this.performRandomActivities();
        }, 3600000); // Every hour
        
        // Daily longer sessions
        setInterval(() => {
            this.performDeepSession();
        }, 24 * 60 * 60 * 1000);
    }

    async performRandomActivities() {
        const phones = this.phoneFarm.getReadyPhones();
        const numActive = Math.floor(phones.length * 0.3); // 30% active at any time
        
        for (let i = 0; i < numActive; i++) {
            const phone = phones[Math.floor(Math.random() * phones.length)];
            
            // Randomly choose 1-3 services
            const numServices = 1 + Math.floor(Math.random() * 3);
            const shuffled = this.shuffle([...this.services]);
            
            for (let j = 0; j < numServices; j++) {
                await this.useService(phone, shuffled[j]);
                await this.delay(30000 + Math.random() * 120000); // 30s-2min between services
            }
        }
    }

    async performDeepSession() {
        const phones = this.phoneFarm.getReadyPhones();
        const numPhones = Math.floor(phones.length * 0.1); // 10% get deep sessions
        
        for (let i = 0; i < numPhones; i++) {
            const phone = phones[Math.floor(Math.random() * phones.length)];
            
            console.log(`[TrustBuilder] Deep session on ${phone.id}`);
            
            // 30-60 minute session across multiple services
            const sessionDuration = 1800 + Math.floor(Math.random() * 1800); // 30-60 min
            
            const startTime = Date.now();
            while (Date.now() - startTime < sessionDuration * 1000) {
                const service = this.services[Math.floor(Math.random() * this.services.length)];
                await this.useService(phone, service);
                await this.delay(60000 + Math.random() * 180000); // 1-3 min between activities
            }
        }
    }

    async useService(phone, service) {
        switch(service) {
            case 'youtube':
                await this.useYouTube(phone);
                break;
            case 'gmail':
                await this.useGmail(phone);
                break;
            case 'maps':
                await this.useMaps(phone);
                break;
            case 'search':
                await this.useSearch(phone);
                break;
            case 'photos':
                await this.usePhotos(phone);
                break;
        }
    }

    async useYouTube(phone) {
        console.log(`[TrustBuilder] ${phone.id} using YouTube`);
        
        // Watch 2-5 videos
        const numVideos = 2 + Math.floor(Math.random() * 4);
        
        for (let i = 0; i < numVideos; i++) {
            // Search for something
            const queries = ['funny cats', 'news today', 'music mix', 'tutorial', 'vlog'];
            const query = queries[Math.floor(Math.random() * queries.length)];
            
            await this.appController.searchVideo(phone.id, query);
            await this.delay(3000 + Math.random() * 5000);
            
            // Watch video
            const watchTime = 120 + Math.random() * 240; // 2-6 minutes
            await this.appController.watchVideo(phone.id, `video_${i}`, watchTime);
            
            // 20% chance to like
            if (Math.random() < 0.2) {
                await this.appController.likeVideo(phone.id);
            }
            
            await this.delay(5000 + Math.random() * 10000);
        }
    }

    async useGmail(phone) {
        console.log(`[TrustBuilder] ${phone.id} using Gmail`);
        
        // Simulate reading emails
        const numEmails = 3 + Math.floor(Math.random() * 5);
        
        for (let i = 0; i < numEmails; i++) {
            await this.delay(5000 + Math.random() * 10000); // Reading time
        }
        
        // 30% chance to write email
        if (Math.random() < 0.3) {
            await this.delay(20000 + Math.random() * 20000); // Writing time
        }
    }

    async useMaps(phone) {
        console.log(`[TrustBuilder] ${phone.id} using Google Maps`);
        
        // Search for a location
        const locations = ['coffee shop', 'restaurant', 'gas station', 'pharmacy', 'gym'];
        const location = locations[Math.floor(Math.random() * locations.length)];
        
        await this.delay(3000 + Math.random() * 5000);
        
        // View directions
        await this.delay(5000 + Math.random() * 10000);
        
        // 20% chance to leave a review
        if (Math.random() < 0.2) {
            await this.delay(10000 + Math.random() * 10000);
        }
    }

    async useSearch(phone) {
        console.log(`[TrustBuilder] ${phone.id} using Google Search`);
        
        const queries = [
            'weather forecast',
            'stock market',
            'sports scores',
            'movie times',
            'restaurant reviews'
        ];
        
        const numSearches = 2 + Math.floor(Math.random() * 4);
        
        for (let i = 0; i < numSearches; i++) {
            const query = queries[Math.floor(Math.random() * queries.length)];
            await this.delay(2000 + Math.random() * 3000);
            
            // Click on some results
            const numClicks = Math.floor(Math.random() * 3);
            for (let j = 0; j < numClicks; j++) {
                await this.delay(5000 + Math.random() * 10000);
            }
        }
    }

    async usePhotos(phone) {
        console.log(`[TrustBuilder] ${phone.id} using Google Photos`);
        
        // Browse photos
        await this.delay(10000 + Math.random() * 20000);
        
        // 10% chance to upload a photo
        if (Math.random() < 0.1) {
            await this.delay(15000 + Math.random() * 15000);
        }
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    delay(ms) {
        return new Promise(r => setTimeout(r, ms));
    }
}

module.exports = TrustBuilder;
