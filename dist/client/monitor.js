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
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = exports.GetSystemUsage = exports.GetDisksStatus = void 0;
var osutill = __importStar(require("os-utils"));
var os = __importStar(require("os"));
var getmac = __importStar(require("getmac"));
var drivelist = __importStar(require("drivelist"));
var diskfree = require('diskfree');
var system = {
    memory: 0,
    cpu: {
        arch: os.arch(),
        coreCount: 0,
        name: ''
    },
    Drives: [],
    platform: os.platform(),
    os: os.version(),
    osversion: os.release(),
    macaddr: ''
};
var GetDriveFreeSize = function (path) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            diskfree.check(path, function (err, info) {
                if (err)
                    return reject(err);
                return resolve(info.free);
            });
            return [2 /*return*/];
        });
    }); });
};
var SystemInfo = function () {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var cores, drives, _i, drives_1, drive, _a, _b, networkinterfaces, keys;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    system.memory = os.totalmem();
                    cores = os.cpus();
                    system.cpu.name = cores[0].model;
                    system.cpu.coreCount = cores.length;
                    return [4 /*yield*/, drivelist.list()];
                case 1:
                    drives = _d.sent();
                    _i = 0, drives_1 = drives;
                    _d.label = 2;
                case 2:
                    if (!(_i < drives_1.length)) return [3 /*break*/, 5];
                    drive = drives_1[_i];
                    if (!drive.mountpoints.length)
                        return [3 /*break*/, 4];
                    _b = (_a = system.Drives).push;
                    _c = {
                        name: drive.description,
                        size: drive.size
                    };
                    return [4 /*yield*/, GetDriveFreeSize(drive.mountpoints[0].path)];
                case 3:
                    _b.apply(_a, [(_c.freesize = _d.sent(),
                            _c.mount = drive.mountpoints[drive.mountpoints.length - 1].path,
                            _c)]);
                    _d.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    networkinterfaces = os.networkInterfaces();
                    keys = Object.keys(networkinterfaces);
                    // system.macaddr = networkinterfaces[keys[0]][0].mac;
                    system.macaddr = getmac.default();
                    // system.macaddr = 'FakeServer';
                    resolve(system);
                    return [2 /*return*/];
            }
        });
    }); });
};
var cpuusage = [];
var memusage = [];
var MonitorSystemUsage = function (CollectInterval) {
    return setInterval(function () {
        memusage.push(1 - osutill.freememPercentage());
        osutill.cpuUsage(function (v) {
            cpuusage.push(v);
        });
        if (memusage.length >= 500)
            memusage.shift();
        if (cpuusage.length >= 500)
            cpuusage.shift();
    }, CollectInterval * 1000);
};
var GetDisksStatus = function () {
    return new Promise(function (resolve) { return __awaiter(void 0, void 0, void 0, function () {
        var result, _i, _a, Drive, _b, _c, _d;
        var _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    result = [];
                    _i = 0, _a = system.Drives;
                    _f.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    Drive = _a[_i];
                    _c = (_b = result).push;
                    _d = [__assign({}, Drive)];
                    _e = {};
                    return [4 /*yield*/, GetDriveFreeSize(Drive.mount)];
                case 2:
                    _c.apply(_b, [__assign.apply(void 0, _d.concat([(_e.freesize = _f.sent(), _e)]))]);
                    _f.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    resolve(result);
                    return [2 /*return*/];
            }
        });
    }); });
};
exports.GetDisksStatus = GetDisksStatus;
var GetSystemUsage = function () {
    var systemusage = {
        cpu: 0,
        memory: 0
    };
    if (!(cpuusage.length && memusage.length))
        return systemusage;
    var tmp = 0;
    for (var _i = 0, cpuusage_1 = cpuusage; _i < cpuusage_1.length; _i++) {
        var v = cpuusage_1[_i];
        tmp += v;
    }
    systemusage.cpu = tmp / cpuusage.length;
    cpuusage = [];
    tmp = 0;
    for (var _a = 0, memusage_1 = memusage; _a < memusage_1.length; _a++) {
        var v = memusage_1[_a];
        tmp += v;
    }
    systemusage.memory = tmp / memusage.length;
    memusage = [];
    return systemusage;
};
exports.GetSystemUsage = GetSystemUsage;
var init = function () {
    return new Promise(function (resolve) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    MonitorSystemUsage(2);
                    _a = resolve;
                    return [4 /*yield*/, SystemInfo()];
                case 1:
                    _a.apply(void 0, [_b.sent()]);
                    return [2 /*return*/];
            }
        });
    }); });
};
exports.init = init;
