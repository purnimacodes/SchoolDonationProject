import mongoose from 'mongoose';
import xlsx from 'xlsx';
import dotenv from 'dotenv';
import { School } from './Models/school.model.js';
import { Facility } from './Models/facility.model.js';
import connectdb from './db/index.js';

dotenv.config();

const cleanString = (val) => {
    if (val === null || val === undefined) return '0';
    if (typeof val === 'string') {
        let trimmed = val.trim();
        if (!trimmed || trimmed.toLowerCase() === 'no') return '0';
        if (trimmed.toLowerCase() === 'yes') return '1';
        return trimmed;
    }
    return String(val);
};

const cleanYesNo = (val) => {
    if (val === null || val === undefined) return 'NO';
    if (typeof val === 'string') {
        let trimmed = val.trim().toUpperCase();
        if (['YES', 'NO'].includes(trimmed)) return trimmed;
        // if it's a number > 0, consider it YES, else NO
        let num = parseInt(trimmed, 10);
        if (!isNaN(num)) return num > 0 ? 'YES' : 'NO';
        return trimmed;
    }
    if (typeof val === 'number') return val > 0 ? 'YES' : 'NO';
    return 'NO';
};

const seed = async () => {
    await connectdb();

    const filePath = 'c:/Users/Admin/Desktop/SchoolDonationProject/backend/public/SCHOOL INFRASTRUCTURE All Block 01-09-2026.xlsx';
    console.log(`Reading Excel file: ${filePath}`);
    const workbook = xlsx.readFile(filePath);

    // Clear existing data (optional, but good for idempotent seeds)
    await School.deleteMany({});
    await Facility.deleteMany({});
    console.log("Cleared existing schools and facilities.");

    for (let sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
        const blockName = sheetName.trim();
        
        console.log(`Processing block: ${blockName}, Total rows: ${data.length}`);

        // Find header row index
        let headerRowIdx = -1;
        for (let i = 0; i < Math.min(10, data.length); i++) {
            if (data[i] && data[i].some(cell => typeof cell === 'string' && (cell.toLowerCase().includes('sl. no') || cell.toLowerCase().includes('school name')))) {
                headerRowIdx = i;
                break;
            }
        }

        if (headerRowIdx === -1) {
            console.log(`Could not find header row in sheet ${sheetName}. Skipping...`);
            continue;
        }

        // Data starts at headerRowIdx + 3 based on structure
        const dataStartIdx = headerRowIdx + 3;

        for (let i = dataStartIdx; i < data.length; i++) {
            const row = data[i];
            
            // Skip empty rows or rows without school name
            if (!row || !row[1] || String(row[1]).trim() === '') continue;

            const schoolName = String(row[1]).trim();
            const slNo = parseInt(row[0], 10) || 0;

            try {
                const school = new School({
                    name: schoolName,
                    block: blockName,
                    slNo: slNo
                });

                const savedSchool = await school.save();

                const facility = new Facility({
                    school: savedSchool._id,
                    classRooms: {
                        available: cleanString(row[2]),
                        required: cleanString(row[3])
                    },
                    buildingElectricity: {
                        light: {
                            available: cleanString(row[4]),
                            required: cleanString(row[5])
                        },
                        fan: {
                            available: cleanString(row[6]),
                            required: cleanString(row[7])
                        }
                    },
                    drinkingWater: {
                        available: cleanString(row[8]),
                        required: cleanString(row[9])
                    },
                    benchDesk: {
                        available: cleanString(row[10]),
                        required: cleanString(row[11])
                    },
                    boysToilet: {
                        available: cleanString(row[12]),
                        required: cleanString(row[13])
                    },
                    girlsToilet: {
                        available: cleanString(row[14]),
                        required: cleanString(row[15])
                    },
                    cwsnToilet: {
                        available: cleanString(row[16]),
                        required: cleanString(row[17])
                    },
                    playground: cleanYesNo(row[18]),
                    ramp: cleanYesNo(row[19]),
                    boundaryWall: cleanString(row[20]), // boundary wall is sometimes length e.g. "10115 feet" or YES/NO
                    kitchenMdm: cleanYesNo(row[21])
                });

                const savedFacility = await facility.save();

                // map facility to school
                savedSchool.facility = savedFacility._id;
                await savedSchool.save();

            } catch (err) {
                console.error(`Error saving school ${schoolName} in block ${blockName}:`, err.message);
            }
        }
    }

    console.log("Seeding completed successfully.");
    process.exit(0);
};

seed();
