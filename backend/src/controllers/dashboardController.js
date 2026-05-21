const Income = require('../models/Income');
const Expenditure = require('../models/Expenditure');

function monthRange(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
  return { start, end };
}

exports.getDashboard = async (req, res) => {
  try {
    const { start, end } = monthRange();
    const yearStart = new Date(new Date().getFullYear(), 0, 1);

    const [totalIncome, totalExpense, monthlyIncome, monthlyExpense, pendingExpenses, recentIncome, recentExpense, incomeBySource, expenseByCategory] =
      await Promise.all([
        Income.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
        Expenditure.aggregate([
          { $match: { status: 'approved' } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        Income.aggregate([
          { $match: { date: { $gte: start, $lte: end } } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        Expenditure.aggregate([
          { $match: { date: { $gte: start, $lte: end }, status: 'approved' } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        Expenditure.countDocuments({ status: 'pending' }),
        Income.find().sort({ date: -1 }).limit(8).populate('createdBy', 'name'),
        Expenditure.find().sort({ date: -1 }).limit(8).populate('createdBy', 'name'),
        Income.aggregate([
          { $match: { date: { $gte: yearStart } } },
          { $group: { _id: '$source', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        ]),
        Expenditure.aggregate([
          { $match: { date: { $gte: yearStart }, status: 'approved' } },
          { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        ]),
      ]);

    const incomeTotal = totalIncome[0]?.total || 0;
    const expenseTotal = totalExpense[0]?.total || 0;

    const monthlyTrend = await getMonthlyTrend(6);

    res.json({
      balance: incomeTotal - expenseTotal,
      totalIncome: incomeTotal,
      totalExpense: expenseTotal,
      monthlyIncome: monthlyIncome[0]?.total || 0,
      monthlyExpense: monthlyExpense[0]?.total || 0,
      pendingPayments: pendingExpenses,
      recentTransactions: [
        ...recentIncome.map((i) => ({ ...i.toObject(), type: 'income' })),
        ...recentExpense.map((e) => ({ ...e.toObject(), type: 'expense' })),
      ]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10),
      incomeBySource,
      expenseByCategory,
      monthlyTrend,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

async function getMonthlyTrend(months) {
  const result = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
    const [inc, exp] = await Promise.all([
      Income.aggregate([
        { $match: { date: { $gte: start, $lte: end } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Expenditure.aggregate([
        { $match: { date: { $gte: start, $lte: end }, status: 'approved' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);
    result.push({
      month: start.toLocaleString('en', { month: 'short', year: 'numeric' }),
      income: inc[0]?.total || 0,
      expense: exp[0]?.total || 0,
    });
  }
  return result;
}

exports.getPublicSummary = async (req, res) => {
  try {
    const { year, month } = req.query;
    const y = parseInt(year, 10) || new Date().getFullYear();
    const m = month !== undefined ? parseInt(month, 10) : new Date().getMonth();
    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 0, 23, 59, 59);

    const matchIncome = { date: { $gte: start, $lte: end }, isPublic: true };
    const matchExpense = { date: { $gte: start, $lte: end }, status: 'approved', isPublic: true };

    const [income, expense, incomeBySource, expenseByCategory] = await Promise.all([
      Income.aggregate([{ $match: matchIncome }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Expenditure.aggregate([{ $match: matchExpense }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Income.aggregate([
        { $match: matchIncome },
        { $group: { _id: '$source', total: { $sum: '$amount' } } },
      ]),
      Expenditure.aggregate([
        { $match: matchExpense },
        { $group: { _id: '$category', total: { $sum: '$amount' } } },
      ]),
    ]);

    const totalInc = income[0]?.total || 0;
    const totalExp = expense[0]?.total || 0;

    res.json({
      period: { year: y, month: m + 1, label: start.toLocaleString('en', { month: 'long', year: 'numeric' }) },
      totalCollections: totalInc,
      totalExpenditures: totalExp,
      balance: totalInc - totalExp,
      incomeBySource,
      expenseByCategory,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
