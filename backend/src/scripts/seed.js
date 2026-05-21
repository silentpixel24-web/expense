require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Income = require('../models/Income');
const Expenditure = require('../models/Expenditure');
const Notice = require('../models/Notice');
const Asset = require('../models/Asset');
const Employee = require('../models/Employee');
const Event = require('../models/Event');
const MaintenanceLog = require('../models/MaintenanceLog');
const Inventory = require('../models/Inventory');
const { createAuditHash } = require('../utils/audit');

async function seedData() {
  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Income.deleteMany({}),
    Expenditure.deleteMany({}),
    Notice.deleteMany({}),
    Asset.deleteMany({}),
    Employee.deleteMany({}),
    Event.deleteMany({}),
    MaintenanceLog.deleteMany({}),
    Inventory.deleteMany({}),
  ]);

  const admin = await User.create({
    name: 'Mosque Admin',
    email: 'admin@mosque.local',
    password: 'admin123',
    role: 'admin',
    phone: '+919876543210',
  });
  const treasurer = await User.create({
    name: 'Abdul Rahman',
    email: 'treasurer@mosque.local',
    password: 'treasurer123',
    role: 'treasurer',
  });
  await User.create({
    name: 'Finance Accountant',
    email: 'accountant@mosque.local',
    password: 'accountant123',
    role: 'accountant',
  });
  await User.create({
    name: 'Committee Viewer',
    email: 'viewer@mosque.local',
    password: 'viewer123',
    role: 'viewer',
  });

  const now = new Date();
  const incomes = [
    { source: 'friday_collection', amount: 12500, donorName: 'Jummah Collection' },
    { source: 'donation_box', amount: 3200 },
    { source: 'zakat', amount: 45000, donorName: 'Anonymous', paymentMethod: 'bank' },
    { source: 'sadaqah', amount: 5000, donorName: 'Ahmed Khan' },
    { source: 'building_fund', amount: 75000, donorName: 'Construction Fund' },
    { source: 'monthly_member', amount: 15000, description: 'Monthly member contributions' },
    { source: 'ramadan_collection', amount: 98000, description: 'Ramadan special collection' },
    { source: 'online_donation', amount: 12000, paymentMethod: 'upi' },
    { source: 'event_contribution', amount: 8500, description: 'Milad program' },
  ];

  let incNum = 1;
  for (const inc of incomes) {
    const d = new Date(now);
    d.setDate(d.getDate() - Math.floor(Math.random() * 90));
    const receiptNumber = `INC-${d.getFullYear()}-${String(incNum++).padStart(5, '0')}`;
    await Income.create({
      ...inc,
      receiptNumber,
      date: d,
      createdBy: treasurer._id,
      auditHash: createAuditHash({ ...inc, receiptNumber }),
    });
  }

  const expenses = [
    { category: 'imam_salary', amount: 25000, vendor: 'Imam Salary', status: 'approved' },
    { category: 'muazzin_salary', amount: 12000, vendor: 'Muazzin Salary', status: 'approved' },
    { category: 'electricity', amount: 4500, vendor: 'TNEB', status: 'approved' },
    { category: 'water', amount: 800, vendor: 'Municipality', status: 'approved' },
    { category: 'cleaning', amount: 3000, vendor: 'Cleaning Service', status: 'approved' },
    { category: 'maintenance', amount: 6500, vendor: 'AC Repair', status: 'approved' },
    { category: 'construction', amount: 120000, vendor: 'Builder Co', status: 'approved' },
    { category: 'charity', amount: 15000, vendor: 'Food Distribution', status: 'approved' },
    { category: 'food', amount: 8000, vendor: 'Iftar Supplies', status: 'pending' },
    { category: 'education', amount: 5000, vendor: 'Quran Class Materials', status: 'pending' },
  ];

  let expNum = 1;
  for (const exp of expenses) {
    const d = new Date(now);
    d.setDate(d.getDate() - Math.floor(Math.random() * 60));
    const referenceNumber = `EXP-${d.getFullYear()}-${String(expNum++).padStart(5, '0')}`;
    await Expenditure.create({
      ...exp,
      referenceNumber,
      date: d,
      createdBy: treasurer._id,
      approvedBy: exp.status === 'approved' ? admin._id : undefined,
      approvedAt: exp.status === 'approved' ? d : undefined,
      auditHash: createAuditHash({ ...exp, referenceNumber }),
    });
  }

  await Notice.create([
    {
      title: 'Monthly Financial Summary - April 2026',
      content: 'Total collections exceeded expenditures. Building fund progress at 65%.',
      type: 'financial_summary',
      isPublic: true,
    },
    {
      title: 'New Prayer Hall Extension',
      content: 'Construction phase 2 begins next month. Target: ₹15,00,000',
      type: 'construction',
      targetAmount: 1500000,
      raisedAmount: 975000,
      progressPercent: 65,
      isPublic: true,
    },
    {
      title: 'Ramadan Iftar Sponsorship',
      content: 'Sponsor daily iftar meals. ₹500 per day contribution welcome.',
      type: 'fundraising',
      targetAmount: 50000,
      raisedAmount: 22000,
      progressPercent: 44,
      isPublic: true,
    },
  ]);

  await Employee.create([
    { name: 'Maulana Yusuf', role: 'imam', salary: 25000, joinDate: new Date('2020-01-15') },
    { name: 'Ibrahim', role: 'muazzin', salary: 12000, joinDate: new Date('2021-06-01') },
    { name: 'Rahim', role: 'caretaker', salary: 8000, joinDate: new Date('2022-03-10') },
  ]);

  await Asset.create([
    { name: 'Sound System', category: 'equipment', purchaseValue: 45000, currentValue: 35000, condition: 'good' },
    { name: 'Prayer Mats (Set)', category: 'furniture', purchaseValue: 12000, currentValue: 10000, condition: 'excellent' },
    { name: 'Main Hall AC', category: 'equipment', purchaseValue: 85000, currentValue: 60000, condition: 'fair' },
  ]);

  await Event.create([
    { title: 'Ramadan Iftar Program', eventDate: new Date('2026-03-20'), budget: 50000, spent: 22000, status: 'ongoing' },
    { title: 'Eid Milad Celebration', eventDate: new Date('2026-09-15'), budget: 25000, status: 'planned' },
  ]);

  await MaintenanceLog.create([
    { area: 'Prayer Hall', description: 'AC servicing', cost: 2500, performedBy: 'Cool Air Services', status: 'completed' },
    { area: 'Wudu Area', description: 'Plumbing repair', cost: 1200, status: 'completed', nextDueDate: new Date('2026-08-01') },
  ]);

  await Inventory.create([
    { itemName: 'Prayer Mats', quantity: 120, unit: 'pcs', minStock: 50 },
    { itemName: 'Miswak', quantity: 200, unit: 'pcs', minStock: 100 },
    { itemName: 'Quran Copies', quantity: 45, unit: 'pcs', minStock: 20 },
  ]);

  console.log('\n✅ Seed completed!\n');
  console.log('Login credentials:');
  console.log('  Admin:      admin@mosque.local / admin123');
  console.log('  Treasurer:  treasurer@mosque.local / treasurer123');
  console.log('  Accountant: accountant@mosque.local / accountant123');
  console.log('  Viewer:     viewer@mosque.local / viewer123\n');
}

async function main() {
  await connectDB();
  await seedData();
  process.exit(0);
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = seedData;
