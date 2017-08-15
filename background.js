const LOG_PREFIX = "[Private Tab WE] ";

function onCreated() {
	var err = browser.runtime.lastError;
	if(err)
		_err("Error: " + err);
	else
		_log("Item created successfully");
}

browser.contextMenus.create({
	id: "pt-openInTab",
	title: browser.i18n.getMessage("openInNewPrivateTab"),
	contexts: ["link"]
}, onCreated);

browser.contextMenus.onClicked.addListener(function(info, tab) {
	_log("contextMenus.onClicked: " + info.menuItemId);
});

browser.browserAction.onClicked.addListener(function() {
	_log("browserAction.onClicked");
});
browser.commands.onCommand.addListener(function(command) {
	_log("commands.onCommand: " + command);
});

var cookieStoreId;
browser.contextualIdentities.create({
	name: browser.i18n.getMessage("extensionName"),
	color: "purple",
	icon: "fingerprint"
}).then(
	function onCreated(context) {
		cookieStoreId = context.cookieStoreId;
		_log("New identity's ID: " + cookieStoreId);
	},
	function onError(e) {
		_err(e);
	}
);

function ts() {
	var d = new Date();
	var ms = d.getMilliseconds();
	return d.toTimeString().replace(/^.*\d+:(\d+:\d+).*$/, "$1") + ":" + "000".substr(("" + ms).length) + ms + " ";
}
function _log(s) {
	//if(_dbg)
	console.log(LOG_PREFIX + ts() + s);
}
function _err(s) {
	console.error(LOG_PREFIX + ts() + s);
}