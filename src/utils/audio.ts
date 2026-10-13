// Web Audio API Synthesizer for focus timer alerts and ambient study noise
// 100% client-side, zero external assets or MP3 network requests needed!

let audioCtx: AudioContext | null = null;
let ambientSource: AudioNode | null = null;
let ambientGainNode: GainNode | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a clear, pleasing bell/chime sound using synthesized harmonic sines
 */
export function playChimeSound(type: 'complete' | 'start' | 'alert' = 'complete') {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    if (type === 'complete') {
      // Warm 3-tone celebratory completion chime (E5 -> G#5 -> B5)
      const freqs = [659.25, 830.61, 987.77];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);

        gain.gain.setValueAtTime(0, now + idx * 0.15);
        gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.15 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.15 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 1.3);
      });
    } else if (type === 'start') {
      // Crisp 2-tone start chime (C5 -> G5)
      const freqs = [523.25, 783.99];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0, now + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.1 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.1 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.7);
      });
    } else {
      // Subtle alert beep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    }
  } catch (err) {
    console.warn('Audio synthesis warning:', err);
  }
}

/**
 * Start synthesized ambient white noise or gentle binaural focus sound
 */
export function startAmbientNoise(type: 'whitenoise' | 'rain' | 'alphaWave', volume: number = 0.15) {
  stopAmbientNoise();
  try {
    const ctx = getAudioContext();
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.connect(ctx.destination);
    ambientGainNode = gainNode;

    if (type === 'alphaWave') {
      // 40Hz binaural isochronic tone for deep cognitive focus
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, ctx.currentTime); // Base carrier tone

      // Modulator for 40Hz alpha rhythm
      const modOsc = ctx.createOscillator();
      const modGain = ctx.createGain();
      modOsc.frequency.setValueAtTime(40, ctx.currentTime);
      modGain.gain.setValueAtTime(40, ctx.currentTime);

      modOsc.connect(modGain.gain);
      osc.connect(gainNode);

      osc.start();
      modOsc.start();
      ambientSource = osc;
    } else {
      // Noise buffer for white noise or gentle rain simulation
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'rain') {
          // Pink/brown filtered noise feels like gentle rainfall
          lastOut = (lastOut + 0.02 * white) / 1.02;
          output[i] = lastOut * 3.5;
        } else {
          // Clean white noise
          output[i] = white * 0.3;
        }
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Soft low-pass filter to make it gentle and non-fatiguing
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(type === 'rain' ? 800 : 1200, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gainNode);

      whiteNoise.start();
      ambientSource = whiteNoise;
    }
  } catch (err) {
    console.warn('Ambient noise error:', err);
  }
}

export function setAmbientVolume(volume: number) {
  if (ambientGainNode && audioCtx) {
    ambientGainNode.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), audioCtx.currentTime);
  }
}

export function stopAmbientNoise() {
  if (ambientSource) {
    try {
      (ambientSource as any).stop?.();
      ambientSource.disconnect();
    } catch {}
    ambientSource = null;
  }
  if (ambientGainNode) {
    try {
      ambientGainNode.disconnect();
    } catch {}
    ambientGainNode = null;
  }
}

/**
 * Voice Note Recorder using HTML5 MediaRecorder API
 */
export class VoiceRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  public startTime: number = 0;

  async start(): Promise<void> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Microphone audio recording is not supported on this browser.');
    }

    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.audioChunks = [];
    
    // Choose optimal mimeType supported by browser
    let options: MediaRecorderOptions = {};
    if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
      options = { mimeType: 'audio/webm;codecs=opus' };
    } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
      options = { mimeType: 'audio/ogg;codecs=opus' };
    } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
      options = { mimeType: 'audio/mp4' };
    }

    this.mediaRecorder = new MediaRecorder(this.stream, options);
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };
    this.startTime = Date.now();
    this.mediaRecorder.start(200); // 200ms slice
  }

  pause(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
    }
  }

  resume(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
    }
  }

  stop(): Promise<{ audioUrl: string; durationSeconds: number; blob: Blob }> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recording session.'));
        return;
      }

      const durationSeconds = Math.max(1, Math.round((Date.now() - this.startTime) / 1000));

      this.mediaRecorder.onstop = () => {
        try {
          const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
          const audioBlob = new Blob(this.audioChunks, { type: mimeType });
          const reader = new FileReader();
          reader.onloadend = () => {
            const audioUrl = reader.result as string;
            // Stop all audio tracks
            this.stream?.getTracks().forEach((track) => track.stop());
            this.stream = null;
            this.mediaRecorder = null;
            this.audioChunks = [];
            resolve({ audioUrl, durationSeconds, blob: audioBlob });
          };
          reader.onerror = () => {
            reject(new Error('Failed to encode voice note data.'));
          };
          reader.readAsDataURL(audioBlob);
        } catch (err) {
          reject(err);
        }
      };

      if (this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
      }
    });
  }

  cancel(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try { this.mediaRecorder.stop(); } catch {}
    }
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
  }
}

