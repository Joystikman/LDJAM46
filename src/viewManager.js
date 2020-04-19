/* 
	View manager object
*/

var views = {};

exports.view = null;

//add a new view
exports.addView = function (id, view) {
	views[id] = view;
};

//open a view
exports.open = function (id, params) {
	var view = views[id];
	if (!view) return console.error('view does not exist', id);
	exports.view = view;
	view.open && view.open(params);
};

//update
exports.update = function () {
	exports.view.update();
};