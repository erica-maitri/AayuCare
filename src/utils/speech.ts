/**
 * Browser Speech Synthesis Wrapper tailored for Elderly Care
 * Slow, crystal-clear pacing (0.85x) with bilingual support (English/Hindi).
 */

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private isSpeaking: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public isAvailable(): boolean {
    return this.synth !== null;
  }

  public speak(
    text: string,
    options?: {
      lang?: string;
      rate?: number;
      pitch?: number;
      onEnd?: () => void;
      onError?: () => void;
    }
  ) {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this browser.');
      options?.onEnd?.();
      return;
    }

    // Cancel any ongoing speech
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options?.lang || 'en-IN'; // Indian English / Hindi accent preferred
    utterance.rate = options?.rate || 0.85; // Slightly slower pacing for senior citizens
    utterance.pitch = options?.pitch || 1.0;

    // Pick best available voice if possible
    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(v => 
      v.lang.includes('hi') || v.lang.includes('en-IN') || v.name.includes('India')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      options?.onEnd?.();
    };

    utterance.onerror = (e) => {
      this.isSpeaking = false;
      console.error('Speech synthesis error:', e);
      options?.onError?.();
    };

    this.synth.speak(utterance);
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }

  public getSpeakingState(): boolean {
    return this.isSpeaking;
  }
}

export const speechService = new SpeechService();
