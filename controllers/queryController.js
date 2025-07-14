const Query = require('../models/Query');
const path = require('path');
const { Parser } = require('json2csv');

// Export Queries to CSV
exports.exportToCSV = async (req, res) => {
  try {
    const queries = await Query.find().lean(); // Use lean for plain JS objects

    const fields = [
      'authorName',
      'sbNumber',
      'model',
      'revision',
      'status',
      'resolverName',
      'createdAt',
      'resolvedAt',
      'comment',
      'pdfFiles'
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(queries);

    res.header('Content-Type', 'text/csv');
    res.attachment('queries.csv');
    return res.send(csv);
  } catch (err) {
    res.status(500).send('Failed to export CSV: ' + err.message);
  }
};

// Create new query
exports.createQuery = async (req, res) => {
  try {
    const pdfFiles = req.files ? req.files.map(file => file.filename) : [];

    const query = new Query({
      ...req.body,
      pdfFiles,
    });

    await query.save();
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error saving query: ' + err.message);
  }
};

// Update query status and attach PDFs
exports.updateQuery = async (req, res) => {
  try {
    const pdfFiles = req.files ? req.files.map(file => file.filename) : [];

    const updateData = {
      ...req.body,
      status: 'Closed',
      resolvedAt: new Date(),
      $push: { pdfFiles: { $each: pdfFiles } }
    };

    await Query.findByIdAndUpdate(req.params.id, updateData);
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error updating query: ' + err.message);
  }
};

// Get all queries
exports.getAllQueries = async (req, res) => {
  const queries = await Query.find().sort({ createdAt: -1 });
  res.render('index', { queries });
};

// Serve PDF
exports.viewPDF = (req, res) => {
  const filePath = path.join(__dirname, '../uploads', req.params.filename);
  res.sendFile(filePath);
};
