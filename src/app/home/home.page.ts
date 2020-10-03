import { AfterViewInit, ViewChild, Component } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import * as Tone from 'tone'
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
@ViewChild('imageCanvas', { static: false }) canvas: any;
  canvasElement: any;
  saveX: number;
  saveY: number;
  drawing = false;
  synth = new Tone.Synth().toDestination();
  constructor(private plt: Platform, private toastCtrl: ToastController) {}
  ngAfterViewInit(): void {
    this.canvasElement = this.canvas.nativeElement;
    this.canvasElement.width = this.plt.width() + '';
    this.canvasElement.height = 200;
  }
 startDrawing(ev) {
    
    this.drawing = true;
    var canvasPosition = this.canvasElement.getBoundingClientRect();
 
    this.saveX = ev.pageX - canvasPosition.x;
    this.saveY = ev.pageY - canvasPosition.y;
  }
 
  endDrawing() {
    this.drawing = false;
    this.synth.triggerAttackRelease("C3", "8n");
  }
 
  setBackground() {
    var background = new Image();
    background.src = './assets/code.png';
    let ctx = this.canvasElement.getContext('2d');
 
    background.onload = () => {
      ctx.drawImage(background,0,0, this.canvasElement.width, this.canvasElement.height);   
    }
  }

moved(ev) {
  if (!this.drawing) return;
 
  var canvasPosition = this.canvasElement.getBoundingClientRect();
  let ctx = this.canvasElement.getContext('2d');
 
  let currentX = ev.pageX - canvasPosition.x;
  let currentY = ev.pageY - canvasPosition.y;
 
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '9e2956';
  ctx.lineWidth = 5;
 
  ctx.beginPath();
  ctx.moveTo(this.saveX, this.saveY);
  ctx.lineTo(currentX, currentY);
  ctx.closePath();
 
  ctx.stroke();
  this.saveX = currentX;
  this.saveY = currentY;
}

}
