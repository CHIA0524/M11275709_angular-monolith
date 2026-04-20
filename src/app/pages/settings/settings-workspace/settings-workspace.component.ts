import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { startWith } from 'rxjs';
import { ColorPreset, SettingsService } from '../../../core/services/settings.service';
import { SettingsSearchService } from '../settings-search.service';

type PaletteFieldKey = 'background' | 'surface' | 'toolbar' | 'sidebar' | 'accent' | 'textPrimary';

@Component({
  selector: 'app-settings-workspace',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSlideToggleModule],
  templateUrl: './settings-workspace.component.html',
  styleUrl: './settings-workspace.component.scss'
})
export class SettingsWorkspaceComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly settingsSearchService = inject(SettingsSearchService);
  private readonly settingsService = inject(SettingsService);

  readonly searchQuery = signal('');
  readonly searchResults = computed(() => this.settingsSearchService.search(this.searchQuery()));
  readonly validationMessage = signal('尚未驗證');
  readonly colorPresets = this.settingsService.getColorPresets();
  readonly activePreset = signal(this.settingsService.settings().workspacePreferences.appearancePreset);
  readonly palettePreview = signal(this.settingsService.settings().workspacePreferences.palette);
  readonly paletteFields: Array<{ key: PaletteFieldKey; label: string; description: string }> = [
    { key: 'background', label: '頁面背景', description: '控制主要內容區的大面積底色。' },
    { key: 'surface', label: '卡片表面', description: '控制卡片與面板的底色層級。' },
    { key: 'toolbar', label: '頂部工具列', description: '控制 app toolbar 與標題列主色。' },
    { key: 'sidebar', label: '側欄背景', description: '控制導覽列與 footer 色調。' },
    { key: 'accent', label: '強調色', description: '控制啟用態、按鈕與標記重點色。' },
    { key: 'textPrimary', label: '主要文字', description: '控制版面主要文字與對比。' }
  ];

  readonly workspaceForm = this.formBuilder.nonNullable.group({
    emailDigest: true,
    weeklyReviewDay: 'Friday',
    defaultLandingPage: 'dashboard',
    compactMode: false,
    appearancePreset: 'ocean-balance',
    palette: this.formBuilder.nonNullable.group({
      background: '#F4F7FB',
      surface: '#FFFFFF',
      toolbar: '#2F5D7C',
      sidebar: '#17324D',
      accent: '#4C9F70',
      textPrimary: '#16202A'
    })
  });
  readonly paletteForm = this.workspaceForm.controls.palette;

  constructor() {
    const workspacePreferences = this.settingsService.settings().workspacePreferences;

    this.workspaceForm.patchValue(workspacePreferences, { emitEvent: false });
    this.activePreset.set(workspacePreferences.appearancePreset);
    this.palettePreview.set(this.workspaceForm.controls.palette.getRawValue());

    this.workspaceForm.controls.palette.valueChanges
      .pipe(startWith(this.workspaceForm.controls.palette.getRawValue()), takeUntilDestroyed())
      .subscribe(palette => {
        this.palettePreview.set({
          background: palette.background ?? '#F4F7FB',
          surface: palette.surface ?? '#FFFFFF',
          toolbar: palette.toolbar ?? '#2F5D7C',
          sidebar: palette.sidebar ?? '#17324D',
          accent: palette.accent ?? '#4C9F70',
          textPrimary: palette.textPrimary ?? '#16202A'
        });
      });
  }

  applyPreset(preset: ColorPreset): void {
    this.workspaceForm.patchValue({
      appearancePreset: preset.id,
      palette: preset.palette
    });
    this.activePreset.set(preset.id);
    this.persistWorkspaceSettings();
    this.validationMessage.set(`已套用 ${preset.label}`);
  }

  applyCustomPalette(): void {
    this.activePreset.set('custom');
    this.workspaceForm.patchValue({ appearancePreset: 'custom' });
    this.persistWorkspaceSettings();
    this.validationMessage.set('已套用自訂配色');
  }

  validateConfig(): void {
    try {
      this.settingsSearchService.validateWorkspaceConfig(this.workspaceForm.getRawValue());
      this.validationMessage.set('設定格式有效');
    } catch (error) {
      this.validationMessage.set(error instanceof Error ? error.message : '設定格式無效');
    }
  }

  previewStyle(): Record<string, string> {
    const palette = this.palettePreview();
    return {
      '--preview-background': palette.background,
      '--preview-surface': palette.surface,
      '--preview-toolbar': palette.toolbar,
      '--preview-sidebar': palette.sidebar,
      '--preview-accent': palette.accent,
      '--preview-text': palette.textPrimary
    };
  }

  private persistWorkspaceSettings(): void {
    this.settingsService.updateWorkspacePreferences(this.workspaceForm.getRawValue());
  }
}