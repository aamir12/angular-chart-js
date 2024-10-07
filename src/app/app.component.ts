import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GaugeChartComponent } from './components/gauge-chart/gauge-chart.component';
import { GaugeNeedleChartComponent } from './components/gauge-needle-chart/gauge-needle-chart.component';

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
  ngOnInit(): void {
    // setTimeout(() => {
    //   console.log(this.gaugeChart2.chartElementRef.nativeElement.toDataURL('image/jpeg',1.0));

    // },1000);
  }
}
