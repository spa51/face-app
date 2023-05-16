import {Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {FaceApiService} from '../face-api.service';
import {VideoPlayerService} from '../video-player.service';


@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnInit {
  @ViewChild('videoElement')videoElement:ElementRef;
  @Input() stream: any;
  @Input() width: number = 0;
  @Input() height: number = 0;

  constructor(private renderer2: Renderer2, private elementRef: ElementRef){
  
  }
  ngOnInit(): void {
  }
  loadedMetaData(): void{
      this.videoElement.nativeElement.play();
    }

    listenerPlay(): void{
      
    }
  }





