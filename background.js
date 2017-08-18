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
	browser.tabs.create({
		url: info.linkUrl,
		cookieStoreId: cookieStoreId,
		//openerTabId: tab.id, // Not supported and will cause error
		//~ todo: add options
		active: true,
		index: tab.index + 1
	});
});

browser.browserAction.onClicked.addListener(function() {
	_log("browserAction.onClicked");
});
browser.commands.onCommand.addListener(function(command) {
	_log("commands.onCommand: " + command);
});

var cookieStoreId;
browser.storage.local.get("cookieStoreId").then(function(o) {
	function done(sId) {
		if(!sId)
			_err("Unable to create container");
	}
	var sId = o.cookieStoreId || null;
	if(!sId) {
		createAndStoreContainer(done);
		return;
	}
	// Validate container
	browser.contextualIdentities.get(sId).then(function onSuccess(context) {
		if(context) {
			cookieStoreId = sId;
			_log("Will use saved cookieStoreId from browser.storage.local: " + sId);
			done(sId);
			return;
		}
		_log("Saved cookieStoreId was removes, will create new one");
		createAndStoreContainer(done);
	}, _err);
}, _err);
function createAndStoreContainer(callback) {
	createContainer(function(sId) {
		if(!sId)
			return callback();
		cookieStoreId = sId;
		browser.storage.local.set({
			cookieStoreId: sId
		});
		return callback(sId);
	});
}
function createContainer(callback) {
	browser.contextualIdentities.create({
		name: browser.i18n.getMessage("extensionName"),
		color: "purple",
		icon: "fingerprint"
	}).then(
		function onCreated(context) {
			var sId = context.cookieStoreId;
			_log("Container id: " + sId);
			if(!sId) {
				// https://bugzilla.mozilla.org/show_bug.cgi?id=1354602
				// Expose enabling containers via web extensions
				var msg = "Please set privacy.userContext.enabled = true in about:config";
				browser.notifications.create({
					"type": "basic",
					"iconUrl": browser.extension.getURL("icon.png"),
					"title": browser.i18n.getMessage("extensionName"),
					"message": msg
				});
				_err(msg);
			}
			callback(sId);
		},
		function onError(e) {
			_err(e);
			callback();
		}
	);
}

// Not implemented :(
// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/onSuspend
// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/onSuspendCanceled
//browser.runtime.onSuspend.addListener(function destroy() {
//});
//browser.runtime.onSuspendCanceled.addListener(function reInit() {
//});

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