
const monsters = {
    Emby: {
        position:{
            x: 600,
            y: 550
        },
        image: {
            src:'./img/embySprite.png'
        },
        frames:{
            max: 4,
            hold: 30
        },
        animate: true,
        name: 'emby',
        attacks: [ataques.Tackle, ataques.Fireball]
    
    },
    Draggle: {
        position:{
            x:1500,
            y:200
        },
        image: {
            src: './img/draggleSprite.png'
        },
        frames: {
            max:4,
            hold: 30
        },
        animate:true,
        isEnemy: true,
        name: 'draggle',
        attacks: [ataques.Tackle, ataques.Fireball]
        
    }


    
}