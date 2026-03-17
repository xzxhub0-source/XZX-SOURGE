// identity/sensor-obfuscator.js
// Realistic sensor data emulation to avoid telemetry detection

class SensorObfuscator {
    constructor() {
        this.lastUpdate = Date.now();
        this.movementPatterns = {
            stationary: { variance: 0.01, frequency: 0.1 },
            walking: { variance: 0.1, frequency: 2 },
            driving: { variance: 0.3, frequency: 5 },
            pocket: { variance: 0.05, frequency: 0.5 }
        };
        this.currentPattern = 'stationary';
    }

    perturbSensorData(phone) {
        const now = Date.now();
        const timeDelta = (now - this.lastUpdate) / 1000; // seconds
        
        // Update movement pattern occasionally
        if (Math.random() < 0.01) {
            this.updateMovementPattern();
        }
        
        const pattern = this.movementPatterns[this.currentPattern];
        
        // Apply perturbations to each sensor
        this.perturbAccelerometer(phone, pattern, timeDelta);
        this.perturbGyroscope(phone, pattern, timeDelta);
        this.perturbMagnetometer(phone, pattern, timeDelta);
        this.perturbOtherSensors(phone, pattern);
        
        this.lastUpdate = now;
        
        return phone.system.sensors;
    }

    perturbAccelerometer(phone, pattern, timeDelta) {
        const sensor = phone.system.sensors.accelerometer;
        
        // Add random walk based on movement pattern
        const walkX = (Math.random() - 0.5) * pattern.variance * timeDelta;
        const walkY = (Math.random() - 0.5) * pattern.variance * timeDelta;
        const walkZ = (Math.random() - 0.5) * pattern.variance * timeDelta;
        
        sensor.x = parseFloat((parseFloat(sensor.x) + walkX).toFixed(4));
        sensor.y = parseFloat((parseFloat(sensor.y) + walkY).toFixed(4));
        sensor.z = parseFloat((parseFloat(sensor.z) + walkZ).toFixed(4));
        
        // Keep within realistic bounds
        sensor.x = Math.max(-1, Math.min(1, sensor.x));
        sensor.y = Math.max(-1, Math.min(1, sensor.y));
        sensor.z = Math.max(-1, Math.min(1, sensor.z));
    }

    perturbGyroscope(phone, pattern, timeDelta) {
        const sensor = phone.system.sensors.gyroscope;
        
        // Gyroscope measures rotation
        const rotationX = (Math.random() - 0.5) * pattern.variance * timeDelta * 0.1;
        const rotationY = (Math.random() - 0.5) * pattern.variance * timeDelta * 0.1;
        const rotationZ = (Math.random() - 0.5) * pattern.variance * timeDelta * 0.1;
        
        sensor.x = parseFloat((parseFloat(sensor.x) + rotationX).toFixed(4));
        sensor.y = parseFloat((parseFloat(sensor.y) + rotationY).toFixed(4));
        sensor.z = parseFloat((parseFloat(sensor.z) + rotationZ).toFixed(4));
        
        // Keep within realistic bounds
        sensor.x = Math.max(-0.5, Math.min(0.5, sensor.x));
        sensor.y = Math.max(-0.5, Math.min(0.5, sensor.y));
        sensor.z = Math.max(-0.5, Math.min(0.5, sensor.z));
    }

    perturbMagnetometer(phone, pattern, timeDelta) {
        const sensor = phone.system.sensors.magnetometer;
        
        // Magnetometer measures Earth's field (noise only)
        const noiseX = (Math.random() - 0.5) * 2;
        const noiseY = (Math.random() - 0.5) * 2;
        const noiseZ = (Math.random() - 0.5) * 2;
        
        sensor.x = parseFloat((parseFloat(sensor.x) + noiseX).toFixed(2));
        sensor.y = parseFloat((parseFloat(sensor.y) + noiseY).toFixed(2));
        sensor.z = parseFloat((parseFloat(sensor.z) + noiseZ).toFixed(2));
        
        // Keep within realistic bounds (Earth's field ~25-65 μT)
        sensor.x = Math.max(-100, Math.min(100, sensor.x));
        sensor.y = Math.max(-100, Math.min(100, sensor.y));
        sensor.z = Math.max(-100, Math.min(100, sensor.z));
    }

    perturbOtherSensors(phone, pattern) {
        // Proximity sensor (0 = near, 5+ = far)
        if (Math.random() < 0.05) {
            phone.system.sensors.proximity = Math.random() > 0.8 ? 0 : 5 + Math.random() * 5;
        }
        
        // Light sensor
        if (Math.random() < 0.1) {
            phone.system.sensors.light = 10 + Math.random() * 190;
        }
        
        // Pressure (weather changes slowly)
        if (Math.random() < 0.01) {
            phone.system.sensors.pressure += (Math.random() - 0.5) * 5;
            phone.system.sensors.pressure = Math.max(950, Math.min(1050, phone.system.sensors.pressure));
        }
        
        // Humidity
        if (Math.random() < 0.01) {
            phone.system.sensors.humidity += (Math.random() - 0.5) * 5;
            phone.system.sensors.humidity = Math.max(20, Math.min(90, phone.system.sensors.humidity));
        }
    }

    updateMovementPattern() {
        const patterns = ['stationary', 'walking', 'driving', 'pocket'];
        const weights = [0.7, 0.15, 0.05, 0.1]; // Mostly stationary
        
        const rand = Math.random();
        let sum = 0;
        for (let i = 0; i < patterns.length; i++) {
            sum += weights[i];
            if (rand < sum) {
                this.currentPattern = patterns[i];
                break;
            }
        }
    }

    simulateDeviceMotion(phone, duration) {
        // Simulate device being in motion for a period
        const steps = Math.floor(duration / 0.1); // 100ms steps
        
        for (let i = 0; i < steps; i++) {
            this.perturbSensorData(phone);
        }
    }

    getSensorSnapshot(phone) {
        return {
            timestamp: Date.now(),
            sensors: { ...phone.system.sensors },
            pattern: this.currentPattern
        };
    }
}

module.exports = SensorObfuscator;
