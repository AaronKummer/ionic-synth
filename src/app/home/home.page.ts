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
  drawingTime = 0
  red = 50
  blue = 100
  green = 0
  lineSize = 10
  particle = {
    x : 0,
    y : 0
  }
  particles = []
  ctx: any;
  canvasElement: any;
  saveX: number;
  saveY: number;
  drawing = false;
  reverb = new Tone.JCReverb({
    wet: 0,
    roomSize: 1,
  }).toDestination()
  filter = new Tone.Filter({
    // frequency: .01,
    type: "lowpass",
    rolloff: -12,
  }).toDestination()
  synth = new Tone.MonoSynth({
	oscillator: {
		type: "sawtooth"
	},
}).chain(this.filter, this.reverb).toDestination()

  constructor(private plt: Platform, private toastCtrl: ToastController) {}

  ngAfterViewInit(): void {
    this.canvasElement = this.canvas.nativeElement;
    this.canvasElement.width = 600;
    this.canvasElement.height = 600;
    setInterval((ctx) => {
    var r = 0.3 + (Math.random()*0.1);
    this.ctx = this.canvasElement.getContext('2d') 
    this.ctx.fillStyle = "rgba(0,0,0,"+r+")";
    this.ctx.fillRect(0,0,this.canvasElement.width, this.canvasElement.height)
    }, 10)
    
  }

 

 startDrawing(ev) {
    this.lineSize = 12
    this.synth.triggerAttack('C4')
    this.drawing = true;
    var canvasPosition = this.canvasElement.getBoundingClientRect();
    this.saveX = ev.pageX - canvasPosition.x;
    this.saveY = ev.pageY - canvasPosition.y;
    setInterval(() => {
      this.drawingTime += .0001
      if (this.red < 254 && this.blue < 254) {
        this.red += .5
        this.blue += .2
      } 
      this.lineSize += .2
      // this.reverb.set({
      //   wet: this.drawingTime
      // })
    },30)
  }
 
  endDrawing() {
    this.drawing = false;
    this.synth.triggerRelease();
    this.reverb.set({
      wet:0
    })
    this.blue = 100
    this.red = 50
    
  }

particleExplosion(x,y) {

  this.ctx.fillStyle('green')
  this.ctx.fillRect(x+30, y+30, 2, 2)
  for (let i = 0; i < 50; i++) {
        
    
  }
}

moved(ev) {
  if (!this.drawing) return;
  
  var canvasPosition = this.canvasElement.getBoundingClientRect()
  let currentX = ev.pageX - canvasPosition.x
  let currentY = ev.pageY - canvasPosition.y

  let filter = (600-currentY)*2
  this.filter.set({
    frequency: filter,
  })

  this.synth.setNote(currentX)

  // color stuff
  
  this.ctx.lineJoin = 'round';
  this.ctx.strokeStyle = 'rgba(' + this.red + ',' + this.green + ',' + this.blue + ')'
  this.ctx.lineWidth = this.lineSize
  this.ctx.beginPath();
  this.ctx.moveTo(this.saveX, this.saveY)
  this.ctx.bezierCurveTo(this.saveX, this.saveY,currentX, currentY, currentX, currentY)
  this.ctx.closePath();
  this.ctx.stroke();
  
  this.particleExplosion(this.saveX, this.saveY)
  this.saveX = currentX
  this.saveY = currentY
}

}
