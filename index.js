const canvas = document.querySelector('canvas')
//context
const c = canvas.getContext('2d')



canvas.width = 1900
canvas.height = 900


const colisoesmap = []
for (let i = 0; i < colisoes.length; i+= 70){
    colisoesmap.push(colisoes.slice(i, 70 + i))
}

const areabatalhaMap = []
for (let i = 0; i < areabatalhadados.length; i+= 70){
    areabatalhaMap.push(areabatalhadados.slice(i, 70 + i))
}



const boundaries = []

const offset = {
    x: -1500,
    y: -800
}

colisoesmap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025)
            boundaries.push(new Boundary({position: {
                x: j * Boundary.width + offset.x,
                y: i * Boundary.height + offset.y
            }}))
    })
})


const areabatalha = []

areabatalhaMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025)
            areabatalha.push(new Boundary({position: {
                x: j * Boundary.width + offset.x,
                y: i * Boundary.height + offset.y
            }}))
    })
})

const image = new Image()
image.src = './img/pokemon-mapa.png'

const foregroundimage = new Image()
foregroundimage.src = './img/foregroundobjects.png'

const playerdownimage = new Image()
playerdownimage.src = './img/playerDown.png'
const playerupimage = new Image()
playerupimage.src = './img/playerUp.png'
const playerleftimage = new Image()
playerleftimage.src = './img/playerLeft.png'
const playerrightimage = new Image()
playerrightimage.src = './img/playerRight.png'



const player = new Sprite({
    position: {
        x:(canvas.width / 2) - 300,
        y:(canvas.height / 2) - 50
    },
    image: playerdownimage,
    frames: {
        max:4,
        hold: 10
    },
    sprites: {
        up:playerupimage,
        left:playerleftimage,
        right:playerrightimage,
        down:playerdownimage
    }
    
    
})

const background = new Sprite(
    {position: {
    x: offset.x,
    y: offset.y
    },
    image: image,
      
})

const foreground = new Sprite(
    {position: {
    x: offset.x,
    y: offset.y
    },
    image: foregroundimage,
      
})

const keys = {
    w:{
        pressed:false
    },
    a:{
        pressed:false
    },
    d:{
        pressed:false
    },
    s:{
        pressed:false
    },
}


const movables = [background, ...boundaries,foreground, ...areabatalha]

function rectangularCollision({rectangle1,rectangle2}){
    return(rectangle1.position.x + rectangle1.width >= rectangle2.position.x && 
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width
        && rectangle1.position.y <= rectangle2.position.y + rectangle2.height&&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y)
    }

const battle = {
    iniated: false
}    
function animate(){
    const animationId = window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach(boundary => {
        boundary.draw()
       
    })
    areabatalha.forEach(area => {
        area.draw()
    })
   
    player.draw()
    foreground.draw()
    let moving = true
    player.animate = false

    console.log(animationId)
    if (battle.iniated) return

    if (keys.w.pressed || keys.a.pressed|| keys.d.pressed || keys.s.pressed){
        for (let i = 0; i < areabatalha.length; i++){
            const area = areabatalha[i]
            const overlappingarea = (Math.min(player.position.x + player.width, area.position.x + area.height) - Math.max(player.position.x, area.position.x)) * 
            (Math.min(player.position.y + player.height, area.position.y + area.height) - Math.max(player.position.y, area.position.y))
            if (
                rectangularCollision({
                    rectangle1:player,
                    rectangle2:area
                })&&
                overlappingarea >(player.width * player.height) /2 &&
                Math.random() < 0.01
                ){
                console.log('batalha')

                window.cancelAnimationFrame(animationId)    

                battle.iniated = true
                gsap.to('#overlappingDiv', {
                    opacity: 1,
                    repeat: 3,
                    yoyo: true,
                    duration: 0.4,
                    onComplete() {
                        gsap.to('#overlappingDiv', {
                            opacity: 1,
                            duration: 0.4,
                            onComplete(){
                                initBattle()
                                animatebattle()
                                gsap.to('#overlappingDiv', {
                                    opacity: 0,
                                    duration: 0.4,
                                })
                            }
                        })
                       

                        
                    }
                    
                })
                break
            }
        }
    }


    
    


    if(keys.w.pressed && lastkey === 'w'){
        player.animate = true
        player.image = player.sprites.up
        for (let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1:player,
                    rectangle2:{...boundary, position:{
                        x: boundary.position.x,
                        y: boundary.position.y + 3
                    }}
                })
                ){
                
                moving = false
                break
            }
        }
       
        if(moving)
        movables.forEach((movable) => {
            movable.position.y += 3
        })
    }
    else if (keys.a.pressed && lastkey === 'a'){
        player.animate = true
        player.image = player.sprites.left
        for (let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1:player,
                    rectangle2:{...boundary, position:{
                        x: boundary.position.x + 3,
                        y: boundary.position.y 
                    }}
                })
                ){
               
                moving = false
                break
            }
        }
        if(moving)
        movables.forEach((movable) => {
            movable.position.x += 3
        })
    }
     
    else if (keys.d.pressed && lastkey === 'd') {
        player.animate = true
        player.image = player.sprites.right
        for (let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1:player,
                    rectangle2:{...boundary, position:{
                        x: boundary.position.x - 3,
                        y: boundary.position.y 
                    }}
                })
                ){
                
                moving = false
                break
            }
        }
        if(moving)
        movables.forEach((movable) => {
            movable.position.x -= 3
        })
    }
    else if (keys.s.pressed && lastkey === 's') {
        player.animate = true
        player.image = player.sprites.down
        for (let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1:player,
                    rectangle2:{...boundary, position:{
                        x: boundary.position.x,
                        y: boundary.position.y - 3
                    }}
                })
                ){
                
                moving = false
                break
            }
        }
        if(moving)
        movables.forEach((movable) => {
            movable.position.y -= 3
        })
    }
}

animate()



let lastkey = ''
window.addEventListener('keydown', (e) => {
    
    switch(e.key){
        case 'w' :
            keys.w.pressed = true
            lastkey = 'w'
            break
        case 'a':
            keys.a.pressed = true
            lastkey = 'a'
            break
        case 'd':
            keys.d.pressed = true
            lastkey = 'd'
            break
        case 's':
            keys.s.pressed = true
            lastkey = 's'
            break
    }
    
})

window.addEventListener('keyup', (e) => {
    
    switch(e.key){
        case 'w' :
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
    }
    
})
