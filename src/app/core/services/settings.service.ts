
import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';
export type Currency = 'TWD' | 'USD' | 'EUR' | 'JPY' | 'KRW' | 'CNY' | 'HKD' | 'AUD' | 'GBP';

export interface UserSettings {
  theme: Theme;
  defaultCurrency: Currency;
  notificationsEnabled: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly storageKey = 'user-settings';
  
  // 使用 Angular Signals 管理狀態
  settings = signal<UserSettings>(this.loadSettings());

  constructor() {
    this.applyTheme(this.settings().theme); // 確保初始化時應用主題

    // 當設定變更時自動儲存並應用效果
    effect(() => {
      const currentSettings = this.settings();
      localStorage.setItem(this.storageKey, JSON.stringify(currentSettings));
      this.applyTheme(currentSettings.theme);
    });
  }

  updateSettings(newSettings: Partial<UserSettings>) {
    this.settings.update(current => ({ ...current, ...newSettings }));
  }

  private loadSettings(): UserSettings {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing settings:', error);
        localStorage.removeItem(this.storageKey);
      }
    }
    return {
      theme: 'light',
      defaultCurrency: 'TWD',
      notificationsEnabled: true
    };
  }

  private applyTheme(theme: Theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}
