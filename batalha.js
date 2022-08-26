const battlebackgroundimage = new Image()

battlebackgroundimage.src = './img/battlebackground.png'

const battlebackground = new Sprite({position: {
    x: 0,
    y: 0
},
    image: battlebackgroundimage
})





let draggle 

let emby 

let renderedsprites 



let battleAnimationId

let queue 

function initBattle(){
    document.querySelector('#userInterface').style.display = 'block'
    document.querySelector('#dialogueBox').style.display = 'none'
    document.querySelector('#enemyhealthBar').style.width = '100%'
    document.querySelector('#playerhealthBar').style.width = '100%'
    document.querySelector('#attacksBox').replaceChildren()
    draggle = new Monster(monsters.Draggle)
    emby = new Monster(monsters.Emby)
    renderedsprites = [draggle, emby]
    queue = []

    emby.attacks.forEach(attack =>{
        const button = document.createElement('button')
        button.innerHTML = attack.name
        document.querySelector('#attacksBox').append(button)
    })

    document.querySelectorAll('button').forEach((button) => {
        button.addEventListener("click", (e) =>{
           const ataqueescolhido = ataques[e.currentTarget.innerHTML]
           emby.attack({
                attack: ataqueescolhido,
                recipient: draggle,
                renderedsprites,
                
    
           })
    
           if(draggle.health <= 0){
            queue.push(() => {
                draggle.faint()
           })
            queue.push(() =>{
                gsap.to('#overlappingDiv', {
                    opacity: 1,
                    onComplete:() => {
                        cancelAnimationFrame(battleAnimationId)
                        animate()
                        document.querySelector('#userInterface').style.display = 'none'
                        gsap.to('#overlappingDiv', {
                            opacity: 0
                        })
                        battle.iniated = false
                    }
                })
            })
           }
           const randomAttack = draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)]
           queue.push(() => {
                draggle.attack({
                    attack: randomAttack,
                    recipient: emby,
                    renderedsprites
                
    
                })
                if(emby.health <= 0){
                    queue.push(() => {
                        emby.faint()
                   })
                   queue.push(() =>{
                    gsap.to('#overlappingDiv', {
                        opacity: 1,
                        onComplete:() => {
                            cancelAnimationFrame(battleAnimationId)
                            animate()
                            document.querySelector('#userInterface').style.display = 'none'
                            gsap.to('#overlappingDiv', {
                                opacity: 0
                            })
                            battle.iniated = false
                        }
                    })
                })
                   }
           })
         
        })
        button.addEventListener('mouseenter' ,(e) =>{
            const ataqueescolhido = ataques[e.currentTarget.innerHTML]
            document.querySelector('#attackType').innerHTML = ataqueescolhido.type
            document.querySelector('#attackType').style.color = ataqueescolhido.color
        } )
    })
}

function animatebattle() {
    battleAnimationid = window.requestAnimationFrame(animatebattle)
    battlebackground.draw()
    
    

    renderedsprites.forEach((sprite) => {
        sprite.draw()
    })
}

//initBattle()
//animatebattle()





document.querySelector('#dialogueBox').addEventListener('click', (e) => {
    if(queue.length > 0 ){
        queue[0]()
        queue.shift()
    }else {e.currentTarget.style.display = 'none'}
    
})