import * as vscode from 'vscode';
import { JPDecode, JPEncode } from 'jampak';

const config = vscode.workspace.getConfiguration('jpk');

const endian = config.get<string>('defaultEndian');

const encrypt = config.get<boolean>('encrypt');

const compress = config.get<boolean>('compress');

const CRC32 = config.get<boolean>('CRC32');

export function decodeJpkToJson(buffer: Uint8Array): {data: any, msg: string, errored: boolean} {
    try {
        const decoder = new JPDecode({makeJSON:true});
        const decoded = decoder.decode(buffer);
        var obj = {
            data:decoded,
            msg: decoder.errorMessage,
            errored: false
        };
        if(decoder.errored === true){
            obj.msg = decoder.errorMessage;
            obj.errored = true;
            return obj;
        }
        if(decoder.validJSON !== true){
            vscode.window.showWarningMessage("Converted file had non-valid JSON data, re-endcoding JSON won't produce same file.");
        }
        return obj;
    } catch (error) {
        throw new Error(error as string);
    }
};

export function encodeJsonToJpk(json: any): {data: Buffer, msg: string, errored: boolean} {
    try {
        const encoder = new JPEncode({
            endian: endian as "little" | "big",
            encrypt: encrypt,
            compress: compress,
            CRC32: CRC32,
        });
        const data = encoder.encode(json);
        var obj = {
            data:data,
            msg: encoder.errorMessage,
            errored: false
        };
        if(encoder.errored === true){
            obj.msg = encoder.errorMessage;
            obj.errored = true;
            return obj;
        }

        if(data instanceof Buffer){
            return obj;
        } else {
            throw new Error("Encoding failed.");
        }
    } catch (error) {
        throw new Error(error as string);
    }
};