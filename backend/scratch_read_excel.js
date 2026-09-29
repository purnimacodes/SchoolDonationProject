import xlsx from 'xlsx';

const workbook = xlsx.readFile('c:/Users/Admin/Desktop/SchoolDonationProject/backend/public/SCHOOL INFRASTRUCTURE All Block 01-09-2026.xlsx');
const sheet = workbook.Sheets['Babubarhi '];
const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
console.log(JSON.stringify(data.slice(0, 10), null, 2));
