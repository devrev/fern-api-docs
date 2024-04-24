"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.works = exports.webhooks = exports.timelineEntries = exports.tags = exports.slas = exports.revOrgs = exports.parts = exports.devUsers = exports.authConnection = exports.authTokens = exports.artifacts = exports.accounts = void 0;
exports.accounts = __importStar(require("./accounts"));
__exportStar(require("./accounts/client/requests"), exports);
exports.artifacts = __importStar(require("./artifacts"));
__exportStar(require("./artifacts/client/requests"), exports);
exports.authTokens = __importStar(require("./authTokens"));
__exportStar(require("./authTokens/client/requests"), exports);
exports.authConnection = __importStar(require("./authConnection"));
__exportStar(require("./authConnection/client/requests"), exports);
exports.devUsers = __importStar(require("./devUsers"));
__exportStar(require("./devUsers/client/requests"), exports);
exports.parts = __importStar(require("./parts"));
__exportStar(require("./parts/client/requests"), exports);
exports.revOrgs = __importStar(require("./revOrgs"));
__exportStar(require("./revOrgs/client/requests"), exports);
exports.slas = __importStar(require("./slas"));
__exportStar(require("./slas/client/requests"), exports);
exports.tags = __importStar(require("./tags"));
__exportStar(require("./tags/client/requests"), exports);
exports.timelineEntries = __importStar(require("./timelineEntries"));
__exportStar(require("./timelineEntries/client/requests"), exports);
exports.webhooks = __importStar(require("./webhooks"));
__exportStar(require("./webhooks/client/requests"), exports);
exports.works = __importStar(require("./works"));
__exportStar(require("./works/client/requests"), exports);
