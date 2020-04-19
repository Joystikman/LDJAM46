/* 
    Player object
*/
var viewManager = require('./viewManager');
var gameView    = require('./view/gameView');
var AABB        = require('./AABBcollision');

//animations
var marche_anim = [67,83,84,85];
var marche_branche_anim = [68,99,100,101];
var marche_ai = 0;

//2 frames animations
var twoFrame = 0.24;

var getBranche_anim = [70,71];
var getBranche_ai = 0;

var throwing_anim = [86,87];
var throwing_ai = 0;

var kick_anim = [102,103];
var kick_ai = 0;

var etincellesAnim = 144;


//Player constructor
function Player() {
	this.x  = 0;
	this.y  = 0;
	this.w  = 16;
    this.h  = 16;
    
    this.xmin = 0;
    this.xmax = 0;

	// inventory
	this.hasBranche = false;

	// flags
	this.throwing   = 0;
    this.getBranche   = 0;
    this.kick = 0;
    this.faceLeft = false;
    this.marche = false;

    this.stopCamera = false;

    this.brancheJet = null;
    this.marche = false;
    this.etincelles = false;

    this.canMove = true;

	// rendering
    this.frame = 0;

    //var
    this.player_speed = 1;
}

//Player Update
Player.prototype.update = function (branches, crabes) {

    //Reset flags
    this.brancheJet = null;
    this.marche = false;
    this.etincelles = false;
    this.canMove = false;

    this.elem_to_kill = {crabes : null, branches : null};

    //Check if throwing animation, kick or branch pick up animation are finished
    if(this.throwing>0){
        this.throwing -= twoFrame;
        return;
    }
    if(this.getBranche>0){
        this.getBranche -= twoFrame;
        return;
    }
    if(this.kick>0){
        this.kick -= twoFrame;
        return;
    }

    //Mouvement
	if (btn.right&&(this.x<this.xmax)) {
        this.x += this.player_speed;
        this.marche = true;
        this.faceLeft = false;
        this.canMove = true;
    }
    if (btn.left&&(this.x>this.xmin)){
        this.x -= this.player_speed;
        this.marche = true;
        this.faceLeft = true;
        this.canMove = true;
    }
    this.stopCamera = false;
    
    //pick up branch / throw it
    if (btnp.A && !this.hasBranche){
        console.log("PRISE DE BRANCHE !");
        this.getBranche = 2;
        this.marche = false;
        //check collision between player and branch on the floor
        for (let index = 0; index < branches.length; index++) {
            if(AABB({x: this.x, y : this.y, w : 16, h : 16},{x: branches[index].x, y : branches[index].y, w : 16, h : 9})){
                this.elem_to_kill.branches = index;
                this.hasBranche = true;
            }
        }
        return
    }
    if (btnp.A && this.hasBranche){
        console.log("JET DE BRANCHE !");
        this.brancheJet = this.faceLeft ? {x : this.x-8, y : this.y-5, w : 12, h : 12} : {x : this.x+8, y : this.y-5, w : 12, h : 12} ;
        this.throwing = 2;
        this.hasBranche = false;
        this.marche = false;
        this.stopCamera = true
        return
    }

    //Kick
    if(btnp.B){
        console.log('POSITION :'+this.x);
        console.log('Kick !!!');
        this.stopCamera = true
        this.marche = false;
        this.kick = 2;
        //check collision between player and every crab
        for (let index = 0; index < crabes.length; index++) {
            console.log(index);
            console.log(AABB(
                {x: this.x+8, y : this.y+8, w : 9, h : 7},
                {x: crabes[index].x, y : crabes[index].y+7, w : 16, h : 9}
                ));
            if(!this.faceLeft){
                if(AABB(
                    {x: this.x+8, y : this.y+8, w : 9, h : 7},
                    {x: crabes[index].x, y : crabes[index].y+7, w : 16, h : 9}
                    )
                ){
                    this.elem_to_kill.crabes = index;
                    this.etincelles = true;
                }
            }
            else{
                if(AABB(
                    {x: this.x, y : this.y+8, w : 9, h : 7},
                    {x: crabes[index].x, y : crabes[index].y+7, w : 16, h : 9}
                    )
                ){
                    this.elem_to_kill.crabes = index;
                    this.etincelles = true;
                }
            }
        }
        return
    }
    return
};

//Player display function
Player.prototype.sprite = function () {

    // idle
    var img = 67;

    if(this.hasBranche) img = 68;

    //jet de branche
	if(this.throwing>0){
        img = throwing_anim[~~throwing_ai];
        throwing_ai = (throwing_ai+twoFrame)%3;  
    }
    else if(this.getBranche>0){
        img = getBranche_anim[~~getBranche_ai];
        getBranche_ai = (getBranche_ai+twoFrame)%3;  
        sfx('grab');
    }

    //Kick
    if(this.kick>0){
        img = kick_anim[~~kick_ai];
        kick_ai = (kick_ai+twoFrame)%3;  
        sfx('kick',0.8);
    }

	//marche
	if(this.marche){
        if(!this.hasBranche) img = marche_anim[~~marche_ai];
        if(this.hasBranche) img = marche_branche_anim[~~marche_ai];
        marche_ai = (marche_ai+0.3)%3; 
    }

    sprite(img, this.x, this.y, this.faceLeft);
    
    //etincelles
    if(this.etincelles){
        if(this.faceLeft) sprite(etincellesAnim, this.x-8, this.y+1, this.faceLeft);
        if(!this.faceLeft) sprite(etincellesAnim, this.x+8, this.y+1, this.faceLeft);
    }
};

//Reset
Player.prototype.reset = function(){
    console.log("RESET PLAYER");
    this.x  = 0;
	this.y  = 0;
	this.w  = 16;
    this.h  = 16;

    this.xmin = 0;
    this.xmax = 0;

	// inventory
	this.hasBranche = false;

	// flags
	this.throwing   = 0;
    this.getBranche   = 0;
    this.kick = 0;
    this.faceLeft = false;
    this.marche = false;

    this.stopCamera = false;

    this.brancheJet = null;
    this.marche = false;
    this.etincelles = false;

    this.canMove

	// rendering
	this.frame = 0;
};

module.exports = Player;