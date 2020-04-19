//MAIN function

//Load game views
var viewManager = require('./viewManager');

viewManager.addView('menu',require('./view/menuView'));
viewManager.addView('game',require('./view/gameView'));

viewManager.open('menu');

// Update is called once per frame
exports.update = viewManager.update;
