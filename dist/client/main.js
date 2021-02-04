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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var Config = __importStar(require("./Config/main.json"));
var monitor_1 = require("./monitor");
var axios_1 = __importDefault(require("axios"));
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var Client, ServerResponse, socket, Requester;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = {
                    name: Config.name
                };
                return [4 /*yield*/, monitor_1.init()];
            case 1:
                Client = (_a.system = _b.sent(),
                    _a.user = {
                        name: Config.user.name,
                        passwd: Config.user.passwd
                    },
                    _a);
                console.log("Login...", Client.name);
                return [4 /*yield*/, axios_1.default.post("http://kunrai.kro.kr:8898/Monitor/Login", Client.user)];
            case 2:
                ServerResponse = _b.sent();
                Client.user.passwd = undefined;
                if (!ServerResponse.data.name)
                    return [2 /*return*/, console.log("LOGIN_FAIL", ServerResponse.data)];
                Client.user = ServerResponse.data;
                console.log("Connection to Server", Client.system.macaddr);
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
                });
                socket.on("Status", function (bool) {
                    console.log("Status", bool);
                });
                socket.on("error", function () {
                    console.log("error");
                });
                return [2 /*return*/];
        }
    });
}); })();
// const app = express();
// app.use(bodyParser.json());       // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//     extended: true
// }));
// app.post('/Monitor/GetStatus', async (req, res) => {
//     let response: ClientUsage = {
//         ...GetSystemUsage(),
//         Drives: await GetDisksStatus()
//     }
//     res.send(response);
// })
// app.listen(8899, async() => {
//     // await axios.post('http://localhost:8898/Monitor/ServerStarted', system);
//     let ServerResponse = await axios.post(`http://192.168.1.71:8898/Monitor/Login`, Client.user);
//     Client.user.passwd = undefined;
//     if (ServerResponse.data.name) {
//         console.log('Collecting System Information');
//         Client.user = ServerResponse.data;
//         ServerResponse = await axios.post(`http://192.168.1.71:8898/Monitor/ServerLogin`, {ServerInfo: Client});
//         console.log(ServerResponse.data)
//     } else {
//         console.log("Login Failed, ServerResponse:", ServerResponse.data);
//         process.exit(1);
//     }
// })
