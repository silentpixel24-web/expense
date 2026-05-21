const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const Income = require('../models/Income');
const Expenditure = require('../models/Expenditure');
const appConfig = require('../config/app');

function getPeriodRange(year, month) {
  if (month !== undefined && month !== null && month !== '') {
    const m = parseInt(month, 10);
    const y = parseInt(year, 10) || new Date().getFullYear();
    return {
      start: new Date(y, m, 1),
      end: new Date(y, m + 1, 0, 23, 59, 59),
      label: new Date(y, m, 1).toLocaleString('en', { month: 'long', year: 'numeric' }),
    };
  }
  const y = parseInt(year, 10) || new Date().getFullYear();
  return {
    start: new Date(y, 0, 1),
    end: new Date(y, 11, 31, 23, 59, 59),
    label: `Year ${y}`,
  };
}

async function fetchReportData(start, end) {
  const dateMatch = { date: { $gte: start, $lte: end } };
  const [incomes, expenses, incomeBySource, expenseByCategory] = await Promise.all([
    Income.find({ ...dateMatch }).sort({ date: -1 }),
    Expenditure.find({ ...dateMatch, status: 'approved' }).sort({ date: -1 }),
    Income.aggregate([
      { $match: dateMatch },
      { $group: { _id: '$source', total: { $sum: '$amount' } } },
    ]),
    Expenditure.aggregate([
      { $match: { ...dateMatch, status: 'approved' } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
    ]),
  ]);
  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  return { incomes, expenses, incomeBySource, expenseByCategory, totalIncome, totalExpense };
}

exports.getReport = async (req, res) => {
  try {
    const { year, month } = req.query;
    const { start, end, label } = getPeriodRange(year, month);
    const data = await fetchReportData(start, end);
    res.json({ period: label, ...data, balance: data.totalIncome - data.totalExpense });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.exportPdf = async (req, res) => {
  try {
    const { year, month } = req.query;
    const { start, end, label } = getPeriodRange(year, month);
    const { incomes, expenses, totalIncome, totalExpense } = await fetchReportData(start, end);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=mosque-report-${label.replace(/\s/g, '-')}.pdf`);

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);
    doc.fontSize(18).text(`${appConfig.mosqueName} — Financial Report`, { align: 'center' });
    doc.fontSize(12).text(label, { align: 'center' });
    doc.moveDown();
    const sym = appConfig.currencySymbol;
    doc.text(`Total Income: ${sym}${totalIncome.toLocaleString('en-IN')}`);
    doc.text(`Total Expenditure: ${sym}${totalExpense.toLocaleString('en-IN')}`);
    doc.text(`Balance: ${sym}${(totalIncome - totalExpense).toLocaleString('en-IN')}`);
    doc.moveDown().text('Income Records', { underline: true });
    incomes.slice(0, 50).forEach((i) => {
      doc.fontSize(10).text(`${i.receiptNumber} | ${i.source} | ${sym}${i.amount} | ${new Date(i.date).toLocaleDateString()}`);
    });
    doc.moveDown().text('Expenditure Records', { underline: true });
    expenses.slice(0, 50).forEach((e) => {
      doc.fontSize(10).text(`${e.referenceNumber} | ${e.category} | ${sym}${e.amount} | ${new Date(e.date).toLocaleDateString()}`);
    });
    doc.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.exportExcel = async (req, res) => {
  try {
    const { year, month } = req.query;
    const { start, end, label } = getPeriodRange(year, month);
    const { incomes, expenses, totalIncome, totalExpense } = await fetchReportData(start, end);

    const workbook = new ExcelJS.Workbook();
    const summary = workbook.addWorksheet('Summary');
    summary.addRows([
      [`${appConfig.mosqueName} Financial Report`, label],
      ['Total Income', totalIncome],
      ['Total Expenditure', totalExpense],
      ['Balance', totalIncome - totalExpense],
    ]);

    const incSheet = workbook.addWorksheet('Income');
    incSheet.columns = [
      { header: 'Receipt', key: 'receiptNumber', width: 18 },
      { header: 'Source', key: 'source', width: 20 },
      { header: 'Amount', key: 'amount', width: 12 },
      { header: 'Date', key: 'date', width: 14 },
      { header: 'Donor', key: 'donorName', width: 20 },
    ];
    incomes.forEach((i) => incSheet.addRow({ ...i.toObject(), date: new Date(i.date).toLocaleDateString() }));

    const expSheet = workbook.addWorksheet('Expenditure');
    expSheet.columns = [
      { header: 'Reference', key: 'referenceNumber', width: 18 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Amount', key: 'amount', width: 12 },
      { header: 'Date', key: 'date', width: 14 },
      { header: 'Vendor', key: 'vendor', width: 20 },
    ];
    expenses.forEach((e) => expSheet.addRow({ ...e.toObject(), date: new Date(e.date).toLocaleDateString() }));

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=mosque-report-${label.replace(/\s/g, '-')}.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
