import * as XLSX from 'xlsx';
import {parse} from 'csv-parse';

export async function parseCSVFile(fileBody) {
    return new Promise((resolve, reject) => {
        parse(fileBody, {
            columns: true,
            skip_empty_lines: true
        }, (err, output) => {
            if (err) {
                reject(err);
            } else {
                resolve(output);
            }
        });
    });
}

export function parseXLSXFile(fileBody) {
    const workbook = XLSX.read(fileBody, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet);
}

// Utility to parse XLS data
export function parseXLSFile(fileBody) {
    const workbook = XLSX.read(fileBody, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet);
}

export async function parseFile(fileBody, fileExtension) {
    switch (fileExtension.toLowerCase()) {
        case 'csv':
            return await parseCSVFile(fileBody);
        case 'xlsx':
            return parseXLSXFile(fileBody);
        case 'xls':
            return parseXLSFile(fileBody);
        default:
            throw new Error('Unsupported file type');
    }
}
