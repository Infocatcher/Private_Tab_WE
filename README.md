WebExtensions port of <a href="https://github.com/Infocatcher/Private_Tab">Private Tab</a> extension for Firefox/SeaMonkey (see <a href="https://github.com/Infocatcher/Private_Tab/issues/254">Private_Tab#254</a>).

## Issues
<table>
<thead>
	<tr>
		<th>Description</th>
		<th>Part</th>
		<th>Status</th>
		<th>Severity</th>
		<th>Firefox bug</th>
	</tr>
</thead>
<tbody>
	<tr>
		<td>Ability to create private containers</td>
		<td>Core functionality</td>
		<td>No API</td>
		<td><strong>Block</strong></td>
		<td><a href="https://github.com/mozilla/multi-account-containers/issues/47">#47</a></td>
	</tr>
	<tr>
		<td>Ability to manually clear container data (as a temporary replacement for really private tabs)</td>
		<td>Core functionality</td>
		<td>No API</td>
		<td><strong>Block</strong></td>
		<td><a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1353726">Bug 1353726</a></td>
	</tr>
	<tr>
		<td><del>Ability to programmatically enable containers</del></td>
		<td><del>Core functionality</del></td>
		<td><del>No API</del><br><em>Fixed in Firefox 57+</em></td>
		<td><del>Major</del></td>
		<td><del><a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1354602">Bug 1354602</a></del></td>
	</tr>
	<tr>
		<td><del>Browser behavior for “open link in new tab” (<em>browser.tabs.insertRelatedAfterCurrent</em> & Co)</del></td>
		<td><del>UX</del></td>
		<td><del>No API</del><br><em><a href="https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/tabs/create">browser.tabs.create({ openerTabId: … })</a> in Firefox 57+</td>
		<td><del>Major</del></td>
		<td></td>
	</tr>
	<tr>
		<td><del>Items in bookmark/history context menu</del></td>
		<td><del>Additional functionality</del></td>
		<td><del>No API</del> Implemented in Firefox 59+</td>
		<td><del>Minor</del></td>
		<td><del><a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1370499">Bug 1370499</a></del></td>
	</tr>
	<tr>
		<td><del>Ability to update menu item right before menu opening (to implement “Private Tab” checkbox in tab context menu)</del></td>
		<td><del>UX</del></td>
		<td><del>No API</del><br><em><a href="https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/menus/onShown">browser.menus.onShown</a> in Firefox 60+</em></td>
		<td><del>Minor</del></td>
		<td></td>
	</tr>
	<tr>
		<td>Ability to move tab into another container (for “Private Tab” checkbox in tab context menu), to restore not only URL</td>
		<td>Additional functionality, UX</td>
		<td>No API</td>
		<td>Minor</td>
		<td></td>
	</tr>
	<tr>
		<td>Special private:… protocol to open URIs in private tabs</td>
		<td>Additional functionality</td>
		<td>No API</td>
		<td>Minor</td>
		<td><a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1271553">Bug 1271553</a></td>
	</tr>
	<tr>
		<td>Cleanup on disabling/uninstalling: <a href="https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/onSuspend">browser.runtime.onSuspend()</a>, <a href="https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/onSuspendCanceled">browser.runtime.onSuspendCanceled()</a></td>
		<td>Internals + UX</td>
		<td>Not implemented Chrome API</td>
		<td>Minor</td>
		<td></td>
	</tr>
	<tr>
		<td>Toolbar button after last tab</td>
		<td>UI</td>
		<td>No API</td>
		<td>Minor</td>
		<td></td>
	</tr>
	<tr>
		<td>Configurable <a href="https://developer.mozilla.org/en-US/Add-ons/WebExtensions/manifest.json/commands">keyboard shortcuts</a> (note: also not possible to assign Ctrl+Alt+<em>X</em>)</td>
		<td>UX</td>
		<td><del>No API</del><br><em><a href="https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/commands/update">browser.commands.update()</a> in Firefox 60+</em></td>
		<td>Minor</td>
		<td><del><a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1421811">Bug 1421811</a></del>, <a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1303384">bug 1303384</a></td>
	</tr>
</tbody>
</table>