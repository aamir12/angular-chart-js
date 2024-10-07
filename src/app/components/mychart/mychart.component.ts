import {  Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables, ChartConfiguration, ChartTypeRegistry, LayoutPosition } from 'chart.js';
import { MasterService } from '../../services/master.service';
import { Sales } from '../../_model/sales';
import { generateUniqueId } from '../../utils/common';
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
  canvasId: string = generateUniqueId();
  @ViewChild('chartElementRef', {static: true}) chartElementRef!: ElementRef<HTMLCanvasElement>
  constructor(private servicee: MasterService) {}

  ngOnInit(): void {
    this.loadChartData();
  }

  loadChartData() {
    // this.loadDoughnutChart();
    this.loadDoughnutChartWithTargetPointer();
    // this.servicee.loadSales().subscribe((data) => {
    //   this.chartData = data;
    //   if(this.chartData !== null) {
    //     this.chartData.map(data => {
    //       this.labelData.push(data.year);
    //       this.realData.push(data.amount);
    //       this.colorData.push(data.colorcode);
    //     });
    //     this.loadBarChart(this.labelData, this.realData, this.colorData);
    //   }
    // })
  }

  // loadBarChart(labelData: number[], valueData: number[], colorData: string[]) {
  //   const mychart = new Chart('barChart', {
  //     type: 'bar',
  //     data: {
  //       labels: labelData,
  //       datasets: [
  //         {
  //           label: 'Sales',
  //           data: valueData,
  //           backgroundColor: colorData
  //         }
  //       ]
  //     },
  //     options:{
  //       scales: {
  //         y: {
  //           beginAtZero: true
  //         }
  //       }
  //     }
  //   })
  // }


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
        // aspectRatio: 2,
      },
      plugins: [gaugeNeedle],
    };

    // Render the chart
    new Chart('dognutChart', config);
  }

  loadDoughnutChartWithTargetPointer() {
    const chartType = 'doughnut' as keyof ChartTypeRegistry;
    const legendPosition = 'bottom' as LayoutPosition;
    // setup
    const data = {
      labels: ['Mon', 'Tue','Wed'],
      datasets: [
        {
          // label: 'Weekly Sales',
          data: [50, 95,25],
          backgroundColor: [
            'rgba(255, 26, 104, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
          ],
          borderColor: [
            'rgba(255, 26, 104, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
          ],
          borderWidth: 1,
          cutout: '90%',
          rotation: 270,
          circumference: 180,
        },
      ],
    };

    //pointer
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
        const datapointerPercentage = (pointerValue / totalSum) * 100;

        // console.log(totalValue);
        //text
        ctx.font = 'bold 25px sans-serif';
        ctx.fillStyle = pointerColor;
        ctx.textAlign = 'center';
        ctx.baseline = 'middle';
        // ctx.fillText(`${datapointerPercentage.toFixed(1)}`, xCenter, yCenter);
        ctx.fillText(`${pointerValue.toFixed(1)}`, xCenter, yCenter);
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText(`Base Index Number`, xCenter, yCenter + 20);

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
            enabled: false,
          },
          doughnutPointer: {
            pointerValue: 30,
            pointerColor: 'black',
            pointerRadius: 5,
          },
        },
      },
      plugins: [doughnutPointer],
    };

    const myChart = new Chart(this.chartElementRef.nativeElement, config);
  }
}
