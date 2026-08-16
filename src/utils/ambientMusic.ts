/** Soft ambient pad — no external file, loads instantly. */
export class AmbientMusic {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private playing = false;

  async start(volume = 0.35): Promise<void> {
    if (this.playing) return;

    this.ctx = new AudioContext();
    await this.ctx.resume();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 800;
    filter.Q.value = 0.7;
    filter.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    const notes = [261.63, 329.63, 392.0, 493.88, 523.25];

    for (const freq of notes) {
      const osc = this.ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;

      const gain = this.ctx.createGain();
      gain.gain.value = 0.045;

      const lfo = this.ctx.createOscillator();
      lfo.frequency.value = 0.08 + Math.random() * 0.06;
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.value = 0.012;
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);

      osc.connect(gain);
      gain.connect(filter);
      osc.start();
      lfo.start();
      this.oscillators.push(osc, lfo);
    }

    this.masterGain.gain.linearRampToValueAtTime(
      volume,
      this.ctx.currentTime + 2.5,
    );
    this.playing = true;
  }

  stop(): void {
    if (!this.ctx || !this.masterGain) return;

    const ctx = this.ctx;
    const gain = this.masterGain;
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);

    setTimeout(() => {
      for (const osc of this.oscillators) {
        try {
          osc.stop();
        } catch {
          /* already stopped */
        }
      }
      this.oscillators = [];
      void ctx.close();
      this.ctx = null;
      this.masterGain = null;
      this.playing = false;
    }, 1100);
  }

  isPlaying(): boolean {
    return this.playing;
  }

  setVolume(volume: number): void {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(
        volume,
        this.ctx.currentTime + 0.3,
      );
    }
  }
}
