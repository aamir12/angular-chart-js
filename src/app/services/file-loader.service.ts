import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileLoaderService {
  loadChartjs = new BehaviorSubject<boolean>(false);

  constructor(
    @Inject(DOCUMENT) private document: Document,
  ) { }

  
  loadJSFile(renderer2:Renderer2) {
    if( this.loadChartjs.value ) {
      return;
    }
    const scriptElement = renderer2.createElement('script') as HTMLScriptElement;
    renderer2.appendChild(this.document.head, scriptElement);
    renderer2.setProperty(scriptElement, 'id', 'zingchart');
    renderer2.setProperty(scriptElement, 'src', `https://cdn.zingchart.com/zingchart.min.js`);
    scriptElement.onload = () => {
      this.loadChartjs.next(true);
    }
    scriptElement.onerror = () => {
      this.loadChartjs.next(false);
    }
  }

  
}