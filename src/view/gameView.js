/* 
    Game view
*/
var viewManager   = require('../viewManager');
var Player        = require('../player');
var Feu           = require('../feu');
var Crabe          = require('../crabe');

//VAR
//background
var arbre_ciel = getMap("arbre_ciel");
var sable = getMap("sable");
var buisson = getMap("buisson");
var backgroundColor = 1;

var map_limit = {min : 62, max : 430}

var player = exports.player = new Player();
var feu = exports.feu = new Feu();
var cameraC = {
    x : 185,
    y : 0,
}
var paralax = 0;

// branchs and crabs
var limit_drop = [
    [160,336],
    [96,416],
    [66,430]
]
var branches = [];
var defaut_time = 45;
var time_to_drop = defaut_time;

var crabes = [];

//fire shadow
var ombreanim = [
    [assets.ombres.ombre11,assets.ombres.ombre12],
    [assets.ombres.ombre21,assets.ombres.ombre22],
    [assets.ombres.ombre31,assets.ombres.ombre32]
];
var ombre_ai = 0;

//victory state
var helico = assets.helico;
var y_helico = -66;
var countdown_helico = 4;

//gameover
var fond_noir = assets.ombres.ombre0;
var countdown = 2;

//OPEN
exports.open = function() {

    console.log("OPEN");
    //reset
    reset();
    console.log(feu.victoire);
    console.log(feu.gameover);

    console.log(player.player_speed);

	// set player position
	player.x = 240;
    player.y = 42;
    //set boundaries
    player.xmin = map_limit.min;
    player.xmax = map_limit.max;
    
    // draw level assets
    paper(backgroundColor).cls();
    draw(arbre_ciel, 0, 0);
    draw(sable, 0, 0);
    draw(buisson, 0, 0);

    feu.sprite();
    player.sprite();


    camera(cameraC.x,cameraC.y);
};

//UPDATE
exports.update = function () {
    if(feu.victoire){
        //render game
        console.log("GG");
        paper(backgroundColor).cls();
        draw(arbre_ciel, 0+~~paralax, 0);
        draw(sable, 0, 0);
        draw(buisson, 0, 0);

        // render player
        feu.sprite();
        player.sprite();
        branches.forEach(b => {
            sprite(115,b.x,b.y);
        });
        crabes.forEach(c =>{
            c.sprite();
        });
        camera(cameraC.x, cameraC.y);
        if(countdown_helico>0){
            //helicopter animation
            countdown_helico-= 0.017;
            if(y_helico<-5) y_helico += 0.35;
            draw(helico,cameraC.x+28,y_helico);
            sfx('helico',0.3);
        }
        else{
            //display menu
            draw(helico,cameraC.x+28,y_helico);
            sfx('helico',0.3);
            print("You're saved !",cameraC.x+35, cameraC.y+25);
            print("->menu",cameraC.x+27, cameraC.y+40)
            menu();
        }
    }
    else if (feu.gameover){
        console.log("T'AS dEAD ça");
        draw(fond_noir,0,0);
        //fade out
        if(countdown>0){
            countdown-= 0.03;
        }
        //display menu
        else{
            print("... you die !",cameraC.x+35, cameraC.y+15);
            print("->retry",cameraC.x+27, cameraC.y+30)
            retry();
        }
    }
    //game
    else{
        //actions
        player.update(branches,crabes);
        feu.update(player.brancheJet,crabes);
        crabes.forEach(c => {
            c.update();
        });

        //branchs creation
        if(((random(100000)==12)||time_to_drop)&&branches.length<6){
            let min = limit_drop[feu.level][0];
            let max = limit_drop[feu.level][1];
            let branche = {x : min+random((max-min)), y : 43};
            branches.push(branche);
            time_to_drop = defaut_time;
        }
        time_to_drop-= 0.016;

        //crab creation
        if((random(100)==12)&&crabes.length<3+(2*feu.level)){
            console.log("CREATION CRABE");
            let start = random(2)==0 ? map_limit.min : map_limit.max;
            console.log("START :"+start);
            let crabe = exports.feu = new Crabe({x: start, y : 43});
            crabes.push(crabe);
            console.log(crabes);
        }

        //delete element
        //crabs
            //player
        if(player.elem_to_kill.crabes != null){
            crabes.splice(player.elem_to_kill.crabes,1);   
        }
            //feu
        if(feu.elem_to_kill != null){
            crabes.splice(feu.elem_to_kill,1);   
        }
        //branchs
        if(player.elem_to_kill.branches != null){
            branches.splice(player.elem_to_kill.branches,1);   
        }

        //camera
        if (btn.right&&!(player.throwing>0||player.getBranche>0||player.kick>0)&&player.canMove) {
            console.log(player.canMove);
            cameraC.x += player.player_speed;
            paralax -= 0.15;
        }
        if (btn.left&&!(player.throwing>0||player.getBranche>0||player.kick>0)&&player.canMove){
            console.log(player.canMove);
            cameraC.x -= player.player_speed;
            paralax += 0.15;
        }

        //render background
        paper(backgroundColor).cls();
        draw(arbre_ciel, 0+~~paralax, 0);
        draw(sable, 0, 0);
        draw(buisson, 0, 0);

        // render player
        feu.sprite();
        player.sprite();
        branches.forEach(b => {
            sprite(115,b.x,b.y);
        });
        crabes.forEach(c =>{
            c.sprite();
        });
        camera(cameraC.x, cameraC.y);    
        
        //shadow 
        draw(ombreanim[feu.level][~~ombre_ai],0,0);
        ombre_ai = (ombre_ai+0.12)%2;
    }
};

//Retry function
function retry(){
    if(gamepad.btnp.A||gamepad.btnp.B||gamepad.btnp.start||btnp.A||btnp.B){
        sfx('menu');
        viewManager.open('game');
    }
}

//Menu function
function menu(){
    if(gamepad.btnp.A||gamepad.btnp.B||gamepad.btnp.start||btnp.A||btnp.B){
        sfx('menu');
        viewManager.open('menu');
    }
}

//Reset view
function reset(){
    //camera
    cameraC = {
        x : 185,
        y : 0,
    };
    paralax = 0;
    //list
    branches = [];
    crabes = [];
    //victoire
    y_helico = -66;
    countdown_helico = 4;
    //gameover
    countdown = 2;
    //player
    player.reset();
    feu.reset();

}