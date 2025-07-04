import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";

const summarySchema = z.object({
  moduleName: z.string(),
  timestamp: z.string(),
  results: z.array(z.string()),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Download summary endpoint
  app.post("/api/download-summary", async (req, res) => {
    try {
      const { moduleName, timestamp, results } = summarySchema.parse(req.body);
      
      let content = `Insulin Calculator Summary - ${moduleName}\n`;
      content += `Generated: ${timestamp}\n\n`;
      
      if (results.length > 0) {
        content += "Calculated Values:\n";
        results.forEach(result => {
          content += `${result}\n`;
        });
      } else {
        content += "No calculations available.\n";
      }
      
      content += "\n---\n";
      content += "This summary was generated by the Inpatient Insulin Calculator\n";
      content += "based on ADA 2025 Guidelines for clinical reference.\n";
      
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', 'attachment; filename="insulin-calculator-summary.txt"');
      res.send(content);
    } catch (error) {
      console.error("Error generating summary:", error);
      res.status(400).json({ 
        message: error instanceof z.ZodError ? "Invalid request data" : "Failed to generate summary" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
