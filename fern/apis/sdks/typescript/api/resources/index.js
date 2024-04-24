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
exports.artifacts = __importStar(require("./artifacts"));
exports.authTokens = __importStar(require("./authTokens"));
exports.authConnection = __importStar(require("./authConnection"));
exports.devUsers = __importStar(require("./devUsers"));
exports.parts = __importStar(require("./parts"));
exports.revOrgs = __importStar(require("./revOrgs"));
exports.slas = __importStar(require("./slas"));
exports.tags = __importStar(require("./tags"));
exports.timelineEntries = __importStar(require("./timelineEntries"));
exports.webhooks = __importStar(require("./webhooks"));
exports.works = __importStar(require("./works"));
__exportStar(require("./accounts/client/requests"), exports);
__exportStar(require("./artifacts/client/requests"), exports);
__exportStar(require("./authTokens/client/requests"), exports);
__exportStar(require("./authConnection/client/requests"), exports);
__exportStar(require("./devUsers/client/requests"), exports);
__exportStar(require("./parts/client/requests"), exports);
__exportStar(require("./revOrgs/client/requests"), exports);
__exportStar(require("./slas/client/requests"), exports);
__exportStar(require("./tags/client/requests"), exports);
__exportStar(require("./timelineEntries/client/requests"), exports);
__exportStar(require("./webhooks/client/requests"), exports);
__exportStar(require("./works/client/requests"), exports);
