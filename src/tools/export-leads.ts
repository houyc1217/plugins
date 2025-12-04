/**
 * Export Leads Tool
 * Export leads to CSV or JSON format
 */

import { z } from 'zod';
import { writeFileSync } from 'fs';
import { join } from 'path';

export const exportLeadsSchema = z.object({
  leads: z.array(z.any()).describe('Array of lead objects to export'),
  format: z.enum(['csv', 'json']).default('json').describe('Export format'),
  filename: z.string().optional().describe('Output filename (without extension)'),
  fields: z.array(z.string()).optional().describe('Fields to include in export (for CSV)'),
});

export type ExportLeadsInput = z.infer<typeof exportLeadsSchema>;

function convertToCSV(leads: any[], fields?: string[]): string {
  if (leads.length === 0) {
    return '';
  }

  // Determine fields
  const allFields = fields || Object.keys(leads[0]);

  // Create header
  const header = allFields.join(',');

  // Create rows
  const rows = leads.map(lead => {
    return allFields.map(field => {
      let value = lead[field];

      // Handle nested objects
      if (typeof value === 'object' && value !== null) {
        value = JSON.stringify(value);
      }

      // Handle null/undefined
      if (value === null || value === undefined) {
        value = '';
      }

      // Escape quotes and wrap in quotes if contains comma or quote
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }

      return stringValue;
    }).join(',');
  });

  return [header, ...rows].join('\n');
}

export async function exportLeads(input: ExportLeadsInput) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  const filename = input.filename || `leads-export-${timestamp}`;
  const extension = input.format === 'csv' ? '.csv' : '.json';
  const fullPath = join(process.cwd(), filename + extension);

  let content: string;
  let mimeType: string;

  if (input.format === 'csv') {
    content = convertToCSV(input.leads, input.fields);
    mimeType = 'text/csv';
  } else {
    content = JSON.stringify(input.leads, null, 2);
    mimeType = 'application/json';
  }

  // Write file
  writeFileSync(fullPath, content, 'utf-8');

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          message: `Successfully exported ${input.leads.length} leads`,
          file: {
            path: fullPath,
            format: input.format,
            size_bytes: Buffer.byteLength(content, 'utf-8'),
            total_records: input.leads.length,
          },
        }, null, 2),
      },
    ],
  };
}
