import Query from "../models/querySchema.js";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { Parser } from "json2csv";
import { generateQueryNumber } from "../helpers/queryNumbergenerator.js";
import {
  SUCCESS,
  CREATED,
  FOUND,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from "../helpers/statusCodes.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// indexPage
export async function renderHome(req, res) {
  try {
    
    const now = new Date();
    console.log("ACCESSED HOME PAGE DIRECTLY Current Time:", now.toLocaleString());

    const queries = await Query.find().sort({ createdAt: -1 }).lean();
    const totalQueries = queries.length;
    const openQueries = queries.filter((q) => q.status === "Open").length;
    const closedQueries = totalQueries - openQueries;
    res
      .status(SUCCESS)
      .render("index", { queries, totalQueries, openQueries, closedQueries });
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .send("Error loading home: " + err.message);
  }
}
// search queries
export async function searchQueries(req, res) {
      console.log("====================================");

  try {
    console.log("====================================");
    const searchTerm = req.query.search;
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

    // Advanced filter logic can go here in the future
    // if (req.query.startDate || req.query.endDate) { ... }

    const queries = await Query.find(queryFilter)
      .sort({ createdAt: -1 })
      .lean();
    const totalQueries = queries.length;
    const openQueries = queries.filter((q) => q.status === "Open").length;
    const closedQueries = totalQueries - openQueries;
    res
      .status(SUCCESS)
      .render("index", { queries, totalQueries, openQueries, closedQueries });
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .send("Error searching queries: " + err.message);
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
      return res.status(BAD_REQUEST).json({
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
      pdfFiles: [],
    });

    await query.save();
    res.status(CREATED).json({
      success: true,
      message: "Query created successfully!",
      data: query,
    });
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
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
    res
      .status(INTERNAL_SERVER_ERROR)
      .send("Failed to export CSV: " + err.message);
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
    res
      .status(INTERNAL_SERVER_ERROR)
      .send("Error updating query: " + err.message);
  }
}
// upload PDF
export async function uploadPDF(req, res, next) {
  try {
    if (!req.file) {
      return res.status(BAD_REQUEST).send("No file uploaded.");
    }
    await Query.findByIdAndUpdate(
      req.params.id,
      { $push: { pdfFiles: req.file.filename } },
      { new: true }
    );
    res.redirect("/");
  } catch (err) {
    next(err);
  }
}
// Serve PDF
export function viewPDF(req, res) {
  const filePath = join(__dirname, "../uploads", req.params.filename);
  res.sendFile(filePath);
}
