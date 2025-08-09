import Query from "../models/querySchema.js";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { Parser } from "json2csv";
import { generateQueryNumber } from "../helpers/queryNumbergenerator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// indexPage
export async function getAllQueries(req, res) {
  try {
    const searchTerm = req.query.search;
    console.log("Search Term:", searchTerm);
    let queryFilter = {};

    if (searchTerm) {
      queryFilter = {
        $or: [
          { authorName: { $regex: searchTerm, $options: "i" } },
          { queryNumber: { $regex: searchTerm, $options: "i" } },
          { sbNumber: { $regex: searchTerm, $options: "i" } },
          { model: { $regex: searchTerm, $options: "i" } },
          { revision: { $regex: searchTerm, $options: "i" } },
          { resolverName: { $regex: searchTerm, $options: "i" } },
          { comments: { $regex: searchTerm, $options: "i" } },
        ],
      };
    }
    console.log(
      "Query Filter:",
      queryFilter.$or
        ? queryFilter.$or.map((q) => JSON.stringify(q))
        : "No search term"
    );
    const queries = await Query.find(queryFilter)
      .sort({ createdAt: -1 })
      .lean();
    console.log("Queries:", queries);
    const totalQueries = queries.length;
    const openQueries = queries.filter(
      (query) => query.status === "Open"
    ).length;
    const closedQueries = totalQueries - openQueries;
    // res.json({ queries, totalQueries, openQueries, closedQueries }); // api testing
    res.render("index", { queries, totalQueries, openQueries, closedQueries });
  } catch (err) {
    res.status(500).send("Error fetching queries: " + err.message);
  }
}

// Create new query
export async function createQuery(req, res) {
  try {
    const { author, SBnumber, model, revision, resolverName, comments } =
      req.body;
    if (
      !author?.trim() ||
      !SBnumber?.trim() ||
      !model?.trim() ||
      !revision?.trim() ||
      !resolverName?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    const queryNumber = generateQueryNumber();

    const query = new Query({
      queryNumber: queryNumber,
      authorName: author,
      sbNumber: SBnumber,
      model: model,
      revision: revision,
      status: "Open",
      resolverName: resolverName,
      createdAt: new Date(),
      resolvedAt: null,
      comment: comments,
    });

    await query.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Query created successfully!",
        data: query,
      });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error saving query: " + err.message });
  }
}

// Export Queries to CSV
export async function exportToCSV(req, res) {
  try {
    const queries = await Query.find().lean();

    const fields = [
      "authorName",
      "sbNumber",
      "model",
      "revision",
      "status",
      "resolverName",
      "createdAt",
      "resolvedAt",
      "comment",
      "pdfFiles",
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(queries);

    res.header("Content-Type", "text/csv");
    res.attachment("queries.csv");
    return res.send(csv);
  } catch (err) {
    res.status(500).send("Failed to export CSV: " + err.message);
  }
}

// Update query status and attach PDFs
export async function updateQuery(req, res) {
  try {
    const pdfFiles = req.files ? req.files.map((file) => file.filename) : [];

    const updateData = {
      ...req.body,
      status: "Closed",
      resolvedAt: new Date(),
    };

    await Query.findByIdAndUpdate(
      req.params.id,
      {
        $set: updateData,
        $push: { pdfFiles: { $each: pdfFiles } },
      },
      { new: true }
    );

    res.redirect("/");
  } catch (err) {
    res.status(500).send("Error updating query: " + err.message);
  }
}

// Serve PDF
export function viewPDF(req, res) {
  const filePath = join(__dirname, "../uploads", req.params.filename);
  res.sendFile(filePath);
}
