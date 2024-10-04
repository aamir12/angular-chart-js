import {  Component, OnInit } from '@angular/core';
import { Chart, registerables, ChartConfiguration, ChartTypeRegistry } from 'chart.js';
import { MasterService } from '../../services/master.service';
import { Sales } from '../../_model/sales';
Chart.register(...registerables);

@Component({
  selector: 'app-mychart',
  standalone: true,
  imports: [],
  templateUrl: './mychart.component.html',
  styleUrl: './mychart.component.scss'
})
export class MychartComponent implements OnInit{
  chartData: Sales[] = [];
  labelData: number[] = [];
  realData: number[] = [];
  colorData: string[] = [];

  constructor(private servicee: MasterService) {}

  ngOnInit(): void {
    this.loadChartData();
  }

  loadChartData() {
    this.servicee.loadSales().subscribe((data) => {
      this.chartData = data;
      if(this.chartData !== null) {
        this.chartData.map(data => {
          this.labelData.push(data.year);
          this.realData.push(data.amount);
          this.colorData.push(data.colorcode);
        });
        this.loadBarChart(this.labelData, this.realData, this.colorData);
        this.loadDoughnutChart();
      }
    })
  }

  loadBarChart(labelData: number[], valueData: number[], colorData: string[]) {
    const mychart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: labelData,
        datasets: [
          {
            label: 'Sales',
            data: valueData,
            backgroundColor: colorData
          }
        ]
      },
      options:{
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })
  }


  loadDoughnutChart(): void {
    const chartType = 'doughnut' as keyof ChartTypeRegistry;
    // Setup the chart data
    const data = {
      labels: ['Mon', 'Tue', 'Wed'],
      datasets: [
        {
          label: 'Weekly Sales',
          data: [18, 12, 6],
          backgroundColor: [
            'rgba(255, 26, 104, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
          ],
          needleValue: 20,
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
        const angle = Math.PI + (1 / dataTotal) * needleValue * Math.PI;

        const cx = width / 2;
        const cy = chart._metasets[0].data[0].y;
        // Draw the needle
        ctx.translate(cx, cy);
        ctx.rotate(angle);
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
        ctx.font = '50px Helvetica';
        ctx.fillStyle = '#444';
        ctx.fillText(needleValue + '%', cx, cy + 50);
        ctx.textAlign = 'center';
        ctx.restore();
      },
    };
    
    // Chart configuration
    const config:ChartConfiguration = {
      type: chartType,
      data,
      options: {
        plugins: {
          legend: { display: false },
          tooltip: { yAlign: 'bottom', displayColors: false },
        },
      },
      plugins: [gaugeNeedle],
    };

    // Render the chart
    new Chart('dognutChart', config);
  }
}
