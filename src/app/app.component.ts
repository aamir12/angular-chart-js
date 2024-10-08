import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GaugeChartComponent } from './components/gauge-chart/gauge-chart.component';
import { GaugeNeedleChartComponent } from './components/gauge-needle-chart/gauge-needle-chart.component';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';
import { FileLoaderService } from './services/file-loader.service';
declare const ZC:any;
declare const zingchart:any;
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,GaugeChartComponent,GaugeNeedleChartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  colors = [
    'rgba(255, 26, 104, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
  ];

  @ViewChild('gaugeChart2', {static: true}) gaugeChart2!: GaugeChartComponent;
  constructor(
    public fileLoader: FileLoaderService,
    public renderer2: Renderer2
  ) {}
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


  ngOnInit(): void {
    this.fileLoader.loadJSFile(this.renderer2);
    this.fileLoader.loadChartjs.subscribe((isLoaded) => {
      if(isLoaded) {
        this.drawChart();
      }
    })
  }

  drawChart() {
    ZC.LICENSE = ["569d52cefae586f634c54f86dc99e6a9", "b55b025e438fa8a98e32482b5f768ff5"];
    let feed = (callback:any) => {
      let tick: any = {};
      tick.plot0 = Math.ceil(350 + Math.random() * 500);
      callback(JSON.stringify(tick));
    };

    let chartConfig = {
      type: 'gauge',
      globals: {
        fontSize: '25px',
      },
      plot: {
        tooltip: {
          borderRadius: '5px',
        },
        valueBox: {
          text: '%v', // default
          fontSize: '35px',
          placement: 'center',
          // rules: [{
          //     text: '%v<br>EXCELLENT',
          //     rule: '%v >= 700',
          //   },
          //   {
          //     text: '%v<br>Good',
          //     rule: '%v < 700 && %v > 640',
          //   },
          //   {
          //     text: '%v<br>Fair',
          //     rule: '%v < 640 && %v > 580',
          //   },
          //   {
          //     text: '%v<br>Bad',
          //     rule: '%v <  580',
          //   },
          // ],
        },
        size: '100%',
      },
      plotarea: {
        marginTop: '80px',
      },
      scaleR: {
        aperture: 180,
        center: {
          visible: false,
        },
        item: {
          offsetR: 0,
          rules: [{
            offsetX: '15px',
            rule: '%i == 9',
          }, ],
        },
        labels: ['300', '', '', '', '', '', '580', '640', '700', '750', '', '850'],
        maxValue: 850,
        minValue: 300,
        ring: {
          rules: [{
              backgroundColor: '#E53935',
              rule: '%v <= 580',
            },
            {
              backgroundColor: '#EF5350',
              rule: '%v > 580 && %v < 640',
            },
            {
              backgroundColor: '#FFA726',
              rule: '%v >= 640 && %v < 700',
            },
            {
              backgroundColor: '#29B6F6',
              rule: '%v >= 700',
            },
          ],
          size: '30px',
        },
        // step: 50,
        tick: {
          visible: false,
        },
      },
      // refresh: {
      //   type: 'feed',
      //   url: 'feed()',
      //   interval: 1500,
      //   resetTimeout: 1000,
      //   transport: 'js',
      // },
      series: [{
        values: [755], // starting value
        animation: {
          effect: 'ANIMATION_EXPAND_VERTICAL',
          method: 'ANIMATION_BACK_EASE_OUT',
          sequence: 'null',
          speed: 900,
        },
        backgroundColor: 'black',
        indicator: [10, 10, 10, 10, 0.75],
      }, ],
    };

    zingchart.render({
      id: 'myChart',
      data: chartConfig,
      height: '100%',
      width: '100%',
    });
  }
  
}
