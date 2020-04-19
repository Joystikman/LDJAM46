
/* 
    Fire object
*/
var viewManager = require('./viewManager');
var gameView    = require('./view/gameView');
var AABB        = require('./AABBcollision');

//animations
var feu_anim = [
    [64,65,66],
    [96,97,98],
    [128,129,130]
];
var feu_ai = 0;

var etincellesAnim = 144;

//feu
var feu_pallier = [50,100]

//victoire
var secours = 0;

//Fire constructor
function Feu() {
    this.level = 0;
    this.life = 25;

    //coordonnées
    this.x = 256;
    this.y = 41;
    this.w = 16;
    this.h = 16;

    //flags
    this.victoire = false;
    this.gameover = false;
    this.etincelles = false;
}

//Fire Update
Feu.prototype.update = function (branche,crabes) {

    this.elem_to_kill = null;
    this.etincelles = false;

    //If fire get a branch, fire life increase
    if(branche){
        console.log(branche);
        if(AABB(branche,this)) this.life += 16;
        console.log(this.life);
        this.etincelles = true;
    }

    //If crab reach fire, fire life decrease
    if(crabes){
        for (let index = 0; index < crabes.length; index++) {
            if(AABB(this,crabes[index])){
                this.elem_to_kill = index;
                this.etincelles;
                this.life -= 6;
            } 
            
        }
    }

    //If fire is at level 2 long enough, it's the victory
    if(secours > 25){
        this.victoire = true;
    }

    //Fire level computation
    if(this.life>feu_pallier[1]){
        secours+=0.016;
        this.level = 2;
    }
    else if (this.life>feu_pallier[0]){
        this.level = 1;
    }
    else if (this.life > 0 ){
        this.level = 0;
    }
    else{
        this.gameover = true;
    }

    //fire life decrement
    this.life -= 0.025;
};

//Fire display function
Feu.prototype.sprite = function () {
    sprite(feu_anim[this.level][~~feu_ai], this.x, this.y, false);
    feu_ai = (feu_ai+0.2)%3;    
    if(this.etincelles){
        sprite(etincellesAnim,this.x, this.y);
        sfx('feu');
    }
};

//Fire reset state function
Feu.prototype.reset = function(){
    console.log("RESET FEU");
    this.level = 0;
    this.life = 25;

    //coordonnées
    this.x = 256;
    this.y = 41;
    this.w = 16;
    this.h = 16;

    //flags
    this.victoire = false;
    this.gameover = false;
    this.etincelles = false;

    this.elem_to_kill = null;
    this.etincelles = false;

    secours = 0;
}

module.exports = Feu;