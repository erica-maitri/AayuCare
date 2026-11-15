/**
 * Browser Speech Synthesis Wrapper tailored for Elderly Care
 * Crystal-clear word-by-word pronunciation with strict language isolation (English vs Hindi).
 */

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private isSpeaking: boolean = false;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (this.synth) {
      this.voices = this.synth.getVoices();
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
      onStart?: () => void;
      onEnd?: () => void;
      onError?: () => void;
    }
  ) {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this browser.');
      options?.onEnd?.();
      return;
    }

    // Cancel any ongoing speech immediately before starting new utterance
    this.stop();

    if (this.voices.length === 0) {
      this.loadVoices();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const targetLang = (options?.lang || 'en-US').toLowerCase();

    utterance.lang = options?.lang || (targetLang.startsWith('hi') ? 'hi-IN' : 'en-US');
    // Steady, deliberate pacing for word-by-word comprehension
    utterance.rate = options?.rate || (targetLang.startsWith('hi') ? 0.82 : 0.80);
    utterance.pitch = options?.pitch || 1.0;

    // Strict voice matching: Never use a Hindi voice for English or vice versa
    if (targetLang.startsWith('hi')) {
      const hindiVoice = this.voices.find(v => v.lang.toLowerCase().includes('hi'));
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }
    } else {
      // Pick dedicated native English voice (US / GB / IN)
      const englishVoice = this.voices.find(v => 
        (v.lang.toLowerCase().includes('en-us') ||
         v.lang.toLowerCase().includes('en-gb') ||
         v.lang.toLowerCase().includes('en-in') ||
         v.lang.toLowerCase().startsWith('en')) &&
        !v.lang.toLowerCase().includes('hi')
      );
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      options?.onStart?.();
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
