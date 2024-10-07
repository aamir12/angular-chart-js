import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GaugeChartComponent } from './components/gauge-chart/gauge-chart.component';
import { GaugeNeedleChartComponent } from './components/gauge-needle-chart/gauge-needle-chart.component';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';

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
  
  async generatePdf(chartElement: HTMLCanvasElement) {
    const canvas = await html2canvas(chartElement, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    // Save the image as a PDF
    const originalWidth = canvas.width;
    const originalHeight = canvas.height;

    // Define a maximum width or height for the PDF (e.g., 500px)
    const maxWidth = 300;
    const maxHeight = 300;

    // Calculate the aspect ratio
    const aspectRatio = originalWidth / originalHeight;

    // Calculate the scaled dimensions
    let scaledWidth = originalWidth;
    let scaledHeight = originalHeight;

    if (originalWidth > maxWidth) {
      scaledWidth = maxWidth;
      scaledHeight = maxWidth / aspectRatio;
    }

    if (scaledHeight > maxHeight) {
      scaledHeight = maxHeight;
      scaledWidth = maxHeight * aspectRatio;
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      // format: [scaledWidth, scaledHeight],
    });

    // Add the image to the PDF with the scaled dimensions
    pdf.addImage(imgData, 'PNG', 0, 0, scaledWidth, scaledHeight);
    pdf.save('chart.pdf'); // Download the PDF with the specified file name
    
  }

  async exportChartToPDF(chartElement: HTMLCanvasElement): Promise<void> {

    // const addHeader = (doc: jsPDF) => {
    //   doc.setFontSize(12);
    //   doc.setTextColor(100);
    //   doc.text('Sales Report - Company Name', 10, 10); // Adjust position as needed
    //   doc.setLineWidth(0.5);
    //   doc.line(10, 15, doc.internal.pageSize.getWidth() - 10, 15); // Draw a line below the header
    // };

    const canvas = await html2canvas(chartElement, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
  
    // Original dimensions of the chart
    const originalWidth = canvas.width;
    const originalHeight = canvas.height;

    // Define a maximum width for scaling (to keep it fitting well in the PDF)
    const maxWidth = 180; // PDF page width in mm is usually 210mm for A4 size, leaving margins
    const aspectRatio = originalWidth / originalHeight;
    const scaledWidth = maxWidth;
    const scaledHeight = maxWidth / aspectRatio;

    // Create a new PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4', // A4 paper size
    });

    // Add page title
    pdf.setFontSize(18);
    pdf.text('Sales Report', pdf.internal.pageSize.getWidth() / 2, 20, {
      align: 'center',
    });

    // Calculate the center position for the image
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imageX = (pageWidth - scaledWidth) / 2; // Center the image horizontally
    const imageY = 40; // Position below the title

    // addHeader(pdf);
    // Add the chart image centered on the page
    pdf.addImage(imgData, 'PNG', imageX, imageY, scaledWidth, scaledHeight);

    // Add a new page for the table data
    pdf.addPage();

    // addHeader(pdf);
    // Add a heading for the table
    pdf.setFontSize(16);
    pdf.text('Sales Data Table', pdf.internal.pageSize.getWidth() / 2, 20, {
      align: 'center',
    });

    // Define table data
    const tableData = [
      ['Product', 'Sales', 'Profit'],
      ['Product 1', '200', '50'],
      ['Product 2', '300', '80'],
      ['Product 3', '150', '30'],
    ];

    // Define table columns
    const tableColumns = ['Product', 'Sales', 'Profit'];

    // Use jsPDF autoTable plugin to add the table on the new page
    autoTable(pdf,{
      startY: 30, // Position the table below the heading
      head: [tableColumns],
      body: tableData,
      theme: 'striped', // Optional: 'striped', 'grid', 'plain'
      margin: { top: 20 },
    });

    // Save the PDF with the specified file name
    pdf.save('sales-report.pdf');

  }
  
}
