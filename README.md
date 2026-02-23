# 🚀 IEEE Formatter Pro

A professional, premium web application to format research papers according to IEEE standards. Transform your content into a publication-ready `.docx` file instantly.

## ✨ Premium Features
- **Modern UI/UX**: Stunning Glassmorphism design with fluid animations.
- **Image Support**: Upload figures and illustrations with captions directly into your paper.
- **Dark Mode**: Eye-friendly interface with automatic theme saving.
- **Auto-Save**: Real-time persistence using `localStorage`.
- **Dynamic Authors/Sections**: Add or remove as many as needed.
- **Sanitized Filenames**: Downloads are named based on your paper title.
- **Responsive**: Fully optimized for both desktop and mobile devices.


## 🛠️ Installation
```bash
npm install
```

## 🚀 Usage
```bash
npm start
```
The server will run on [http://localhost:3000](http://localhost:3000).

## 📂 Tech Stack
- **Frontend**: Vanilla JS, CSS3 (Glassmorphism), FontAwesome
- **Backend**: Node.js, Express, Docxtemplater, PizZip

## 📝 Template Configuration
Ensure your `template.docx` contains these tags:
- `{TITLE}`: Paper Title
- `{ABSTRACT}`: Abstract text
- `{KEYWORDS}`: Keywords list
- `{#AUTHORS} {NAME}, {DEPARTMENT}, ... {/AUTHORS}`: Authors loop
- `{#SECTIONS} {TITLE}, {CONTENT} {/SECTIONS}`: Sections loop
- `{#FIGURES} {%IMAGE} {CAPTION} {/FIGURES}`: Figures (use `%` for images)
- `{#REFERENCES} [{INDEX}] {TEXT} {/REFERENCES}`: References list


