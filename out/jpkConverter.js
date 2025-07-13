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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeJpkToJson = decodeJpkToJson;
exports.encodeJsonToJpk = encodeJsonToJpk;
const vscode = __importStar(require("vscode"));
const jampak_1 = require("jampak");
const config = vscode.workspace.getConfiguration('jpk');
const endian = config.get('defaultEndian');
const encrypt = config.get('encrypt');
const compress = config.get('compress');
const CRC32 = config.get('CRC32');
function decodeJpkToJson(buffer) {
    try {
        const decoder = new jampak_1.JPDecode({ makeJSON: true });
        const decoded = decoder.decode(buffer);
        var obj = {
            data: decoded,
            msg: decoder.errorMessage,
            errored: false
        };
        if (decoder.errored === true) {
            obj.msg = decoder.errorMessage;
            obj.errored = true;
            return obj;
        }
        if (decoder.validJSON !== true) {
            vscode.window.showWarningMessage("Converted file had non-valid JSON data, re-endcoding JSON won't produce same file.");
        }
        return obj;
    }
    catch (error) {
        throw new Error(error);
    }
}
;
function encodeJsonToJpk(json) {
    try {
        const encoder = new jampak_1.JPEncode({
            endian: endian,
            encrypt: encrypt,
            compress: compress,
            CRC32: CRC32,
        });
        const data = encoder.encode(json);
        var obj = {
            data: data,
            msg: encoder.errorMessage,
            errored: false
        };
        if (encoder.errored === true) {
            obj.msg = encoder.errorMessage;
            obj.errored = true;
            return obj;
        }
        if (data instanceof Buffer) {
            return obj;
        }
        else {
            throw new Error("Encoding failed.");
        }
    }
    catch (error) {
        throw new Error(error);
    }
}
;
