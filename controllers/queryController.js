import Query, { find, findByIdAndUpdate } from '../models/Query';
import { join } from 'path';
import { Parser } from 'json2csv';

// Export Queries to CSV
export async function exportToCSV(req, res) {
  try {
    const queries = await find().lean(); // Use lean for plain JS objects

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
}

// Create new query
export async function createQuery(req, res) {
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
}

// Update query status and attach PDFs
export async function updateQuery(req, res) {
  try {
    const pdfFiles = req.files ? req.files.map(file => file.filename) : [];

    const updateData = {
      ...req.body,
      status: 'Closed',
      resolvedAt: new Date(),
      $push: { pdfFiles: { $each: pdfFiles } }
    };

    await findByIdAndUpdate(req.params.id, updateData);
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error updating query: ' + err.message);
  }
}

// Get all queries
export async function getAllQueries(req, res) {
  const queries = await find().sort({ createdAt: -1 });
  res.render('index', { queries });
}

// Serve PDF
export function viewPDF(req, res) {
  const filePath = join(__dirname, '../uploads', req.params.filename);
  res.sendFile(filePath);
}
