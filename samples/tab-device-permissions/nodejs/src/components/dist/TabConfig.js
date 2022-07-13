"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var react_1 = require("react");
require("../App.css");
var microsoftTeams = require("@microsoft/teams-js");
/**
 * The 'Config' component is used to display your group tabs
 * user configuration options.  Here you will allow the user to
 * make their choices and once they are done you will need to validate
 * their choices and communicate that to Teams to enable the save button.
 */
var TabConfig = /** @class */ (function (_super) {
    __extends(TabConfig, _super);
    function TabConfig() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TabConfig.prototype.render = function () {
        // Initialize the Microsoft Teams SDK
        microsoftTeams.initialize();
        /**
         * When the user clicks "Save", save the url for your configured tab.
         * This allows for the addition of query string parameters based on
         * the settings selected by the user.
         */
        microsoftTeams.settings.registerOnSaveHandler(function (saveEvent) {
            var baseUrl = "https://" + window.location.hostname + ":" + window.location.port;
            microsoftTeams.settings.setSettings({
                suggestedDisplayName: "My Device Tab",
                entityId: "Test",
                contentUrl: baseUrl + "/tab",
                websiteUrl: baseUrl + "/tab"
            });
            saveEvent.notifySuccess();
        });
        /**
         * After verifying that the settings for your tab are correctly
         * filled in by the user you need to set the state of the dialog
         * to be valid.  This will enable the save button in the configuration
         * dialog.
         */
        microsoftTeams.settings.setValidityState(true);
        return (react_1["default"].createElement("div", null,
            react_1["default"].createElement("h1", null, "Tab Configuration"),
            react_1["default"].createElement("div", null, "This is where you will add your tab configuration options the user can choose when the tab is added to your team/group chat.")));
    };
    return TabConfig;
}(react_1["default"].Component));
exports["default"] = TabConfig;

//# sourceMappingURL=TabConfig.js.map
