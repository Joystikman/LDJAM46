/* 
    Menu view
*/
//Var
var viewManager = require('../viewManager');
var titre = "Crab nightmare 🦀";
var menus = ["->PLAY"];
var author = "@Joystikman";
var ldjam = "LDJam 46";

var crabeanim = [118,119,120];
var ai = 0;

//OPEN
exports.open = function () {
	camera(0, 0);
    paper(1);
    patatracker.playSong(0);
};

//UPDATE
exports.update = function () {
	cls();

    // menu
    pen(10);
    print(titre,27,15);
    let ymenu = 30;
    menus.forEach(menu => {
        print(menu,27,ymenu);
        ymenu += 5;
    });

    //crab
    sprite(crabeanim[~~ai],75,25);
    ai = (ai+0.3)%3;

	// footer
    print(author, 5, 55);
    print(ldjam, 80, 55);    

    // action
        //gamepad
	if (gamepad.btnp.A    ) action();
	if (gamepad.btnp.B    ) action();
    if (gamepad.btnp.start) action();
        //keyboard
    if (btnp.A    ) action();
    if (btnp.B    ) action();
};

//ACTIONS
function action() {
    sfx('menu');
    patatracker.stop();
	viewManager.open('game');
}