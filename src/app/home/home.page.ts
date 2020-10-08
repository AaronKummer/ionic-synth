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
  filter = new Tone.Filter({
    // frequency: .01,
    type: "lowpass",
    rolloff: -12,

  }).toDestination()
  synth = new Tone.MonoSynth({
	oscillator: {
		type: "sawtooth"
	},
}).chain(this.filter).toDestination()
  ctx: any;

  constructor(private plt: Platform, private toastCtrl: ToastController) {}
  ngAfterViewInit(): void {
    this.canvasElement = this.canvas.nativeElement;
    this.canvasElement.width = 600;
    this.canvasElement.height = 600;
    setInterval((ctx) => {
    var r = 0.3 + (Math.random()*0.1);
    this.ctx = this.canvasElement.getContext('2d') 
    this.ctx.fillStyle = "rgba(60,30,50,"+r+")";
    this.ctx.fillRect(0,0,this.canvasElement.width, this.canvasElement.height)
    }, 100)
    
  }
 startDrawing(ev) {
   
    this.synth.triggerAttack('C4')
    this.drawing = true;
    var canvasPosition = this.canvasElement.getBoundingClientRect();
 
    this.saveX = ev.pageX - canvasPosition.x;
    this.saveY = ev.pageY - canvasPosition.y;
  }
 
  endDrawing() {
    this.drawing = false;
    this.synth.triggerRelease();
  }

moved(ev) {
  if (!this.drawing) return;

  var canvasPosition = this.canvasElement.getBoundingClientRect();
  
  
  let currentX = ev.pageX - canvasPosition.x;
  let currentY = ev.pageY - canvasPosition.y;
  let filter = (600-currentY)*2
  
  console.log('current y position is ' + currentY)
  console.log(filter)
  this.filter.set({
    frequency: filter,
  })
  this.synth.setNote(currentX)
  let red = 251
  let green = 0
  let blue = 255
  for (let i = 10; i > 1; i--) {
  red = red + (i/2)
  green = green+(i*3)
  this.ctx.lineJoin = 'round';
  this.ctx.strokeStyle = 'rgba(' + red + ',' + green + ',' + blue + ')'
  this.ctx.lineWidth = i*2.5;
  this.ctx.beginPath();
  this.ctx.moveTo(this.saveX, this.saveY);
  this.ctx.lineTo(currentX, currentY);
  this.ctx.closePath();
  this.ctx.stroke();
    
  }

  
  
  this.saveX = currentX;
  this.saveY = currentY;
}

}
