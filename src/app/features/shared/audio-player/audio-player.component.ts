import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { NgxAudioPlayerModule } from 'ngx-audio-player';
import { Track } from 'ngx-audio-player';

interface AudioTestimony {
  title: string;
  url: string;
  author: string;
  duration: number;
}

@Component({
  selector: 'app-audio-player',
  imports: [NgxAudioPlayerModule, MatSliderModule],
  templateUrl: './audio-player.component.html',
  styleUrl: './audio-player.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AudioPlayerComponent {
  @Input({ required: true }) testimonyData: AudioTestimony = {
    title: '',
    url: '',
    author: '',
    duration: 0,
  };

  private ref = inject(ChangeDetectorRef);

  mssapDisplayTitle = false;
  mssapDisablePositionSlider = false;
  mssapDisplayRepeatControls = false;
  mssapDisplayVolumeControls = false;
  mssapDisplayVolumeSlider = false;

  get playlist(): Track[] {
    return [
      {
        title: this.testimonyData.title,
        link: this.testimonyData.url,
        artist: this.testimonyData.author,
        duration: this.testimonyData.duration,
        mediaType: 'stream'
      },
    ];
  }

  onTrackEnded(event: any) {
    console.log('Track ended:', event);
    this.ref.detectChanges();
  }
}
