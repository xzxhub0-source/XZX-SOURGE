// orchestrator/phone-farm.js
// Manages 100+ cloud Android instances with real hardware profiles

const { v4: uuidv4 } = require('uuid');
const hardwareProfiles = require('./hardware-profiles.json');

class CloudPhoneFarm {
    constructor() {
        this.phones = new Map();
        this.maxPhones = 100;
        this.regions = ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'JP'];
    }

    async initialize() {
        console.log(`[PhoneFarm] Initializing ${this.maxPhones} cloud Android instances...`);
        
        for (let i = 0; i < this.maxPhones; i++) {
            const profile = this.getRandomHardwareProfile();
            const region = this.regions[Math.floor(Math.random() * this.regions.length)];
            
            const phone = {
                id: `phone_${uuidv4()}`,
                ...profile,
                androidVersion: profile.androidVersions[Math.floor(Math.random() * profile.androidVersions.length)],
                region,
                imei: this.generateIMEI(),
                androidId: this.generateAndroidId(),
                gaiaId: this.generateGaiaId(),
                status: 'ready',
                currentAccount: null,
                proxy: null,
                trustScore: 100,
                sessionsCompleted: 0,
                lastActive: null,
                system: {
                    battery: this.generateBatteryState(),
                    network: this.generateNetworkState(region),
                    sensors: this.generateSensorData(),
                    lastSecurityPatch: this.randomDate(new Date(2025,0,1), new Date()),
                    installedApps: this.generateInstalledApps()
                }
            };
            
            this.phones.set(phone.id, phone);
        }
        
        console.log(`[PhoneFarm] ${this.phones.size} devices ready`);
        return this.phones;
    }

    getRandomHardwareProfile() {
        return hardwareProfiles[Math.floor(Math.random() * hardwareProfiles.length)];
    }

    getReadyPhones() {
        return Array.from(this.phones.values()).filter(p => p.status === 'ready');
    }

    getAllPhones() {
        return Array.from(this.phones.values());
    }

    generateIMEI() {
        return Array(15).fill(0).map(() => Math.floor(Math.random() * 10)).join('');
    }

    generateAndroidId() {
        return Array(16).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    }

    generateGaiaId() {
        return Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
    }

    generateBatteryState() {
        return {
            level: 0.2 + Math.random() * 0.7,
            charging: Math.random() < 0.2,
            temperature: 25 + Math.random() * 15,
            health: 'good',
            voltage: 3900 + Math.random() * 200
        };
    }

    generateNetworkState(region) {
        const carriers = {
            'US': ['AT&T', 'Verizon', 'T-Mobile'],
            'UK': ['Vodafone', 'EE', 'O2'],
            'CA': ['Rogers', 'Bell', 'Telus'],
            'AU': ['Telstra', 'Optus', 'Vodafone'],
            'DE': ['Deutsche Telekom', 'Vodafone', 'O2'],
            'FR': ['Orange', 'SFR', 'Bouygues'],
            'JP': ['NTT Docomo', 'KDDI', 'SoftBank']
        };
        
        const carrierList = carriers[region] || carriers['US'];
        
        return {
            carrier: carrierList[Math.floor(Math.random() * carrierList.length)],
            networkType: Math.random() > 0.3 ? '5G' : '4G',
            signalStrength: 0.6 + Math.random() * 0.4,
            ipType: 'CGNAT',
            mcc: this.generateMCC(region),
            mnc: Math.floor(Math.random() * 100).toString().padStart(2, '0')
        };
    }

    generateSensorData() {
        return {
            accelerometer: {
                x: (Math.random() * 2 - 1).toFixed(4),
                y: (Math.random() * 2 - 1).toFixed(4),
                z: (Math.random() * 2 - 1).toFixed(4)
            },
            gyroscope: {
                x: (Math.random() * 0.1 - 0.05).toFixed(4),
                y: (Math.random() * 0.1 - 0.05).toFixed(4),
                z: (Math.random() * 0.1 - 0.05).toFixed(4)
            },
            magnetometer: {
                x: (Math.random() * 100 - 50).toFixed(2),
                y: (Math.random() * 100 - 50).toFixed(2),
                z: (Math.random() * 100 - 50).toFixed(2)
            },
            proximity: Math.random() > 0.9 ? 0 : 5,
            light: 10 + Math.random() * 100
        };
    }

    generateInstalledApps() {
        const commonApps = [
            'com.google.android.youtube',
            'com.google.android.gm',
            'com.google.android.apps.maps',
            'com.google.android.apps.photos',
            'com.facebook.katana',
            'com.instagram.android',
            'com.twitter.android',
            'com.spotify.music',
            'com.netflix.mediaclient',
            'com.amazon.mShop.android.shopping'
        ];
        
        // Random subset of apps (10-20 apps)
        const numApps = 10 + Math.floor(Math.random() * 10);
        const shuffled = commonApps.sort(() => 0.5 - Math.random());
        
        return shuffled.slice(0, numApps).map(app => ({
            package: app,
            version: `${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
            lastUpdated: this.randomDate(new Date(2025,0,1), new Date())
        }));
    }

    generateMCC(region) {
        const mccMap = {
            'US': '310', 'UK': '234', 'CA': '302', 'AU': '505',
            'DE': '262', 'FR': '208', 'JP': '440'
        };
        return mccMap[region] || '310';
    }

    randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    getStats() {
        return {
            total: this.phones.size,
            ready: this.getReadyPhones().length,
            byRegion: this.countByRegion(),
            byModel: this.countByModel()
        };
    }

    countByRegion() {
        const counts = {};
        this.phones.forEach(phone => {
            counts[phone.region] = (counts[phone.region] || 0) + 1;
        });
        return counts;
    }

    countByModel() {
        const counts = {};
        this.phones.forEach(phone => {
            counts[phone.model] = (counts[phone.model] || 0) + 1;
        });
        return counts;
    }
}

module.exports = CloudPhoneFarm;
