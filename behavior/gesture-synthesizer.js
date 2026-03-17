// behavior/gesture-synthesizer.js
// Synthesizes realistic touch gestures with natural variation

class GestureSynthesizer {
    constructor() {
        this.touchProfiles = {
            light: { pressure: 0.2, size: 4 },
            medium: { pressure: 0.5, size: 7 },
            heavy: { pressure: 0.8, size: 10 }
        };
        
        this.scrollCurves = ['linear', 'ease-in', 'ease-out', 'bounce'];
    }

    synthesizeTap(x, y, intensity = 'medium') {
        const profile = this.touchProfiles[intensity];
        const jitter = 2 + Math.random() * 3;
        
        return {
            type: 'tap',
            pressure: profile.pressure * (0.8 + Math.random() * 0.4),
            position: {
                x: x + (Math.random() * jitter * 2 - jitter),
                y: y + (Math.random() * jitter * 2 - jitter)
            },
            duration: 80 + Math.random() * 80,
            fingerSize: profile.size * (0.9 + Math.random() * 0.2),
            timestamp: Date.now()
        };
    }

    synthesizeSwipe(startX, startY, endX, endY, duration = 300) {
        const points = [];
        const steps = 20 + Math.floor(Math.random() * 10);
        const curve = this.scrollCurves[Math.floor(Math.random() * this.scrollCurves.length)];
        
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            
            // Apply easing curve
            let easedT;
            switch(curve) {
                case 'ease-in':
                    easedT = t * t;
                    break;
                case 'ease-out':
                    easedT = 1 - Math.pow(1 - t, 2);
                    break;
                case 'bounce':
                    easedT = this.bounceEasing(t);
                    break;
                default:
                    easedT = t;
            }
            
            // Add arc (max 20px deviation)
            const arc = Math.sin(t * Math.PI) * 20 * (Math.random() * 2 - 1);
            
            points.push({
                x: Math.round(startX + (endX - startX) * easedT + arc),
                y: Math.round(startY + (endY - startY) * easedT + arc),
                pressure: 0.3 + Math.random() * 0.3,
                timestamp: Date.now() + i * (duration / steps)
            });
        }
        
        return {
            type: 'swipe',
            points,
            duration,
            acceleration: 1.2 + Math.random() * 0.5
        };
    }

    synthesizeScroll(distance, direction = 'vertical') {
        const startY = 1000;
        const endY = startY - distance;
        
        // Humans often overshoot and bounce back
        const overshoot = distance * 0.1;
        const overshootY = endY - overshoot;
        
        return {
            type: 'scroll',
            phases: [
                {
                    type: 'fling',
                    from: startY,
                    to: overshootY,
                    duration: 200 + Math.random() * 100
                },
                {
                    type: 'bounce',
                    from: overshootY,
                    to: endY,
                    duration: 100 + Math.random() * 50
                },
                {
                    type: 'settle',
                    from: endY,
                    to: endY,
                    duration: 300 + Math.random() * 200
                }
            ]
        };
    }

    synthesizePinch(centerX, centerY, distance, duration = 500) {
        return {
            type: 'pinch',
            center: { x: centerX, y: centerY },
            startDistance: 50,
            endDistance: 50 + distance,
            points: this.generatePinchPoints(centerX, centerY, distance, duration),
            duration
        };
    }

    generatePinchPoints(centerX, centerY, distance, duration) {
        const points = [];
        const steps = 20;
        
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const currentDistance = 50 + distance * t;
            
            points.push({
                thumb: {
                    x: centerX - currentDistance / 2,
                    y: centerY,
                    pressure: 0.5 + Math.random() * 0.3
                },
                index: {
                    x: centerX + currentDistance / 2,
                    y: centerY,
                    pressure: 0.5 + Math.random() * 0.3
                },
                timestamp: Date.now() + i * (duration / steps)
            });
        }
        
        return points;
    }

    bounceEasing(t) {
        const n1 = 7.5625;
        const d1 = 2.75;
        
        if (t < 1 / d1) {
            return n1 * t * t;
        } else if (t < 2 / d1) {
            return n1 * (t -= 1.5 / d1) * t + 0.75;
        } else if (t < 2.5 / d1) {
            return n1 * (t -= 2.25 / d1) * t + 0.9375;
        } else {
            return n1 * (t -= 2.625 / d1) * t + 0.984375;
        }
    }

    // Human typing with variable speed and mistakes
    synthesizeTyping(text) {
        const keystrokes = [];
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            
            // Variable typing speed
            const speed = 50 + Math.random() * 150;
            
            // Occasional typo (2% chance)
            if (Math.random() < 0.02 && i < text.length - 1) {
                const typo = String.fromCharCode(97 + Math.floor(Math.random() * 26));
                keystrokes.push({
                    char: typo,
                    speed,
                    isTypo: true,
                    timestamp: i * speed
                });
                
                // Backspace correction
                keystrokes.push({
                    char: 'BACKSPACE',
                    speed: 100 + Math.random() * 100,
                    timestamp: i * speed + speed + 100
                });
            }
            
            keystrokes.push({
                char,
                speed,
                isTypo: false,
                timestamp: i * speed + (keystrokes.length * 50)
            });
            
            // Pause after word
            if (char === ' ') {
                keystrokes.push({
                    type: 'pause',
                    duration: 200 + Math.random() * 300,
                    timestamp: i * speed + 100
                });
            }
        }
        
        return keystrokes;
    }
}

module.exports = GestureSynthesizer;
