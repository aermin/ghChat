"use strict";
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
exports.__esModule = true;
/* eslint-disable guard-for-in */
var getSQLConentMap_1 = require("./util/getSQLConentMap");
var db_1 = require("../src/app/utils/db");
// 打印脚本执行日志
var eventLog = function (err, sqlFile, index) {
    if (err) {
        console.log("[ERROR] sql\u811A\u672C\u6587\u4EF6: " + sqlFile + " \u7B2C" + (index + 1) + "\u6761\u811A\u672C \u6267\u884C\u5931\u8D25 o(\u256F\u25A1\u2570)o \uFF01");
    }
    else {
        console.log("[SUCCESS] sql\u811A\u672C\u6587\u4EF6: " + sqlFile + " \u7B2C" + (index
            + 1) + "\u6761\u811A\u672C \u6267\u884C\u6210\u529F O(\u2229_\u2229)O !");
    }
};
// 获取所有sql脚本内容
var sqlContentMap = getSQLConentMap_1.getSqlContentMap();
// 执行建表sql脚本
var createAllTables = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _i, key, sqlShell, sqlShellList, _c, _d, _e, i, shell, result, e_1_1;
    var e_1, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _a = [];
                for (_b in sqlContentMap)
                    _a.push(_b);
                _i = 0;
                _g.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 10];
                key = _a[_i];
                sqlShell = sqlContentMap[key];
                sqlShellList = sqlShell.split(';');
                _g.label = 2;
            case 2:
                _g.trys.push([2, 7, 8, 9]);
                _c = (e_1 = void 0, __values(sqlShellList.entries())), _d = _c.next();
                _g.label = 3;
            case 3:
                if (!!_d.done) return [3 /*break*/, 6];
                _e = __read(_d.value, 2), i = _e[0], shell = _e[1];
                if (!shell.trim()) return [3 /*break*/, 5];
                return [4 /*yield*/, db_1.query(shell)];
            case 4:
                result = _g.sent();
                if (result.serverStatus * 1 === 2) {
                    eventLog(null, key, i);
                }
                else {
                    eventLog(true, key, i);
                }
                _g.label = 5;
            case 5:
                _d = _c.next();
                return [3 /*break*/, 3];
            case 6: return [3 /*break*/, 9];
            case 7:
                e_1_1 = _g.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 9];
            case 8:
                try {
                    if (_d && !_d.done && (_f = _c["return"])) _f.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
                return [7 /*endfinally*/];
            case 9:
                _i++;
                return [3 /*break*/, 1];
            case 10:
                console.log('sql脚本执行结束！');
                console.log('请按 ctrl + c 键退出！');
                return [2 /*return*/];
        }
    });
}); };
createAllTables();
