import {Component, ElementRef, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {VideoPlayerService} from './video-player.service';
import {FaceApiService} from './face-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public currentStream: any;
  public dimensionVideo: any;

  ngOnInit(): void {
      this.checkMediaSource();
      this.getSizeCam();
  }

  checkMediaSource = () =>{
    if(navigator && navigator.mediaDevices){

      navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
      }).then(stream => {
        this.currentStream = stream;
      }).catch(() => {
        console.log('**** ERROR NOT PERMISSIONS *****');
      });

    }
    else{
      console.log('********** Error no video')
    }
  }
  getSizeCam = () => {
    const elementCam = document.querySelector('.cam');
    if (elementCam) {
      const {width, height} = elementCam.getBoundingClientRect();
      this.dimensionVideo = {width, height};
    }
  };

}
