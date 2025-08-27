import { NextRequest, NextResponse } from "next/server";
import pdf from "pdf-parse";
import * as XLSX from "xlsx";
import { csv } from "csv-parser";

// Enhanced document parsing for financial analysis
// Based on FinanceAI architecture with document processing capabilities

interface ParsedDocument {
  content: string;
  metadata: {
    type: string;
    pages?: number;
    extractedData?: any;
    timestamp: string;
  };
  financialMetrics?: {
    revenue?: number;
    profit?: number;
    expenses?: number;
    assets?: number;
    liabilities?: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name.toLowerCase();
    let parsedDocument: ParsedDocument;

    // Parse different file types
    if (fileName.endsWith(".pdf")) {
      parsedDocument = await parsePDF(buffer);
    } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
      parsedDocument = await parseExcel(buffer);
    } else if (fileName.endsWith(".csv")) {
      parsedDocument = await parseCSV(buffer);
    } else {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    // Extract financial metrics using NLP
    const financialMetrics = await extractFinancialMetrics(parsedDocument.content);
    parsedDocument.financialMetrics = financialMetrics;

    return NextResponse.json({
      success: true,
      document: parsedDocument,
      message: "Document parsed successfully"
    });

  } catch (error) {
    console.error("Document parsing error:", error);
    return NextResponse.json(
      { error: "Failed to parse document" },
      { status: 500 }
    );
  }
}

async function parsePDF(buffer: Buffer): Promise<ParsedDocument> {
  try {
    const data = await pdf(buffer);
    
    return {
      content: data.text,
      metadata: {
        type: "PDF",
        pages: data.numpages,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    throw new Error(`PDF parsing failed: ${error}`);
  }
}

async function parseExcel(buffer: Buffer): Promise<ParsedDocument> {
  try {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    return {
      content: JSON.stringify(jsonData),
      metadata: {
        type: "Excel",
        timestamp: new Date().toISOString()
      },
      extractedData: jsonData
    };
  } catch (error) {
    throw new Error(`Excel parsing failed: ${error}`);
  }
}

async function parseCSV(buffer: Buffer): Promise<ParsedDocument> {
  try {
    const csvText = buffer.toString();
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    const data = lines.slice(1).map(line => {
      const values = line.split(',');
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header.trim()] = values[index]?.trim();
      });
      return obj;
    });
    
    return {
      content: csvText,
      metadata: {
        type: "CSV",
        timestamp: new Date().toISOString()
      },
      extractedData: data
    };
  } catch (error) {
    throw new Error(`CSV parsing failed: ${error}`);
  }
}

async function extractFinancialMetrics(content: string): Promise<any> {
  // Basic financial metrics extraction using regex patterns
  const metrics: any = {};
  
  // Revenue patterns
  const revenuePatterns = [
    /revenue[:\s]*\$?([\d,]+\.?\d*)/gi,
    /total\s+revenue[:\s]*\$?([\d,]+\.?\d*)/gi,
    /sales[:\s]*\$?([\d,]+\.?\d*)/gi
  ];
  
  // Profit patterns
  const profitPatterns = [
    /net\s+profit[:\s]*\$?([\d,]+\.?\d*)/gi,
    /net\s+income[:\s]*\$?([\d,]+\.?\d*)/gi,
    /profit[:\s]*\$?([\d,]+\.?\d*)/gi
  ];
  
  // Extract revenue
  for (const pattern of revenuePatterns) {
    const match = pattern.exec(content);
    if (match) {
      metrics.revenue = parseFloat(match[1].replace(/,/g, ''));
      break;
    }
  }
  
  // Extract profit
  for (const pattern of profitPatterns) {
    const match = pattern.exec(content);
    if (match) {
      metrics.profit = parseFloat(match[1].replace(/,/g, ''));
      break;
    }
  }
  
  return metrics;
}
