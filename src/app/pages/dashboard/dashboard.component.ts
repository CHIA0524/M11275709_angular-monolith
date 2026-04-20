import { Component, OnInit, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { DashboardService, DashboardData } from '../../core/services/dashboard.service';
import { SettingsService } from '../../core/services/settings.service';
import { CurrencyService } from '../../core/services/currency.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    FormsModule,
    NgxEchartsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  isLoading = true;
  dashboardData: DashboardData | null = null;
  fullAssetTrends: any[] = [];
  selectedMonth: string = ''; // 當前選中的月份
  selectedMonthLabel: string = '本月'; // 圓餅圖顯示的標籤
  isCurrentMonth: boolean = true; // 是否為當前月份
  
  // 原始數據保存 (TWD)
  rawDashboardData: DashboardData | null = null;
  
  currentCurrency: string = 'TWD';
  exchangeRate: number = 1;

  private settingsService = inject(SettingsService);
  private currencyService = inject(CurrencyService);

  currentMonthData: any = {
    totalAssets: 0,
    monthlyIncome: 0,
    monthlyExpense: 0,
    netWorth: 0
  };
  
  // 圖表選項
  assetTrendChartOption: EChartsOption = {};
  expenseChartOption: EChartsOption = {};

  // 日期範圍
  dateRangeGroup = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null)
  });

  minDate: Date;
  maxDate: Date;

  // Chart type control
  showLineChart = true;
  showBarChart = false;
  
  // Theme-aware colors
  chartTextColor = '#333';
  chartGridColor = '#eee';
  chartTooltipBg = '#fff';
  chartTooltipText = '#333';

  statCardStyles = [
    { title: '總資產', icon: 'account_balance', bgColor: 'var(--color-blue-bg)', iconColor: 'var(--color-blue-fg)', dataKey: 'totalAssets' },
    { title: '月收入', icon: 'trending_up', bgColor: 'var(--color-green-bg)', iconColor: 'var(--color-green-fg)', dataKey: 'monthlyIncome' },
    { title: '月支出', icon: 'trending_down', bgColor: 'var(--color-orange-bg)', iconColor: 'var(--color-orange-fg)', dataKey: 'monthlyExpense' },
    { title: '淨值', icon: 'savings', bgColor: 'var(--color-purple-bg)', iconColor: 'var(--color-purple-fg)', dataKey: 'netWorth' }
  ];

  constructor(private dashboardService: DashboardService) {
    const now = new Date();
    this.maxDate = now;
    const min = new Date(now);
    min.setFullYear(now.getFullYear() - 3);
    this.minDate = min;

    // 監聽設定變更
    effect(() => {
      const settings = this.settingsService.settings();
      
      // Update Chart Colors based on theme
      const isDark = settings.theme === 'dark';
      this.chartTextColor = isDark ? '#e0e0e0' : '#333';
      this.chartGridColor = isDark ? '#444' : '#eee';
      this.chartTooltipBg = isDark ? '#333' : '#fff';
      this.chartTooltipText = isDark ? '#fff' : '#333';

      // Refresh charts if data is loaded
      if (this.fullAssetTrends.length > 0) {
        this.filterData();
        if (this.selectedMonth) {
          this.updateExpenseChart(this.selectedMonth);
        }
      }

      if (settings.defaultCurrency !== this.currentCurrency) {
        this.currentCurrency = settings.defaultCurrency;
        this.updateCurrencyAndRefresh();
      }
    });
  }

  ngOnInit(): void {
    this.currentCurrency = this.settingsService.settings().defaultCurrency;
    this.loadDashboardData();
  }

  updateCurrencyAndRefresh() {
    this.isLoading = true;
    this.currencyService.getRates('TWD').subscribe({
      next: (ratesData) => {
        this.exchangeRate = (this.currentCurrency === 'TWD') ? 1 : (ratesData.rates[this.currentCurrency] || 1);
        if (this.rawDashboardData) {
          this.processData(this.rawDashboardData);
        } else {
          this.loadDashboardData();
        }
        this.isLoading = false;
      },
      error: () => {
        this.exchangeRate = 1;
        this.isLoading = false;
        if (this.rawDashboardData) this.processData(this.rawDashboardData);
      }
    });
  }

  loadDashboardData(): void {
    this.isLoading = true;
    
    // 依序取得匯率 -> 取得 Dashboard 資料
    this.currencyService.getRates('TWD').pipe(
      switchMap(ratesData => {
        this.exchangeRate = (this.currentCurrency === 'TWD') ? 1 : (ratesData.rates[this.currentCurrency] || 1);
        return this.dashboardService.getDashboardData();
      })
    ).subscribe({
      next: (response) => {
        try {
          if (response.rtnCode === '000000' && response.data) {
            this.rawDashboardData = response.data; // 儲存原始資料
            this.processData(this.rawDashboardData);
          }
        } catch (error) {
          console.error('Error processing dashboard data:', error);
        } finally {
          this.isLoading = false;
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  processData(data: DashboardData) {
    if (!data) return;

    // 深拷貝並轉換 - 確保使用最新匯率
    const converted = JSON.parse(JSON.stringify(data));
    const rate = this.exchangeRate;

    console.log(`Processing data with rate: ${rate} for currency: ${this.currentCurrency}`);

    // 轉換主要數值
    if (typeof converted.totalAssets === 'number') converted.totalAssets *= rate;
    if (typeof converted.monthlyIncome === 'number') converted.monthlyIncome *= rate;
    if (typeof converted.monthlyExpense === 'number') converted.monthlyExpense *= rate;
    if (typeof converted.netWorth === 'number') converted.netWorth *= rate;

    // 轉換趨勢資料
    if (Array.isArray(converted.assetTrends)) {
      converted.assetTrends = converted.assetTrends.map((t: any) => {
        const result = {
          ...t,
          totalAssets: (typeof t.totalAssets === 'number' ? t.totalAssets : 0) * rate,
          monthlyIncome: (typeof t.monthlyIncome === 'number' ? t.monthlyIncome : 0) * rate,
          monthlyExpense: (typeof t.monthlyExpense === 'number' ? t.monthlyExpense : 0) * rate,
          netWorth: (typeof t.netWorth === 'number' ? t.netWorth : 0) * rate,
          cash: (typeof t.cash === 'number' ? t.cash : 0) * rate,
          investment: (typeof t.investment === 'number' ? t.investment : 0) * rate,
          property: (typeof t.property === 'number' ? t.property : 0) * rate
        };

        if (Array.isArray(t.expenseBreakdown)) {
          result.expenseBreakdown = t.expenseBreakdown.map((e: any) => ({
            ...e,
            amount: (typeof e.amount === 'number' ? e.amount : 0) * rate
          }));
        }
        return result;
      });
    }

    // 轉換分類支出 (如果 root 有這個欄位)
    if (Array.isArray(converted.expenseBreakdown)) {
      converted.expenseBreakdown = converted.expenseBreakdown.map((e: any) => ({
        ...e,
        amount: (typeof e.amount === 'number' ? e.amount : 0) * rate
      }));
    }

    this.dashboardData = converted;
    this.fullAssetTrends = converted.assetTrends || [];

    // 重新初始化畫面邏輯
    this.initViewLogic();
  }

  initViewLogic() {
    if (!this.fullAssetTrends || this.fullAssetTrends.length === 0) return;

    const now = new Date();
    // 簡單格式化 YYYY-MM
    const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    // 嘗試找當月，否則找最後一筆
    // 注意: mock data date 格式可能是 YYYY-MM-DD 或 YYYY-MM，需視 data.json 而定
    // 這裡假設 mock data 裡的 assetTrends 是 YYYY-MM 格式
    const currentMonth = this.fullAssetTrends.find(t => t.date === currentMonthStr);
    const defaultMonth = currentMonth || this.fullAssetTrends[this.fullAssetTrends.length - 1];
    
    if (defaultMonth) {
      this.selectedMonth = defaultMonth.date;
      this.selectedMonthLabel = defaultMonth.date;
      this.isCurrentMonth = defaultMonth.date === currentMonthStr;
      this.updateCurrentMonthData(defaultMonth);
    }
    
    // 確保日期範圍選擇器有值
    if (!this.dateRangeGroup.value.start) {
        this.setQuickRange('6months');
    } else {
        // 如果已經有選定範圍，重新過濾圖表即可
        this.filterData();
    }
    
    this.updateExpenseChart(this.selectedMonth);
  }


  updateCurrentMonthData(monthData: any): void {
    this.currentMonthData = {
      totalAssets: monthData.totalAssets || 0,
      monthlyIncome: monthData.monthlyIncome || 0,
      monthlyExpense: monthData.monthlyExpense || 0,
      netWorth: monthData.netWorth || 0
    };
  }

  setQuickRange(range: string): void {
    const end = new Date();
    const start = new Date();

    switch(range) {
      case '6months':
        start.setMonth(end.getMonth() - 6);
        break;
      case '1year':
        start.setFullYear(end.getFullYear() - 1);
        break;
      case '2years':
        start.setFullYear(end.getFullYear() - 2);
        break;
      case '3years':
        start.setFullYear(end.getFullYear() - 3);
        break;
    }

    this.dateRangeGroup.patchValue({
      start: start,
      end: end
    });

    this.filterData();
  }

  onMonthSelected(date: Date, field: 'start' | 'end', picker: any): void {
    const selectedDate = new Date(date);
    selectedDate.setDate(1); // 設定為月份的第一天
    this.dateRangeGroup.patchValue({ [field]: selectedDate });
    picker.close();
    this.filterData();
  }

  onChartTypeChange(type: 'line' | 'bar'): void {
    // 使用 setTimeout 確保 ngModel 更新完成後再檢查狀態
    setTimeout(() => {
      if (!this.showLineChart && !this.showBarChart) {
        if (type === 'line') {
          this.showBarChart = true;
        } else {
          this.showLineChart = true;
        }
      }
      this.filterData();
    });
  }

  filterData(): void {
    const start = this.dateRangeGroup.value.start;
    const end = this.dateRangeGroup.value.end;

    if (!start || !end || !this.fullAssetTrends) return;

    const startStr = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`;
    const endStr = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}`;

    const filtered = this.fullAssetTrends.filter(t => t.date >= startStr && t.date <= endStr);
    
    if (filtered.length === 0) {
      return;
    }

    this.initAssetChart(filtered);
  }

  initAssetChart(trends: any[]): void {
    const seriesData: any[] = [];
    
    // 長條圖系列 (先加入以顯示在折線圖下方)
    if (this.showBarChart) {
      seriesData.push(
        {
          name: '總資產',
          type: 'bar',
          data: trends.map(t => t.totalAssets),
          itemStyle: { color: '#5470c6', opacity: this.showLineChart ? 0.3 : 1 }
        },
        {
          name: '現金',
          type: 'bar',
          data: trends.map(t => t.cash),
          itemStyle: { color: '#91cc75', opacity: this.showLineChart ? 0.3 : 1 }
        },
        {
          name: '投資',
          type: 'bar',
          data: trends.map(t => t.investment),
          itemStyle: { color: '#fac858', opacity: this.showLineChart ? 0.3 : 1 }
        },
        {
          name: '不動產',
          type: 'bar',
          data: trends.map(t => t.property),
          itemStyle: { color: '#ee6666', opacity: this.showLineChart ? 0.3 : 1 }
        }
      );
    }
    
    // 折線圖系列
    if (this.showLineChart) {
      seriesData.push(
        {
          name: '總資產',
          type: 'line',
          smooth: true,
          data: trends.map(t => t.totalAssets),
          itemStyle: { color: '#5470c6' },
          areaStyle: { opacity: 0.1 }, // 降低區域透明度以避免遮擋長條圖
          markPoint: {
            data: [
              {
                name: '選中月份',
                coord: [trends.findIndex(t => t.date === this.selectedMonth), 
                        trends.find(t => t.date === this.selectedMonth)?.totalAssets || 0],
                itemStyle: {
                  color: '#ff4081',
                  borderColor: '#fff',
                  borderWidth: 2
                },
                symbolSize: 12
              }
            ]
          }
        },
        {
          name: '現金',
          type: 'line',
          smooth: true,
          data: trends.map(t => t.cash),
          itemStyle: { color: '#91cc75' }
        },
        {
          name: '投資',
          type: 'line',
          smooth: true,
          data: trends.map(t => t.investment),
          itemStyle: { color: '#fac858' }
        },
        {
          name: '不動產',
          type: 'line',
          smooth: true,
          data: trends.map(t => t.property),
          itemStyle: { color: '#ee6666' }
        }
      );
    }

    // 淨資產趨勢圖表配置
    this.assetTrendChartOption = {
      title: {
        text: '淨資產趨勢',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'normal',
          color: this.chartTextColor
        }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: this.chartTooltipBg,
        borderColor: this.chartGridColor,
        textStyle: { color: this.chartTooltipText },
        formatter: (params: any) => {
          let result = `${params[0].axisValue}<br/>`;
          // 過濾重複的系列名稱 (因為可能同時顯示折線和長條)
          const distinctSeries = new Set();
          params.forEach((item: any) => {
            if (!distinctSeries.has(item.seriesName)) {
               distinctSeries.add(item.seriesName);
               result += `${item.marker}${item.seriesName}: ${this.formatCurrency(item.value)}<br/>`;
            }
          });
          return result;
        }
      },
      legend: {
        data: [
          { name: '總資產', icon: 'circle' },
          { name: '現金', icon: 'circle' },
          { name: '投資', icon: 'circle' },
          { name: '不動產', icon: 'circle' }
        ],
        bottom: 0,
        selected: this.legendState,
        textStyle: { color: this.chartTextColor }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true,
        borderColor: this.chartGridColor
      },
      xAxis: {
        type: 'category',
        boundaryGap: this.showBarChart, // 顯示長條圖時要有間距
        data: trends.map(t => t.date),
        axisLabel: { color: this.chartTextColor },
        axisLine: { lineStyle: { color: this.chartGridColor } }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: this.chartTextColor,
          formatter: (value: number) => {
             // 分離幣別代碼與符號
             const symbol = this.getCurrencySymbol(this.currentCurrency);
             return `${symbol} ${(value / 10000).toFixed(0)}萬`;
          }
        },
        splitLine: { lineStyle: { color: this.chartGridColor } }
      },
      series: seriesData
    };
  }
  
  getCurrencySymbol(currency: string): string {
    return (0).toLocaleString('zh-TW', { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 })
              .replace(/\d/g, '').trim();
  }

  updateExpenseChart(monthStr: string): void {
    if (!this.fullAssetTrends || this.fullAssetTrends.length === 0) return;

    // 找到對應月份的支出資料
    const monthData = this.fullAssetTrends.find(t => t.date === monthStr);
    if (!monthData || !monthData.expenseBreakdown) return;

    this.selectedMonth = monthStr;
    this.selectedMonthLabel = monthStr;

    // 定義明確不同的顏色
    const categoryColors: { [key: string]: string } = {
      '飲食': '#FF6384',     // 粉紅
      '交通': '#36A2EB',     // 藍色
      '娛樂': '#FFCE56',     // 黃色
      '購物': '#4BC0C0',     // 青色
      '醫療': '#9966FF',     // 紫色
      '教育': '#FF9F40',     // 橘色
      '其他': '#C9CBCF'      // 灰色
    };

    // 每月收支圓餅圖
    this.expenseChartOption = {
      title: {
        text: `${monthStr} 支出分類`,
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'normal',
          color: this.chartTextColor
        }
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: this.chartTooltipBg,
        borderColor: this.chartGridColor,
        textStyle: { color: this.chartTooltipText },
        formatter: (params: any) => {
            return `${params.name}: <br/>${this.formatCurrency(params.value)} (${params.percent}%)`;
        }
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'middle',
        textStyle: { color: this.chartTextColor },
        formatter: (name: string) => {
          const item = monthData.expenseBreakdown.find((e: any) => e.category === name);
          return `${name}: ${item?.percentage.toFixed(1)}%`;
        }
      },
      series: [
        {
          name: '支出',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: this.chartTooltipBg,
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center',
            color: this.chartTextColor
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 18,
              fontWeight: 'bold',
              color: this.chartTextColor,
              formatter: (params: any) => {
                  return `${params.name}\n${this.formatCurrency(params.value)}`;
              }
            }
          },
          labelLine: {
            show: false
          },
          data: monthData.expenseBreakdown.map((e: any) => ({
            value: e.amount,
            name: e.category,
            itemStyle: {
              color: categoryColors[e.category] || '#999'
            }
          }))
        }
      ]
    };
  }

  // 儲存圖例選中狀態
  legendState: { [key: string]: boolean } = {};

  onLegendSelectChanged(event: any): void {
    this.legendState = event.selected;
  }

  onChartClick(event: any): void {
    // 處理圖表點擊事件，當點擊 X 軸時更新圓餅圖
    if (event.componentType === 'xAxis') {
      const monthStr = event.value;
      this.selectMonth(monthStr);
    } else if (event.componentType === 'series' && event.seriesType === 'line') {
      // 點擊線條上的點
      const monthStr = event.name;
      this.selectMonth(monthStr);
    }
  }

  selectMonth(monthStr: string): void {
    const monthData = this.fullAssetTrends.find(t => t.date === monthStr);
    if (!monthData) return;

    this.selectedMonth = monthStr;
    this.selectedMonthLabel = monthStr;
    
    // 判斷是否為當前月份
    const now = new Date();
    const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    this.isCurrentMonth = monthStr === currentMonthStr;
    
    this.updateCurrentMonthData(monthData);
    this.updateExpenseChart(monthStr);
    
    // 重新渲染折線圖以更新標記點
    this.filterData();
  }

  viewLatestMonth(): void {
    // 取得當前月份
    const now = new Date();
    const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    // 找到當前月份的資料
    const currentMonth = this.fullAssetTrends.find(t => t.date === currentMonthStr);
    
    // 如果找到當前月份就使用，否則使用最新月份
    if (currentMonth) {
      this.selectMonth(currentMonthStr);
    } else {
      const latestMonth = this.fullAssetTrends[this.fullAssetTrends.length - 1];
      if (latestMonth) {
        this.selectMonth(latestMonth.date);
      }
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: this.currentCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }
}

