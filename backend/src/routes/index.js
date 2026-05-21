const express = require('express');
const authController = require('../controllers/authController');
const dashboardController = require('../controllers/dashboardController');
const incomeController = require('../controllers/incomeController');
const expenditureController = require('../controllers/expenditureController');
const reportController = require('../controllers/reportController');
const noticeController = require('../controllers/noticeController');
const miscController = require('../controllers/miscController');
const { auth, canWriteFinance, canApproveExpense, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/auth/login', authController.login);
router.get('/public/summary', dashboardController.getPublicSummary);
router.get('/public/notices', noticeController.listPublic);
router.get('/public/config', miscController.getPublicConfig);
router.get('/public/donation-qr', miscController.donationQr);

router.use(auth);
router.get('/auth/me', authController.me);
router.post('/auth/register', adminOnly, authController.register);
router.get('/users', adminOnly, authController.listUsers);

router.get('/dashboard', dashboardController.getDashboard);

router.get('/income', incomeController.list);
router.get('/income/:id', incomeController.getOne);
router.post('/income', canWriteFinance, upload.single('receipt'), incomeController.create);
router.put('/income/:id', canWriteFinance, upload.single('receipt'), incomeController.update);
router.delete('/income/:id', canWriteFinance, incomeController.remove);

router.get('/expenditure', expenditureController.list);
router.get('/expenditure/:id', expenditureController.getOne);
router.post('/expenditure', canWriteFinance, upload.single('bill'), expenditureController.create);
router.put('/expenditure/:id', canWriteFinance, upload.single('bill'), expenditureController.update);
router.patch('/expenditure/:id/approve', canApproveExpense, expenditureController.approve);
router.delete('/expenditure/:id', canWriteFinance, expenditureController.remove);

router.get('/reports', reportController.getReport);
router.get('/reports/pdf', reportController.exportPdf);
router.get('/reports/excel', reportController.exportExcel);

router.get('/notices', noticeController.list);
router.post('/notices', canWriteFinance, noticeController.create);
router.put('/notices/:id', canWriteFinance, noticeController.update);
router.delete('/notices/:id', adminOnly, noticeController.remove);

router.get('/assets', miscController.assets.list);
router.post('/assets', canWriteFinance, miscController.assets.create);
router.put('/assets/:id', canWriteFinance, miscController.assets.update);
router.delete('/assets/:id', adminOnly, miscController.assets.remove);

router.get('/employees', miscController.employees.list);
router.post('/employees', canWriteFinance, miscController.employees.create);
router.put('/employees/:id', canWriteFinance, miscController.employees.update);
router.delete('/employees/:id', adminOnly, miscController.employees.remove);

router.get('/events', miscController.events.list);
router.post('/events', canWriteFinance, miscController.events.create);
router.put('/events/:id', canWriteFinance, miscController.events.update);
router.delete('/events/:id', adminOnly, miscController.events.remove);

router.get('/maintenance', miscController.maintenance.list);
router.post('/maintenance', canWriteFinance, miscController.maintenance.create);
router.put('/maintenance/:id', canWriteFinance, miscController.maintenance.update);
router.delete('/maintenance/:id', adminOnly, miscController.maintenance.remove);

router.get('/inventory', miscController.inventory.list);
router.post('/inventory', canWriteFinance, miscController.inventory.create);
router.put('/inventory/:id', canWriteFinance, miscController.inventory.update);
router.delete('/inventory/:id', adminOnly, miscController.inventory.remove);

router.get('/activity-logs', adminOnly, miscController.activityLogs);
router.post('/notify', adminOnly, miscController.notify);

module.exports = router;
