"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_client_1 = __importDefault(require("socket.io-client"));
var KRMS_Default_json_1 = __importDefault(require("./Settings/KRMS_Default.json"));
var KRMS_Text_json_1 = __importDefault(require("./KRMS_Text.json"));
var monitor_1 = require("./monitor");
var axios_1 = __importDefault(require("axios"));
var fs_1 = __importDefault(require("fs"));
var package_json_1 = __importDefault(require("./package.json"));
var CheckConfigFile = function () {
    return new Promise(function (resolve) {
        fs_1.default.stat('./KRMS_Setting.json', function (err, stats) {
            if (err) {
                console.log("설정 파일이 존재하지 않습니다.", process.cwd(), "에 새로 생성합니다.");
                fs_1.default.writeFile('./KRMS_Setting.json', JSON.stringify(KRMS_Default_json_1.default, null, 4), function () {
                    console.log("설정 파일을 수정 후 다시 실행해 주세요. https://github.com/Heavyrisem/KRMS_Client/blob/master/README.md");
                    process.exit();
                });
            }
            else {
                fs_1.default.readFile('./KRMS_Setting.json', function (err, data) {
                    var Setting;
                    try {
                        Setting = JSON.parse(data.toString());
                        resolve(Setting);
                    }
                    catch (err) {
                        console.log("JSON 파일을 읽는 중에 오류가 발생했습니다.", err);
                        process.exit();
                    }
                });
            }
        });
    });
};
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var Setting, Client, err_1, ServerResponse, socket, Requester;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log("KRMS Client Version", package_json_1.default.version);
                return [4 /*yield*/, CheckConfigFile()];
            case 1:
                Setting = _b.sent();
                Client = null;
                console.log(KRMS_Text_json_1.default.SettingLoadSuccess[Setting.language]);
                console.log(KRMS_Text_json_1.default.Agreement[Setting.language]);
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                _a = {
                    name: Setting.Server.Name
                };
                return [4 /*yield*/, monitor_1.init()];
            case 3:
                Client = (_a.system = _b.sent(),
                    _a.user = {
                        name: Setting.Server.KRMS_Account.name,
                        passwd: Setting.Server.KRMS_Account.passwd
                    },
                    _a);
                return [3 /*break*/, 5];
            case 4:
                err_1 = _b.sent();
                console.log("설정값이 올바르지 않습니다.");
                process.exit();
                return [3 /*break*/, 5];
            case 5:
                if (!Client)
                    return [2 /*return*/];
                console.log(KRMS_Text_json_1.default.Login[Setting.language], Client.name);
                return [4 /*yield*/, axios_1.default.post("http://kunrai.kro.kr:8898/Monitor/Login", Client.user)];
            case 6:
                ServerResponse = _b.sent();
                Client.user.passwd = undefined;
                if (!ServerResponse.data.name) {
                    console.log(KRMS_Text_json_1.default.LoginFaild[Setting.language], ServerResponse.data);
                    process.exit();
                }
                Client.user = ServerResponse.data;
                console.log(KRMS_Text_json_1.default.ConnectingToServer[Setting.language], Client.system.macaddr);
                socket = socket_io_client_1.default('ws://kunrai.kro.kr:8898', {
                    query: {
                        data: JSON.stringify(Client)
                    }
                });
                Requester = setInterval(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var Usage, _a;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _a = [__assign({}, monitor_1.GetSystemUsage())];
                                _b = {};
                                return [4 /*yield*/, monitor_1.GetDisksStatus()];
                            case 1:
                                Usage = __assign.apply(void 0, _a.concat([(_b.Drives = _c.sent(), _b)]));
                                socket.emit("UsageUpdate", Usage);
                                return [2 /*return*/];
                        }
                    });
                }); }, 30 * 1000);
                socket.on("Error", function (Response) {
                    console.log("ERR", Response.msg);
                    process.exit();
                });
                socket.on("error", function () {
                    console.log("error");
                    process.exit();
                });
                return [2 /*return*/];
        }
    });
}); })();
