var prefs = { // Dafaults
	debug: true,
	loadInBackground: false
};
function init() {
	localize();
	loadOptions();
	addEventListener("input", saveOption);
	addEventListener("unload", destroy, { once: true });
}
function destroy() {
	removeEventListener("input", saveOption);
}
function localize() {
	for(var it of document.getElementsByClassName("localize"))
		it.textContent = browser.i18n.getMessage(it.textContent) || it.textContent;
}
function loadOptions() {
	browser.storage.local.get().then(function(o) {
		Object.assign(prefs, o);
		for(var id in prefs)
			loadOption(id, prefs[id]);
	});
}
function loadOption(id, val) {
	var node = document.getElementById(id);
	node && (node.checked = val);
}
function saveOption(e) {
	var node = e.target;
	if(!(node.id in prefs))
		return;
	browser.storage.local.set({
		[node.id]: node.checked
	});
}
addEventListener("DOMContentLoaded", init, { once: true });