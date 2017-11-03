var prefs = { // Dafaults
	debug: true,
	loadInBackground: false
};
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
document.addEventListener("DOMContentLoaded", loadOptions, true);
document.addEventListener("input", saveOption, false);