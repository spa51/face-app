import { Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FaceApiService } from '../face-api.service';
import { VideoPlayerService } from '../video-player.service';
import { every } from 'rxjs';


@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement: ElementRef;
  @Input() stream: any;
  @Input() width: number;
  @Input() height: number;
  modelsReady: boolean;
  listEvents: Array<any> = [];
  overCanvas:any;

  constructor(private renderer2: Renderer2, 
    private elementRef: ElementRef, 
    private faceApiService:FaceApiService,
    private videoPlayerService:VideoPlayerService){
  
  }
  ngOnInit(): void {
    this.listenerEvents();
  
  }
  ngOnDestroy(): void {
      this.listEvents.forEach(event => event.unsubscribe());  
  }

  listenerEvents = () => {
    const observer1$ = this.faceApiService.cbModels.subscribe(res => {
      //todo
      this.modelsReady = true;
      this.checkFace();
    });
    const observer2$ = this.videoPlayerService.cbAi
    .subscribe(({resizedDetections, displaySize, expressions, eyes}) => {
    });
    this.listEvents= [observer1$, observer2$]
  };
  

  checkFace = () => {
    setInterval(async () => {
      await this.videoPlayerService.getLandMark(this.videoElement);
    }, 100);
  };
  
  loadedMetaData(): void{
      this.videoElement.nativeElement.play();
    }

    listenerPlay(): void{
      const {globalFace} = this.faceApiService;
      this.overCanvas = globalFace.createCanvasFromMedia(this.videoElement.nativeElement);
      this.renderer2.setProperty(this.overCanvas, 'id', 'new-canvas-over');
      this.renderer2.appendChild(this.elementRef.nativeElement, this.overCanvas);
    }
  }





