// monitoring/anomaly-detector.js
// Real-time anomaly detection to prevent pattern formation

class AnomalyDetector {
    constructor() {
        this.patterns = new Map();
        this.anomalies = [];
        this.thresholds = {
            watchTimeVariance: 0.3,
            intervalVariance: 0.4,
            pathRepetition: 0.5,
            deviceCorrelation: 0.6
        };
    }

    startDetection(phoneFarm) {
        console.log('[AnomalyDetector] Starting real-time monitoring...');
        
        setInterval(() => {
            this.detectAnomalies(phoneFarm);
        }, 300000); // Every 5 minutes
    }

    detectAnomalies(phoneFarm) {
        const phones = phoneFarm.getAllPhones();
        
        // Check for watch time clustering
        this.detectWatchTimeClustering(phones);
        
        // Check for path repetition
        this.detectPathRepetition(phones);
        
        // Check for device correlation
        this.detectDeviceCorrelation(phones);
        
        // Check for timing patterns
        this.detectTimingPatterns(phones);
    }

    detectWatchTimeClustering(phones) {
        const watchTimes = [];
        
        for (const phone of phones) {
            if (phone.lastWatchTime) {
                watchTimes.push(phone.lastWatchTime);
            }
        }
        
        if (watchTimes.length < 10) return;
        
        // Calculate variance
        const mean = watchTimes.reduce((a, b) => a + b, 0) / watchTimes.length;
        const variance = watchTimes.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / watchTimes.length;
        const stdDev = Math.sqrt(variance);
        const cv = stdDev / mean; // Coefficient of variation
        
        if (cv < this.thresholds.watchTimeVariance) {
            console.log('[AnomalyDetector] WARNING: Watch times too uniform');
            this.anomalies.push({
                type: 'watch_time_clustering',
                severity: 'medium',
                timestamp: Date.now(),
                value: cv
            });
        }
    }

    detectPathRepetition(phones) {
        const paths = new Map();
        
        for (const phone of phones) {
            if (phone.lastPath) {
                paths.set(phone.lastPath, (paths.get(phone.lastPath) || 0) + 1);
            }
        }
        
        const total = Array.from(paths.values()).reduce((a, b) => a + b, 0);
        if (total < 20) return;
        
        // Check for any path dominating
        for (const [path, count] of paths) {
            const ratio = count / total;
            if (ratio > this.thresholds.pathRepetition) {
                console.log(`[AnomalyDetector] WARNING: Path ${path} used ${(ratio*100).toFixed(0)}% of time`);
                this.anomalies.push({
                    type: 'path_repetition',
                    severity: 'high',
                    timestamp: Date.now(),
                    path,
                    ratio
                });
            }
        }
    }

    detectDeviceCorrelation(phones) {
        // Check for identical device fingerprints
        const fingerprints = new Map();
        
        for (const phone of phones) {
            if (phone.identity?.fingerprint?.id) {
                const fpId = phone.identity.fingerprint.id;
                fingerprints.set(fpId, (fingerprints.get(fpId) || 0) + 1);
            }
        }
        
        for (const [fpId, count] of fingerprints) {
            if (count > 1) {
                console.log(`[AnomalyDetector] WARNING: Duplicate fingerprint ${fpId} on ${count} devices`);
                this.anomalies.push({
                    type: 'duplicate_fingerprint',
                    severity: 'critical',
                    timestamp: Date.now(),
                    count
                });
            }
        }
    }

    detectTimingPatterns(phones) {
        // Check for synchronized activity
        const activeTimes = [];
        
        for (const phone of phones) {
            if (phone.lastActive) {
                activeTimes.push(phone.lastActive);
            }
        }
        
        if (activeTimes.length < 20) return;
        
        // Look for clusters in time
        const timeWindow = 5 * 60 * 1000; // 5 minutes
        const clusters = [];
        
        for (let i = 0; i < activeTimes.length; i++) {
            let clusterSize = 1;
            for (let j = i + 1; j < activeTimes.length; j++) {
                if (Math.abs(activeTimes[j] - activeTimes[i]) < timeWindow) {
                    clusterSize++;
                }
            }
            if (clusterSize > 5) {
                clusters.push(clusterSize);
            }
        }
        
        if (clusters.length > 0) {
            console.log(`[AnomalyDetector] WARNING: Activity clusters detected`);
            this.anomalies.push({
                type: 'timing_cluster',
                severity: 'high',
                timestamp: Date.now(),
                clusters
            });
        }
    }

    getAnomalies() {
        // Return and clear recent anomalies
        const recent = this.anomalies.filter(a => a.timestamp > Date.now() - 3600000);
        this.anomalies = this.anomalies.filter(a => a.timestamp <= Date.now() - 3600000);
        return recent;
    }
}

module.exports = AnomalyDetector;
