import {  AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, registerables, ChartTypeRegistry, ChartConfiguration } from 'chart.js';
Chart.register(...registerables);

@Component({
  standalone: true,
  selector: 'app-gauge-needle-chart',
  templateUrl: './gauge-needle-chart.component.html',
  imports: [],
})
export class GaugeNeedleChartComponent implements AfterViewInit, OnChanges, OnDestroy{
  @ViewChild('chartElementRef', {static: true}) chartElementRef!: ElementRef<HTMLCanvasElement>

  @Input() data: number[] = [];
  @Input() colors: string[] = [];
  @Input() labels: string[] = [];
  @Input() value: number = 0;
  @Input() chartText: string = '';
  @Input() pointerColor: string = 'black';
  @Input() chartTextFont: string = '15px';
  @Input() chartValueFont: string = '25px';
  chart: Chart | undefined;
  @Input() showTooltip = false;

  ngAfterViewInit(): void {
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['data'] || changes['value']) {
      this.renderChart();
    }
  }

  renderChart(): void {
    const chartValueFont = this.chartValueFont;
    const chartType = 'doughnut' as keyof ChartTypeRegistry;
    // Setup the chart data
    const data = {
      labels: this.labels,
      datasets: [
        {
          label: 'Weekly Sales',
          data: this.data,
          backgroundColor: this.colors,
          needleValue: this.value,
          borderColor: 'white',
          borderWidth: 2,
          cutout: '90%', //width of bar
          circumference: 180,
          rotation: 270,
          borderRadius: 5,
        },
      ],
    };

    // Plugin for needle gauge
    const gaugeNeedle = {
      id: 'gaugeNeedle',
      afterDatasetDraw(chart: any, args: any, options: any) {
        const {
          ctx,
          data,
          chartArea: { width, height },
        } = chart;

        ctx.save();
        const dataTotal = data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
        const needleValue = data.datasets[0].needleValue;
        // const angle = Math.PI + (1 / dataTotal) * needleValue * Math.PI;
        const angle = (needleValue / dataTotal) * Math.PI;

        const cx = width / 2;
        const cy = chart._metasets[0].data[0].y;
        // Draw the needle
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        // ctx.rotate(angle * targetPointRotation);
        ctx.beginPath();
        ctx.moveTo(0, -2);
        // ctx.lineTo(height - (ctx.canvas.offsetTop + 10), 0);
        ctx.lineTo(height - (ctx.canvas.offsetTop + 100), 0); //needle height
        ctx.lineTo(0, 2);
        ctx.fillStyle = '#444';
        ctx.fill();
        ctx.restore();

        // Needle dot
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Display needle value
        ctx.font = `${chartValueFont} Helvetica`;
        ctx.fillStyle = '#444';
        ctx.fillText(needleValue, cx, cy + 50);
        ctx.textAlign = 'center';
        ctx.restore();
      },
    };
    
    // Chart configuration
    const config: ChartConfiguration = {
      type: chartType,
      data,
      options: {
        plugins: {
          legend: { display: false },
          tooltip: { yAlign: 'bottom', displayColors: false, enabled: this.showTooltip },
        },
        // aspectRatio: 2,
      },
      plugins: [gaugeNeedle],
    };

    // Render the chart
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart(this.chartElementRef.nativeElement, config);
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
