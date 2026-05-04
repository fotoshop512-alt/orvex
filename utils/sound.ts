// Global AudioContext - tek bir context paylaşılıyor
let audioContext: AudioContext | null = null;

// AudioContext'i güvenli şekilde al veya oluştur
const getAudioContext = (): AudioContext | null => {
    try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return null;

        if (!audioContext || audioContext.state === 'closed') {
            audioContext = new AudioContextClass();
        }

        // Suspended state'de ise resume etmeyi dene
        if (audioContext.state === 'suspended') {
            audioContext.resume().catch(() => { });
        }

        return audioContext;
    } catch (e) {
        console.error("AudioContext creation error", e);
        return null;
    }
};

// Oscillator'ları düzgün temizle
const cleanupOscillator = (osc: OscillatorNode, gain: GainNode, ctx: AudioContext, duration: number) => {
    setTimeout(() => {
        try {
            osc.disconnect();
            gain.disconnect();
        } catch (e) {
            // Zaten disconnect edilmiş olabilir
        }
    }, duration * 1000 + 100); // Ses bittikten 100ms sonra temizle
};

export const playSound = (type: 'correct' | 'wrong' | 'click' | 'success' | 'skip' | 'page') => {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;

        if (type === 'correct') {
            // High pitched ding
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
            gain.gain.setValueAtTime(0.5, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
            cleanupOscillator(osc, gain, ctx, 0.3);

        } else if (type === 'wrong') {
            // Two-tone descending "uh-oh" sound
            const notes = [180, 140];
            notes.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);

                const t = now + i * 0.12;
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, t);
                gain.gain.setValueAtTime(0.4, t);
                gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
                osc.start(t);
                osc.stop(t + 0.2);
                cleanupOscillator(osc, gain, ctx, 0.2 + i * 0.12);
            });

        } else if (type === 'success') {
            // Victory fanfare
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
            notes.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);

                const t = now + i * 0.1;
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.35, t);
                gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
                osc.start(t);
                osc.stop(t + 0.3);
                cleanupOscillator(osc, gain, ctx, 0.3 + i * 0.1);
            });

        } else if (type === 'click') {
            // Premium click sound
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.connect(gain1);
            gain1.connect(ctx.destination);

            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(1200, now);
            osc1.frequency.exponentialRampToValueAtTime(800, now + 0.05);
            gain1.gain.setValueAtTime(0.2, now);
            gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
            osc1.start(now);
            osc1.stop(now + 0.05);
            cleanupOscillator(osc1, gain1, ctx, 0.05);

            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.connect(gain2);
            gain2.connect(ctx.destination);

            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(1600, now);
            osc2.frequency.exponentialRampToValueAtTime(1200, now + 0.03);
            gain2.gain.setValueAtTime(0.1, now);
            gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
            osc2.start(now);
            osc2.stop(now + 0.03);
            cleanupOscillator(osc2, gain2, ctx, 0.03);

        } else if (type === 'skip') {
            // Soft whoosh sound
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(400, now + 0.15);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
            cleanupOscillator(osc, gain, ctx, 0.15);

        } else if (type === 'page') {
            // Page turn sound
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(500, now + 0.12);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
            osc.start(now);
            osc.stop(now + 0.12);
            cleanupOscillator(osc, gain, ctx, 0.12);
        }

    } catch (e) {
        console.error("Sound error", e);
    }
};

// Uygulama arka plana geçtiğinde AudioContext'i temizle
export const cleanupAudio = () => {
    try {
        if (audioContext && audioContext.state !== 'closed') {
            audioContext.close().then(() => {
                audioContext = null;
            }).catch(() => {
                audioContext = null;
            });
        }
    } catch (e) {
        audioContext = null;
    }
};

// Uygulamayı dinle ve arka plana geçince temizle
if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            cleanupAudio();
        }
    });
}
