const LOG_PREFIX = "[Private Tab WE] ";

var prefs = {
	debug: true,
	loadInBackground: false
};
browser.storage.local.get().then(function(o) {
	browser.storage.onChanged.addListener(function(changes, area) {
		if(area == "local") for(var key in changes)
			prefs[key] = changes[key].newValue;
	});
	Object.assign(prefs, o);
	privateContainerId = prefs.privateContainerId || null;

	for(var key in o)
		return; // Prefs already saved
	setTimeout(function() { // Pseudo async
		browser.storage.local.set(prefs);
	}, 5000);
}, _err);

browser.contextMenus.create({
	id: "openInTab",
	title: browser.i18n.getMessage("openInNewPrivateTab"),
	contexts: ["link"]
});
browser.contextMenus.create({
	id: "toggleTabPrivate",
	title: browser.i18n.getMessage("toggleTabPrivate"),
	contexts: ["tab"]
});

browser.contextMenus.onClicked.addListener(function(info, tab) {
	var miId = info.menuItemId;
	_log("contextMenus.onClicked: " + miId);
	if(miId == "openInTab")
		openInPrivateTab(info.linkUrl, tab);
	else if(miId == "toggleTabPrivate")
		toggleTabPrivate(tab);
});
function openInPrivateTab(uri, sourceTab) {
	getContainer(function(sId) {
		var opts = {
			url: uri,
			cookieStoreId: sId,
			openerTabId: sourceTab.id,
			active: !prefs.loadInBackground,
			index: sourceTab.index + 1
		};
		try {
			browser.tabs.create(opts);
		}
		catch(e) {
			// Type error for parameter createProperties (Property "openerTabId" is unsupported by Firefox) for tabs.create.
			if((e + "").indexOf('"openerTabId" is unsupported') == -1)
				throw e;
			delete opts.openerTabId;
			browser.tabs.create(opts);
		}
	});
}
function toggleTabPrivate(tab) {
	//~ todo: something better?
	_log("toggleTabPrivate(): " + tab.url);
	var isPrivate = tab.cookieStoreId == privateContainerId;
	var opts = {
		url: tab.url,
		index: tab.index + 1,
		active: tab.active,
		pinned: tab.pinned
	};
	function openTab() {
		browser.tabs.create(opts).then(
			function onCreated() {
				browser.tabs.remove(tab.id);
			},
			function onError(e) {
				_err(e);
				notify(e);
			}
		);
	}
	if(isPrivate)
		openTab();
	else {
		getContainer(function(sId) {
			opts.cookieStoreId = sId;
			openTab();
		});
	}
}

browser.browserAction.onClicked.addListener(function() {
	_log("browserAction.onClicked");
	getContainer(function(sId) {
		browser.tabs.create({
			cookieStoreId: sId,
			active: true
		});
	});
});
browser.commands.onCommand.addListener(function(command) {
	_log("commands.onCommand: " + command);
});

function getPrivateTabsCount(callback, excludeTabId) {
	if(!privateContainerId)
		return callback(0);
	return browser.tabs.query({ cookieStoreId: privateContainerId }).then(function(tabs) {
		var count = 0;
		for(var tab of tabs)
			tab.id != excludeTabId && ++count;
		callback(count);
	}, _err);
}

browser.tabs.onRemoved.addListener(function(tabId, removeInfo) {
	// Note: browser.tabs.get(tabId) doesn't work: Error: Invalid tab ID: ###
	privateContainerId && getPrivateTabsCount(function(count) {
		_log("Tab removed, opened private tabs: " + count);
		!count && browser.contextualIdentities.remove(privateContainerId).then(function() {
			_log("Removed last private tab => remove container");
			privateContainerId = null;
			browser.storage.local.remove("privateContainerId");
		});
	}, tabId);
});

var privateContainerId;
function getContainer(callback) {
	if(privateContainerId)
		validateContainer(privateContainerId, callback);
	else
		createAndStoreContainer(callback);
}
function validateContainer(sId, callback) {
	browser.contextualIdentities.get(sId).then(function(context) {
		if(context)
			return callback(sId);
		_log("Container was removed, will create new one");
		return createAndStoreContainer(callback);
	}, _err);
}
function createAndStoreContainer(callback) {
	createContainer(function(sId) {
		if(sId) {
			privateContainerId = sId;
			browser.storage.local.set({
				privateContainerId: sId
			});
		}
		callback(sId);
	});
}
function createContainer(callback) {
	browser.contextualIdentities.create({
		name: browser.i18n.getMessage("containerName"),
		color: "purple",
		icon: "fingerprint"
	}).then(function(context) {
		var sId = context.cookieStoreId;
		if(sId) {
			_log("Created container: " + sId);
			return callback(sId);
		}
		// https://bugzilla.mozilla.org/show_bug.cgi?id=1354602
		// Expose enabling containers via web extensions, fixed in Firefox 57+
		var msg = "Unable to create container! Please set privacy.userContext.enabled = true in about:config";
		_err(msg);
		notify(msg);
	}, _err);
}
function notify(msg) {
	browser.notifications.create({
		"type": "basic",
		"iconUrl": browser.extension.getURL("icon.png"),
		"title": browser.i18n.getMessage("extensionName"),
		"message": "" + msg // Force stringify to display errors objects
	});
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
	if(prefs.debug)
		console.log(LOG_PREFIX + ts() + s);
}
function _err(s) {
	console.error(LOG_PREFIX + ts() + s);
}