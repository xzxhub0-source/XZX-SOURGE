// trust/cookie-vault.js
// Manages aged accounts with 6+ months of history

class CookieVault {
    constructor() {
        this.accounts = [];
        this.trustScores = new Map();
    }

    async loadCookies() {
        console.log('[CookieVault] Loading aged accounts...');
        
        // Generate synthetic aged accounts for demonstration
        this.generateAgedAccounts(500);
        
        console.log(`[CookieVault] Loaded ${this.accounts.length} accounts aged 6+ months`);
        return this.accounts;
    }

    generateAgedAccounts(count) {
        const regions = ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'JP'];
        
        for (let i = 0; i < count; i++) {
            const region = regions[Math.floor(Math.random() * regions.length)];
            const ageMonths = 6 + Math.floor(Math.random() * 18); // 6-24 months
            
            const account = {
                id: `acc_${i}`,
                region,
                age: ageMonths * 30 * 24 * 60 * 60 * 1000,
                trustScore: this.calculateTrustScore(ageMonths, region),
                cookies: this.generateCookies(i, region),
                watchHistory: this.generateWatchHistory(ageMonths),
                subscriptions: this.generateSubscriptions(),
                verifiedEmail: Math.random() > 0.2,
                verifiedPhone: Math.random() > 0.5,
                lastUsed: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
            };
            
            this.accounts.push(account);
            this.trustScores.set(account.id, account.trustScore);
        }
    }

    calculateTrustScore(ageMonths, region) {
        let score = 0;
        
        // Age contribution (0-40)
        score += Math.min(40, ageMonths * 2);
        
        // Region stability (0-20)
        const stableRegions = ['US', 'UK', 'CA', 'AU'];
        if (stableRegions.includes(region)) score += 20;
        
        // Random baseline
        score += 20 + Math.random() * 20;
        
        return Math.min(100, Math.round(score));
    }

    generateCookies(accountId, region) {
        // Generate realistic cookie structure
        return [
            {
                name: 'VISITOR_INFO1_LIVE',
                value: this.generateRandomString(16),
                domain: '.youtube.com',
                path: '/',
                secure: true,
                httpOnly: false,
                expiry: Date.now() + 180 * 24 * 60 * 60 * 1000
            },
            {
                name: 'LOGIN_INFO',
                value: this.generateRandomString(32),
                domain: '.youtube.com',
                path: '/',
                secure: true,
                httpOnly: true,
                expiry: Date.now() + 180 * 24 * 60 * 60 * 1000
            },
            {
                name: 'PREF',
                value: `f6=40000000&gl=${region}&hl=en`,
                domain: '.youtube.com',
                path: '/',
                secure: false,
                httpOnly: false,
                expiry: Date.now() + 180 * 24 * 60 * 60 * 1000
            }
        ];
    }

    generateWatchHistory(ageMonths) {
        const history = [];
        const totalVideos = ageMonths * 30 * 3; // ~3 videos per day
        
        for (let i = 0; i < totalVideos; i++) {
            history.push({
                videoId: this.generateRandomString(11),
                timestamp: Date.now() - Math.random() * ageMonths * 30 * 24 * 60 * 60 * 1000,
                duration: 120 + Math.floor(Math.random() * 480)
            });
        }
        
        // Sort by timestamp
        return history.sort((a, b) => a.timestamp - b.timestamp);
    }

    generateSubscriptions() {
        const channels = [
            'PewDiePie', 'MrBeast', 'T-Series', 'Cocomelon',
            'SET India', 'Kids Diana Show', 'Like Nastya', 'Vlad and Niki',
            'Zee Music Company', 'WWE', 'Blackpink', 'Justin Bieber',
            'Maroon 5', 'Taylor Swift', 'Ed Sheeran', 'Ariana Grande'
        ];
        
        const numSubs = 20 + Math.floor(Math.random() * 50);
        const shuffled = this.shuffle([...channels]);
        
        return shuffled.slice(0, numSubs).map(channel => ({
            name: channel,
            since: Date.now() - Math.random() * 2 * 365 * 24 * 60 * 60 * 1000
        }));
    }

    getBestAccount(region = null, minTrust = 80) {
        let candidates = this.accounts.filter(a => a.trustScore >= minTrust);
        
        if (region) {
            candidates = candidates.filter(a => a.region === region);
        }
        
        if (candidates.length === 0) {
            candidates = this.accounts.filter(a => a.trustScore >= 70);
        }
        
        if (candidates.length === 0) {
            throw new Error('No high-trust accounts available');
        }
        
        // Sort by trust score
        candidates.sort((a, b) => b.trustScore - a.trustScore);
        
        return candidates[Math.floor(Math.random() * Math.min(10, candidates.length))];
    }

    generateRandomString(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    getStats() {
        return {
            total: this.accounts.length,
            avgTrust: this.accounts.reduce((sum, a) => sum + a.trustScore, 0) / this.accounts.length,
            byRegion: this.countByRegion(),
            byAge: this.countByAge()
        };
    }

    countByRegion() {
        const counts = {};
        this.accounts.forEach(a => {
            counts[a.region] = (counts[a.region] || 0) + 1;
        });
        return counts;
    }

    countByAge() {
        const now = Date.now();
        const counts = { '<6 months': 0, '6-12 months': 0, '12-18 months': 0, '18+ months': 0 };
        
        this.accounts.forEach(a => {
            const ageMonths = a.age / (30 * 24 * 60 * 60 * 1000);
            if (ageMonths < 6) counts['<6 months']++;
            else if (ageMonths < 12) counts['6-12 months']++;
            else if (ageMonths < 18) counts['12-18 months']++;
            else counts['18+ months']++;
        });
        
        return counts;
    }
}

module.exports = CookieVault;
