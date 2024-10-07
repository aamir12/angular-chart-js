import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GaugeChartComponent } from './components/gauge-chart/gauge-chart.component';
import { GaugeNeedleChartComponent } from './components/gauge-needle-chart/gauge-needle-chart.component';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,GaugeChartComponent,GaugeNeedleChartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  colors = [
    'rgba(255, 26, 104, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
  ];

  @ViewChild('gaugeChart2', {static: true}) gaugeChart2!: GaugeChartComponent;
  
  async generatePdf() {
    const chartElement = this.gaugeChart2.chartElementRef.nativeElement;
    const canvas = await html2canvas(chartElement, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait', // or 'portrait' based on your preference
      // unit: 'px',
      // format: [canvas.width, canvas.height], // Adapt the format to fit the chart size
    });
    const imgWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save('chart.pdf'); // Download the PDF with the specified file name
  }
}
