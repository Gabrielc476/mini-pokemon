class Sprite{
    constructor({position,velocity, image, frames = {max: 1, hold: 10}, sprites, animate = false,  rotation = 0 }){
        this.position = position
        this.image = new Image()
        this.frames = {...frames, val: 0, elapsed: 0}
        this.sprites = sprites
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
            
        }
        this.image.src = image.src

        this.animate = animate
        this.opacity = 1
        this.health = 100
        
        this.rotation = rotation
       
    }
    draw(){
        c.save()
        c.translate(this.position.x + this.width / 2,this.position.y + this.height / 2 )
        c.rotate(this.rotation)
        c.translate(-this.position.x - this.width / 2,-this.position.y - this.height / 2 )
        c.globalAlpha = this.opacity
        c.drawImage(
            this.image,
            this.frames.val * this.width,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width /this.frames.max,
            this.image.height )
            


            if(!this.animate) return
            if (this.frames.max > 1){
                this.frames.elapsed++
            }
            if(this.frames.elapsed % this.frames.hold === 0){
                if (this.frames.val < this.frames.max - 1){
                    this.frames.val++
                }
                else{
                    this.frames.val = 0
                    }
            }
        c.restore()
        }
    
            
           
    }


class Monster extends Sprite {
    constructor({position,velocity, image, frames = {max: 1, hold: 10}, sprites, animate = false,  rotation = 0,isEnemy = false,name, attacks}){
        super({position,velocity, image, frames, sprites, animate,  rotation})
        this.health = 100
        this.isEnemy = isEnemy
        this.name = name
        this.attacks = attacks
    }

    faint(){
        document.querySelector('#dialogueBox').innerHTML = this.name + ' Fainted!'
        gsap.to(this.position,{
            y: this.position.y + 20
        })
        gsap.to(this,{
            opacity: 0
        })
    }
    attack({attack, recipient, renderedsprites}){
        
        document.querySelector('#dialogueBox').style.display = 'block'
        document.querySelector('#dialogueBox').innerHTML = this.name + ' used ' + attack.name

        let healthBar = '#enemyhealthBar'
                if (this.isEnemy) {
                    healthBar = '#playerhealthBar'
                }
        recipient.health -= attack.damage

        let rotation = 1.5
        if( this.isEnemy){
            rotation = -1.5
        }
        switch ( attack.name ) {

            case 'Fireball':
                const fireballimage = new Image()
                fireballimage.src = './img/fireball.png'
                const fireball = new Sprite({
                    position: {
                        x: this.position.x,
                        y: this.position.y
                    },
                    image: fireballimage,
                    frames: {
                        max: 4,
                        hold: 10
                    },
                    animate: true,
                    rotation
                })
                
                renderedsprites.splice(1, 0, fireball)

                gsap.to(fireball.position, {
                    x: recipient.position.x,
                    y: recipient.position.y,
                    onComplete: () =>{

                        gsap.to(healthBar, {
                            width: recipient.health  + '%'
                        })

                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                   
                        })
                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.08
                        })
                        renderedsprites.splice(1, 1)
                    }
                })

                break
            case 'Tackle' :
                const tl = gsap.timeline()

                

                let movementdistance = 20

                if (this.isEnemy) {
                    movementdistance = -20
                }

                

                tl.to(this.position, {
                    x: this.position.x - movementdistance,

                }).to(this.position, {
                    x: this.position.x + movementdistance * 2,
                    duration: 0.1,
                    onComplete : () => {

                        gsap.to(healthBar, {
                            width: recipient.health  + '%'
                        })

                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                   
                        })
                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.08
                        })
                    }
                }).to(this.position, {
                    x: this.position.x 
                })


            break;
        }
        
    }
}



class Boundary{
    static width = 66
    static height = 66
    constructor({position}){
        this.position = position
        this.width = 66
        this.height = 66
    }

    draw(){
        c.fillStyle = 'rgba(255,0,0, 0.0)'
        c.fillRect(this.position.x,this.position.y, this.width, this.height)
    }
}