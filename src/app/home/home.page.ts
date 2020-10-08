import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
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
  
  particles : Particle[] = []
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

  constructor() {}

  ngAfterViewInit(): void {
    this.canvasElement = this.canvas.nativeElement;
    this.canvasElement.width = 600;
    this.canvasElement.height = 600;
    this.ctx = this.canvasElement.getContext('2d') 
    
  }

mainLoop() {
    console.log('looping')
    if (this.drawing) {
      this.particles.push(new Particle(this.saveX,this.saveY))
    }
    
    this.particles.forEach(p => {
      this.drawParticle(p)
      
      this.updateParticle(p)
      if (p.alpha <= 0) {
        this.particles.splice(this.particles.indexOf(p), 1)
      }
    })
};

 startDrawing(ev) {
   console.log('starting to draw')
    // this.lineSize = 12
    this.synth.triggerAttack('C4')
    this.drawing = true;
    var canvasPosition = this.canvasElement.getBoundingClientRect();
    this.saveX = ev.pageX - canvasPosition.x;
    this.saveY = ev.pageY - canvasPosition.y;
    setInterval(() => {
      // this.reverb.set({
      //   wet: this.drawingTime
      // })
      this.ctx.fillStyle = 'black'
      this.ctx.fillRect(0,0,600,600)
    this.mainLoop()
  },1000/60)
   
  }

  endDrawing() {
    this.drawing = false;
    this.synth.triggerRelease();
    this.reverb.set({
      wet:0
    })
    this.particles.forEach(p => {
      this.particles.pop()
    })
    
  }

moved(ev) {
  if (!this.drawing) return;
  
  var canvasPosition = this.canvasElement.getBoundingClientRect()
  let currentX = ev.pageX - canvasPosition.x
  let currentY = ev.pageY - canvasPosition.y
  this.red = currentX / 2.3
  this.blue = currentY / 2.3
  this.green = (600-currentY) / 2.3
  let filter = (600-currentY)*2
  this.filter.set({
    frequency: filter,
  })

  this.synth.setNote(currentX)
  
  this.saveX = currentX
  this.saveY = currentY
}

drawParticle (particle) {
  
  this.ctx.beginPath()
  this.ctx.arc(particle.x, particle.y, 12, 0, 2 * Math.PI);
  this.ctx.fillStyle = 'rgba('+ this.red + ',' + this.green + ',' + this.blue +','+ particle.alpha +')'
  this.ctx.fill()
  this.ctx.closePath()
  
}

updateParticle(particle) {
  // particle.vx += this.saveX /1000
  if (this.saveX < 200) {
    particle.vy  -= (this.saveX / 500) / 5
  } else {
    particle.vy  -= (this.saveX / 50) / 5
  }
  
  particle.x += particle.vx
  particle.y += particle.vy
  particle.alpha -= .01
}

}

export class Particle {
  x : number = 0
  y : number = 0
  vx :  number = 0
  vy : number = 0
  color : string = 'yellow'
  alpha : number
  constructor(x,y) {
    this.x = x;
    this.y = y
    this.vx = Math.random() * 10
    this.vy = Math.random() * -5
    this.alpha = 1
  }
}

