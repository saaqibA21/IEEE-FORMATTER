const express = require("express");
const fs = require("fs");
const path = require("path");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/generate", (req, res) => {
  try {
    const content = fs.readFileSync(path.join(__dirname, "template.docx"), "binary");
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

    const data = req.body;

    // Prepare authors array
    const authors = data.authors.map(a => ({
      NAME: a.name,
      DEPARTMENT: a.department,
      ORGANIZATION: a.organization,
      CITY_COUNTRY: a.cityCountry,
      EMAIL: a.email
    }));

    // Prepare sections array
    const sections = data.sections.map(s => ({
      TITLE: s.title,
      CONTENT: s.content
    }));

    // Prepare references with index
    const references = data.references.map((r, i) => ({
      INDEX: i + 1,
      TEXT: r
    }));

    doc.render({
      TITLE: data.title,
      ABSTRACT: data.abstract,
      KEYWORDS: data.keywords,
      AUTHORS: authors,
      SECTIONS: sections,
      REFERENCES: references
    });

    const buffer = doc.getZip().generate({ type: "nodebuffer" });

    res.setHeader("Content-Disposition", "attachment; filename=IEEE_Paper.docx");
    res.send(buffer);

  } catch (error) {
    console.error(error);
    res.status(500).send("Template Error: " + error.message);
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
