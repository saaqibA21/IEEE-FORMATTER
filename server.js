const express = require("express");
const fs = require("fs");
const path = require("path");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan"); // Added logging

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static("public"));

// Health check
app.get("/status", (req, res) => {
    res.json({ status: "online", timestamp: new Date() });
});

app.post("/generate", (req, res) => {
    console.log(`Generating paper: ${req.body.title || 'Untitled'}`);
    
    try {
        const templatePath = path.join(__dirname, "template.docx");
        
        if (!fs.existsSync(templatePath)) {
            return res.status(404).json({ error: "Template file missing from server." });
        }

        const content = fs.readFileSync(templatePath, "binary");
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, { 
            paragraphLoop: true, 
            linebreaks: true 
        });

        const data = req.body;

        // Prepare authors array with safety checks
        const authors = (data.authors || []).map(a => ({
            NAME: a.name || 'Anonymous',
            DEPARTMENT: a.department || '',
            ORGANIZATION: a.organization || '',
            CITY_COUNTRY: a.cityCountry || '',
            EMAIL: a.email || ''
        }));

        // Prepare sections array
        const sections = (data.sections || []).map(s => ({
            TITLE: s.title || 'Untitled Section',
            CONTENT: s.content || ''
        }));

        // Prepare references
        const references = (data.references || []).map((r, i) => ({
            INDEX: i + 1,
            TEXT: r
        }));

        // Render document
        doc.render({
            TITLE: data.title || 'IEEE Research Paper',
            ABSTRACT: data.abstract || 'No abstract provided.',
            KEYWORDS: data.keywords || '',
            AUTHORS: authors,
            SECTIONS: sections,
            REFERENCES: references
        });

        const buffer = doc.getZip().generate({ type: "nodebuffer" });
        const fileName = (data.title || "IEEE_Paper").replace(/[^a-z0-9]/gi, '_').toLowerCase();

        res.setHeader("Content-Disposition", `attachment; filename=${fileName}.docx`);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        res.send(buffer);

    } catch (error) {
        console.error("Critical Error:", error);
        res.status(500).json({ 
            error: "Failed to generate document", 
            details: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`
🚀 IEEE Formatter Advanced Server
📡 Running on: http://localhost:${PORT}
📁 Static Files: ${path.join(__dirname, 'public')}
    `);
});

