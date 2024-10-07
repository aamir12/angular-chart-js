import {  AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, registerables, ChartTypeRegistry } from 'chart.js';
Chart.register(...registerables);

@Component({
  standalone: true,
  selector: 'app-gauge-chart',
  templateUrl: './gauge-chart.component.html',
  imports: [],
})
export class GaugeChartComponent implements AfterViewInit, OnChanges, OnDestroy{
  @ViewChild('chartElementRef', {static: true}) chartElementRef!: ElementRef<HTMLCanvasElement>

  @Input() data: number[] = [];
  @Input() colors: string[] = [];
  @Input() labels: string[] = [];
  @Input() value: number = 0;
  @Input() chartText: string = '';
  @Input() pointerColor: string = 'black';
  @Input() chartTextFont: string = '12px';
  @Input() chartValueFont: string = '25px';
  @Input() showTooltip = false;
  chart: Chart | undefined;
  ngAfterViewInit(): void {
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['data'] || changes['value']) {
      this.renderChart();
    }
  }

  renderChart() {
    const chartType = 'doughnut' as keyof ChartTypeRegistry;
    // setup
    const data = {
      labels: this.labels,
      datasets: [
        {
          // label: 'Weekly Sales',
          data: this.data,
          backgroundColor: this.colors,
          borderColor: this.colors,
          borderWidth: 1,
          cutout: '90%',
          rotation: 270,
          circumference: 180,
        },
      ],
    };

    //pointer
    const chartTextFont = this.chartTextFont;
    const chartValueFont = this.chartValueFont;
    const chartText = this.chartText;
    const doughnutPointer = {
      id: 'doughnutPointer',
      afterDatasetDraw(chart:any, args:any, plugins:any) {
        const { ctx, data } = chart;
        ctx.save();

        const xCenter = chart.getDatasetMeta(0).data[0].x;
        const yCenter = chart.getDatasetMeta(0).data[0].y;
        const innerRadius = chart.getDatasetMeta(0).data[0].innerRadius;
        const outerRadius = chart.getDatasetMeta(0).data[0].outerRadius;
        const doughnutThickness = outerRadius - innerRadius;

        const pointerColor = plugins.pointerColor || 'black';

        const pointerValue = plugins.pointerValue || 0;

        const pointerRadius = plugins.pointerRadius || 0;
        const angle = Math.PI / 180;

        //total value
        function sumArray(arr:any[]) {
          return arr.reduce((acc, current) => acc + current, 0);
        }

        const dataPointerArray = data.datasets[0].data.map((datapoint:any) => {
          return datapoint;
        });

        const totalSum = sumArray(dataPointerArray);
        const targetPointRotation = (pointerValue / totalSum) * 180 - 90;
        // const datapointerPercentage =
        //   (data.datasets[0].data[0] / totalSum) * 100;
        // const datapointerPercentage = (pointerValue / totalSum) * 100;

        // console.log(totalValue);
        //text
        ctx.font = `bold ${chartValueFont} sans-serif`;
        ctx.fillStyle = pointerColor;
        ctx.textAlign = 'center';
        ctx.baseline = 'middle';
        // ctx.fillText(`${datapointerPercentage.toFixed(1)}`, xCenter, yCenter);
        ctx.fillText(`${pointerValue.toFixed(1)}`, xCenter, yCenter);
        ctx.font = `bold ${chartTextFont} sans-serif`;
        ctx.fillText(chartText, xCenter, yCenter + 18);

        //pointer
        ctx.translate(xCenter, yCenter);
        ctx.rotate(angle * targetPointRotation);

        ctx.beginPath();
        ctx.fillStyle = pointerColor;
        ctx.roundRect(
          0 - 2.5,
          -outerRadius - 10,
          5,
          doughnutThickness + 20,
          pointerRadius
        );
        ctx.fill();
        ctx.restore();
      },
    };

    // config
    const config = {
      type: chartType,
      data,
      options: {
        aspectRatio: 2,
        layout: {
          padding: 20,
        },
        scales: {
          // y: {
          //   beginAtZero: true,
          // },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: this.showTooltip,
          },
          doughnutPointer: {
            pointerValue: this.value,
            pointerColor: this.pointerColor,
            pointerRadius: 5,
          },
        },
      },
      plugins: [doughnutPointer],
    };

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
