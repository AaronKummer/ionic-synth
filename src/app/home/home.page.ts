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
    this.ctx.fillStyle = "rgb(0,0,0)";
    this.ctx.fillRect(0,0,this.canvasElement.width, this.canvasElement.height)
    setInterval((ctx) => {
    if (this.drawing) {
      this.generateParticles()
    }
    this.moveParticles()
    }, 50)
    
  }

 startDrawing(ev) {
   console.log('starting to draw')
    // this.lineSize = 12
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

moveParticle(p) {
    this.ctx.fillStyle = 'black'
    this.ctx.fillRect(p.x,p.y, p.width, p.height)      

    if (p.age < 100) {
      let flip = Math.random()
       if  (p.age < 15) {
        if (flip > .5) {
          this.ctx.fillRect(p.x+2,p.y-2, p.width, p.height)  
          p.x += 2
          p.y += 2
        } else {
          this.ctx.fillRect(p.x-2,p.y-2, p.width, p.height)  
          p.x -= 2
          p.y += 2
        }
       } else {
         if (flip > .5) {
          this.ctx.fillRect(p.x+2,p.y+2, p.width, p.height)  
             
          p.x += 2
          p.y -= 2
         } else {
          this.ctx.fillRect(p.x-2,p.y+2, p.width, p.height)  
          p.x -= 2
          p.y -= 2
         }
       }
    }
    if (p.age >= 100) {
      this.ctx.fillStyle = 'black'
      this.ctx.fillRect(p.x,p.y, p.width, p.height)      
      this.particles.splice(this.particles.indexOf(p), 1);
    }

}

moveParticles() {
    this.particles.forEach(p => {
    this.moveParticle(p)
    console.log(this.particles)
    p.age += 1
  })
}

generateParticles() {
  if (this.drawing) {
    for (let i = 0; i < 5; i++) {
      this.particles.push({
        x : this.saveX,
        y : this.saveY,
        color : 'yellow',
        age : 1,
        height : 5,
        width : 5
      })
    }
      this.particles.forEach(p => {
        this.ctx.fillStyle = p.color
        this.ctx.fillRect(p.x,p.y, p.width, p.height)      
      })
  }
}


particleExplosion(x,y) {
  
  console.log(x,y)
  
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
  
  // this.ctx.lineJoin = 'round';
  // this.ctx.strokeStyle = 'rgba(' + this.red + ',' + this.green + ',' + this.blue + ')'
  // this.ctx.lineWidth = this.lineSize
  // this.ctx.beginPath();
  // this.ctx.moveTo(this.saveX, this.saveY)
  // this.ctx.bezierCurveTo(this.saveX, this.saveY,currentX, currentY, currentX, currentY)
  // this.ctx.closePath();
  // this.ctx.stroke();
  
  
  this.saveX = currentX
  this.saveY = currentY
}

}

export class Particle {
  x : number = 0
  y  : number = 0
  height : number = 5
  width :  number = 5
  age : number = 0
  // goingUp : boolean = true
  color : string = 'yellow'
}

