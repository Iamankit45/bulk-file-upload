
export function validateRecords(records) {
    if (!Array.isArray(records) || records.length === 0) {
        throw new Error("No records to validate.");
    }

    const validRecords = [];
    const invalidRecords = [];

    
    const fields = Object.keys(records[0]);

    records.forEach((record, index) => {
        const errors = [];

        fields.forEach((field) => {
            const value = record[field];

            
            if (value === undefined || value === null || value === '') {
                errors.push(`Field "${field}" cannot be empty.`);
            }

            
            if (!isNaN(value) && typeof value === 'string' && isNaN(Number(value))) {
                errors.push(`Field "${field}" must contain a valid number if numeric.`);
            }
        });

       
        if (errors.length === 0) {
            validRecords.push(record);
        } else {
            invalidRecords.push({
                record,
                errors,
                index,
            });
        }
    });

    return { validRecords, invalidRecords };
}
