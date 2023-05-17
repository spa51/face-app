import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { VideoPlayerService } from './video-player.service';
import { FaceApiService } from './face-api.service';
import * as _ from 'lodash';

interface ResizedDetections {
  expressions: { [key: string]: number };
}

interface VideoData {
  resizedDetections: ResizedDetections;
  displaySize: any;
  expressions: any;
  videoElement: any;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  public currentStream: MediaStream | null = null;
  public dimensionVideo: any;
  public emoji: string = "";
  listEvents: Array<any> = [];
  overCanvas: HTMLCanvasElement | null = null;
  listExpressions: { name: string, value: number }[] = [];

  constructor(
    private faceApiService: FaceApiService,
    private videoPlayerService: VideoPlayerService,
    private renderer2: Renderer2,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.listenerEvents();
    this.checkMediaSource();
    this.getSizeCam();
  }

  ngOnDestroy(): void {
    this.listEvents.forEach(event => event.unsubscribe());
  }

  listenerEvents = () => {
    const observer1$ = this.videoPlayerService.cbAi
      .subscribe(({ resizedDetections, displaySize, expressions, videoElement }: VideoData) => {
        resizedDetections = resizedDetections || null;
        // :TODO Aqui pintamos! dibujamos!
        if (resizedDetections) {
          this.listExpressions = _.map(expressions, (value, name) => {
            return { name, value };
          });
          this.createCanvasPreview(videoElement);
          this.drawFace(resizedDetections, displaySize);
        }
      });

    this.listEvents = [observer1$];
  };

  drawFace = (resizedDetections: ResizedDetections | null, displaySize: any) => {
    if (this.overCanvas) {
      const context = this.overCanvas.getContext('2d');
      if (context) {
        context.clearRect(0, 0, displaySize.width, displaySize.height);
        if (resizedDetections) {
          const { globalFace } = this.faceApiService;
          globalFace.draw.drawFaceLandmarks(context, resizedDetections);

        }
      }
    }
  };

  getPredominantGesture(): string {
    if (this.listExpressions.length > 0) {
      const sortedExpressions = this.listExpressions.sort((a, b) => b.value - a.value);
      return sortedExpressions[0].name;
    }
    return "";
  }
  

  getEmojiForGesture(): string {
    const gesture = this.getPredominantGesture();
    let emoji = "";
  
    switch (gesture) {
      case "neutral":
        emoji = "😐";
        break;
      case "happy":
        emoji = "😄";
        break;
      case "sad":
        emoji = "😔";
        break;
      case "angry":
        emoji = "😡";
        break;
      case "fearful":
        emoji = "😨";
        break;
      case "disgusted":
        emoji = "🤢";
        break;
      case "surprised":
        emoji = "😮";
        break;
      default:
        emoji = "❓";
        break;
    }
  
    return emoji;
  }

  checkMediaSource = () => {
    if (navigator && navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
      }).then(stream => {
        this.currentStream = stream;
      }).catch(() => {
        console.log('**** ERROR NOT PERMISSIONS ');
      });
    } else {
      console.log('** ERROR NOT FOUND MEDIA DEVICES');
    }
  };

  getSizeCam = () => {
    const elementCam = document.querySelector('.cam');
    if (elementCam) {
      const { width, height } = elementCam.getBoundingClientRect();
      this.dimensionVideo = { width, height };
    }
  };

  createCanvasPreview = (videoElement: any) => {
    if (!this.overCanvas) {
      const { globalFace } = this.faceApiService;
      this.overCanvas = globalFace.createCanvasFromMedia(videoElement.nativeElement);
      this.renderer2.setProperty(this.overCanvas, 'id', 'new-canvas-preview');
      const elementPreview = document.querySelector('.canvas-preview');
      this.renderer2.appendChild(elementPreview, this.overCanvas);
    }
  };


  
}

