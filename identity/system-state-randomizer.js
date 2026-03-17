// identity/system-state-randomizer.js
// Randomizes OS state, battery, patch levels across devices

class SystemStateRandomizer {
    randomizeSystemState(phone) {
        phone.system = {
            ...phone.system,
            battery: this.randomizeBattery(),
            lastSecurityPatch: this.randomizeSecurityPatch(),
            installedApps: this.randomizeInstalledApps(phone),
            backgroundProcesses: this.randomizeBackgroundProcesses(),
            storage: this.randomizeStorage(),
            sensors: this.randomizeSensors()
        };
        
        return phone;
    }

    randomizeBattery() {
        return {
            level: 0.15 + Math.random() * 0.8,
            charging: Math.random() < 0.15,
            temperature: 25 + Math.random() * 15,
            health: 'good',
            voltage: 3800 + Math.random() * 400,
            current: -100 + Math.random() * 200,
            capacity: 90 + Math.random() * 10
        };
    }

    randomizeSecurityPatch() {
        const start = new Date(2025, 0, 1);
        const end = new Date();
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    randomizeInstalledApps(phone) {
        const baseApps = [
            'com.google.android.youtube',
            'com.google.android.gm',
            'com.google.android.apps.maps',
            'com.google.android.apps.photos',
            'com.google.android.apps.messaging'
        ];
        
        const optionalApps = [
            'com.facebook.katana',
            'com.instagram.android',
            'com.twitter.android',
            'com.spotify.music',
            'com.netflix.mediaclient',
            'com.amazon.mShop.android.shopping',
            'com.tiktok.trill',
            'com.snapchat.android',
            'com.whatsapp',
            'com.discord'
        ];
        
        // Each phone has slightly different apps
        const numOptional = Math.floor(Math.random() * 8);
        const shuffled = this.shuffle([...optionalApps]);
        
        return [...baseApps, ...shuffled.slice(0, numOptional)].map(app => ({
            package: app,
            version: this.randomizeAppVersion(),
            lastUpdated: this.randomizeDate(30),
            size: 50 + Math.floor(Math.random() * 200)
        }));
    }

    randomizeBackgroundProcesses() {
        const numProcesses = 5 + Math.floor(Math.random() * 15);
        const processes = [];
        
        for (let i = 0; i < numProcesses; i++) {
            processes.push({
                name: `com.android.process${i}`,
                cpu: Math.random() * 5,
                memory: 10 + Math.random() * 50,
                uptime: Math.random() * 3600
            });
        }
        
        return processes;
    }

    randomizeStorage() {
        const total = 128 + Math.floor(Math.random() * 128); // 128-256GB
        const used = 20 + Math.random() * 70; // 20-90% used
        
        return {
            total,
            used: Math.floor(total * used / 100),
            free: Math.floor(total * (100 - used) / 100),
            apps: Math.floor(total * Math.random() * 0.3),
            media: Math.floor(total * Math.random() * 0.4),
            system: Math.floor(total * 0.1)
        };
    }

    randomizeSensors() {
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
            light: 10 + Math.random() * 100,
            pressure: 980 + Math.random() * 40,
            humidity: 30 + Math.random() * 50
        };
    }

    randomizeAppVersion() {
        const major = Math.floor(Math.random() * 5) + 15;
        const minor = Math.floor(Math.random() * 10);
        const patch = Math.floor(Math.random() * 10);
        return `${major}.${minor}.${patch}`;
    }

    randomizeDate(maxDaysAgo) {
        const ms = Math.random() * maxDaysAgo * 24 * 60 * 60 * 1000;
        return new Date(Date.now() - ms);
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

module.exports = SystemStateRandomizer;
