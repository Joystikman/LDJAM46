/* 
    Crab object
*/

var viewManager = require('./viewManager');
var gameView    = require('./view/gameView');
var AABB        = require('./AABBcollision');

//animations
var marche_anim = [118,119,120];
var marche_ai = 0;

var crabe_speed = 0.7;

//Crab constructor
function Crabe(position) {
	this.x  = 0;
	this.y  = 43;
	this.w  = 16;
    this.h  = 10;

    this.x = position.x;
    this.y = position.y;

    //direction
    this.goRight = this.x < 248 ? (this.goRight = true) : (this.goRight = false);
    console.log("CREATION CRABE");
    console.log(this.goRight);

};

//Crab update
Crabe.prototype.update = function () {

    //mouvement
    if(this.goRight){
        this.x += crabe_speed;
    }
    else{
        this.x -= crabe_speed;
    }

};

//Crab display function
Crabe.prototype.sprite = function() {
    let img = marche_anim[~~marche_ai];
    marche_ai = (marche_ai+0.18)%3;
    sprite(img,this.x,this.y);
};

module.exports = Crabe;
