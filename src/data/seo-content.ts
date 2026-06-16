export interface SeoData {
  toolId: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  benefits: { title: string; description: string }[];
  guideHtml: string;
  faqs: { q: string; a: string }[];
  relatedTools: string[];
}

export const seoContentMap: Record<string, SeoData> = {
  'compress-pdf': {
    toolId: 'compress-pdf',
    metaTitle: 'Free PDF Compressor Online — Shrink PDF File Size Privately | PDFlow',
    metaDescription: 'Compress PDF files online for free. Reduce PDF file size up to 90% in your browser. 100% private, files never leave your device. No email or signup required.',
    h1: 'Compress PDF Files Online (100% Private & Free)',
    intro: 'Shrink your PDF documents instantly without losing visual quality. Because all compression computations execute directly on your device inside your browser window, your documents never upload to a cloud server, ensuring 100% data confidentiality.',
    benefits: [
      { title: 'Local Browser Processing', description: 'Your documents never leave your computer. WebAssembly execution performs high-fidelity compression directly on your CPU.' },
      { title: 'Custom Reduction Levels', description: 'Adjust compression targets from 10% to 90% depending on whether you need lossless metadata stripping or lossy image downscaling.' },
      { title: 'Zero Wait Times', description: 'Bypass long cloud upload and download queues. Files are compressed instantly, saving bandwidth and time.' }
    ],
    guideHtml: `
      <h2>Why PDFlow is the Best Free PDF Compressor</h2>
      <p>Traditional PDF compressors force you to upload sensitive contracts, invoices, and personal identification to remote cloud servers. Once uploaded, you lose control of your data. PDFlow changes this paradigm completely. Our client-side PDF compression technology runs entirely inside your browser sandbox. That means files are processed locally on your machine—making it 100% private and compliance-friendly for businesses, legal teams, and health professionals.</p>
      
      <h2>How the PDF Compression Algorithm Works</h2>
      <p>PDFlow offers two types of compression depending on your needs:</p>
      <ul>
        <li><strong>Lossless Optimization (Target Reduction &le; 30%):</strong> Clean up duplicate dictionary entries, strip metadata, optimize object streams, and remove empty elements. This reduces file size without altering image resolution or compressing text graphics.</li>
        <li><strong>Lossy Image Downscaling (Target Reduction &gt; 30%):</strong> Rasterize pages onto canvas blocks and apply JPEG/WebP compression factors to embedded bitmap images. This shrinks large scanned PDFs up to 90% while maintaining crisp, readable text layouts.</li>
      </ul>

      <h2>Step-by-Step Guide: How to Compress PDFs Locally</h2>
      <ol>
        <li>Drag and drop your PDF document into the private upload zone above.</li>
        <li>Drag the target reduction slider to your desired optimization ratio (e.g. 50% for standard web sharing).</li>
        <li>Click the 'Compress PDF' button. Processing finishes in seconds.</li>
        <li>Download the compressed file or chain it to other tools (like PDF to Word) instantly.</li>
      </ol>
    `,
    faqs: [
      { q: 'Is this PDF compressor safe for confidential documents?', a: 'Yes! PDFlow processes files client-side. No files are ever sent to our servers, making it 100% secure and compliant with strict security protocols.' },
      { q: 'Is there a limit on how many PDFs I can compress?', a: 'None. Since computing runs on your own device rather than our servers, there are no limit counters or premium subscription walls.' },
      { q: 'Will my PDF lose text readability?', a: 'No. Our algorithm preserves vector text layouts and only compresses embedded raster images. Your text will remain sharp and legible.' }
    ],
    relatedTools: ['pdf-to-word', 'ocr-pdf', 'pdf-to-image']
  },
  'pdf-to-word': {
    toolId: 'pdf-to-word',
    metaTitle: 'Convert PDF to Word Online — Secure & Fast | PDFlow',
    metaDescription: 'Convert PDF files to editable Microsoft Word DOCX documents. Uses end-to-end encryption to a secure server with a strict zero-retention policy. No signup required.',
    h1: 'Convert PDF to Word Online (Secure & Fast)',
    intro: 'Extract page structures and reflow text content from PDF files directly into fully editable Microsoft Word DOCX documents. Files are transmitted via end-to-end encryption to our secure automated server and permanently deleted instantly after conversion.',
    benefits: [
      { title: 'Zero-Retention Policy', description: 'Files are processed securely and deleted instantly from our automated servers. Nothing is ever saved or stored.' },
      { title: 'High-Fidelity Layouts', description: 'Advanced processing preserves margins, paragraph lines, text styles, and image attachments from the source PDF.' },
      { title: 'Completely Free', description: 'No caps on daily conversions, no page count restrictions, and no watermark notes.' }
    ],
    guideHtml: `
      <h2>Secure Cloud PDF to Word Converter</h2>
      <p>Converting PDF to Word accurately requires advanced document reconstruction engines. PDFlow transmits your files using strict end-to-end encryption to our automated conversion servers. The server extracts the layout, compiles the Word document, returns it to you, and securely wipes the memory instantly.</p>

      <h2>How We Extract PDF Text and Layouts</h2>
      <p>When you load a PDF, our secure engine uses intelligent OCR and layout parsing to read text streams, character positions, and margins. It parses them and compiles them into a standard Word document structure, enabling seamless text editing. This is perfect for scraping contract text, editing resumes, or updating reports without retyping them from scratch.</p>

      <h2>How to Convert PDF to Word</h2>
      <ol>
        <li>Select the PDF file you wish to convert.</li>
        <li>Verify options and click the 'Start Conversion' button.</li>
        <li>Our secure server will parse and package the text elements into a DOCX format.</li>
        <li>Download your editable Word document in seconds.</li>
      </ol>
    `,
    faqs: [
      { q: 'Can I convert scanned PDFs to editable Word files?', a: 'Yes. Our server uses Optical Character Recognition (OCR) to extract text directly from scanned document images and exports them seamlessly to Word.' },
      { q: 'Does PDFlow save my document data?', a: 'No. This tool operates on a strict zero-retention policy. Files are processed in temporary memory and permanently deleted the millisecond your conversion finishes.' }
    ],
    relatedTools: ['word-to-pdf', 'ocr-pdf', 'pdf-to-image']
  },
  'word-to-pdf': {
    toolId: 'word-to-pdf',
    metaTitle: 'Convert Word to PDF Online — Free & 100% Local | PDFlow',
    metaDescription: 'Convert Microsoft Word DOCX documents to professional PDF files. Local browser processing ensures 100% file privacy. No uploads, free forever.',
    h1: 'Convert Word to PDF Online (Free & Private)',
    intro: 'Compile Microsoft Word documents into standardized, layout-perfect PDF files instantly. Runs entirely in your browser window to guarantee document security.',
    benefits: [
      { title: 'Local Parsing', description: 'Your DOCX files are parsed client-side using JavaScript. No remote uploads, maintaining complete file confidentiality.' },
      { title: 'Crisp Typography', description: 'Outputs standardized PDFs with embedded fonts and sharp vectors suitable for print and digital sharing.' },
      { title: 'Instant Compilation', description: 'Skip cloud queue delays. The browser compile engine outputs a download-ready PDF in seconds.' }
    ],
    guideHtml: `
      <h2>Convert DOCX to PDF Locally</h2>
      <p>PDFlow parses Microsoft Word binary packages, extract paragraph structures, headings, text styles, and image elements in the client browser, and reconstructs them into high-fidelity PDF layouts. By performing the conversion client-side, we bypass the need for server bandwidth and protect your privacy.</p>
    `,
    faqs: [
      { q: 'Can I convert large Word files?', a: 'Yes, files up to 50MB are supported, which easily covers text-heavy documents, reports, and ebooks.' }
    ],
    relatedTools: ['pdf-to-word', 'compress-pdf', 'pdf-to-image']
  },
  'ocr-pdf': {
    toolId: 'ocr-pdf',
    metaTitle: 'Free AI PDF OCR Online — Extract Text from PDF & Scans | PDFlow',
    metaDescription: 'Extract text from scanned PDFs, images, and documents for free. 100% browser-based OCR with Wasm. Files never leave your device. Export to Word or Text.',
    h1: 'AI-Powered PDF OCR Online (Free & 100% Private)',
    intro: 'Turn scanned PDF files, images, and screenshots into copyable, searchable text. Powered by local WebAssembly OCR models running inside your browser.',
    benefits: [
      { title: 'Local AI Scanning', description: 'Runs tesseract OCR models natively on your computer CPU. Your sensitive scans never upload to any external server.' },
      { title: 'Multiple Output Options', description: 'Export recognized characters into searchable PDFs, Microsoft Word documents, or plain text files.' },
      { title: 'Multi-Language Support', description: 'Extract data from files in English, Spanish, French, German, Chinese, and many other languages.' }
    ],
    guideHtml: `
      <h2>Extract Text from Scans Privately</h2>
      <p>Online Optical Character Recognition (OCR) tools traditionally process your documents on third-party servers. If you are handling passports, contracts, or financial statements, this is a major security risk. PDFlow implements WebAssembly ports of OCR engines that execute recognition algorithms in the browser. Your scan files remain 100% secure on your computer.</p>
    `,
    faqs: [
      { q: 'Is there a limit on scanned pages?', a: 'You can process files up to 50MB. Since all processing runs locally, it may take a few seconds longer for multi-page documents depending on your CPU.' }
    ],
    relatedTools: ['pdf-to-word', 'pdf-to-txt', 'pdf-to-image']
  },
  'image-to-pdf': {
    toolId: 'image-to-pdf',
    metaTitle: 'Convert Images to PDF Online — Free & Local | PDFlow',
    metaDescription: 'Convert JPG, PNG, WebP images to a single PDF document. Drag to reorder, set margins, A4 sizes. 100% browser-first processing.',
    h1: 'Convert Images to PDF Online (Free & Private)',
    intro: 'Combine JPG, PNG, WebP, or BMP files into a single, standardized PDF document. Reorder, set page sizing, and adjust margins client-side.',
    benefits: [
      { title: 'Drag and Drop Order', description: 'Visually organize, sort, and arrange your scanned images before compiling them into a final PDF.' },
      { title: 'Original & A4 Sizing', description: 'Set pages to match the original image aspect ratio or scale them automatically to fit standard A4 margins.' },
      { title: '100% Local PDF Synthesis', description: 'Compiled directly by your browser into a clean PDF using client-side vector engines.' }
    ],
    guideHtml: `
      <h2>Combine Images to PDF Privately</h2>
      <p>PDFlow allows you to drop multiple images, drag to reorder them, adjust layout margins, and click to compile them into a single PDF document. No image uploads are required, making it safe to compile scanned IDs, signatures, or photos into a PDF.</p>
    `,
    faqs: [
      { q: 'Which image formats are supported?', a: 'You can upload JPG, JPEG, PNG, WebP, and BMP files.' }
    ],
    relatedTools: ['pdf-to-image', 'ocr-pdf', 'compress-pdf']
  },
  'pdf-to-image': {
    toolId: 'pdf-to-image',
    metaTitle: 'Convert PDF to Image Online — Free & Private | PDFlow',
    metaDescription: 'Convert PDF pages to JPG, PNG, or WebP images. Free browser-based extraction. Files never leave your device. High resolution exports.',
    h1: 'Convert PDF to JPG & PNG Online (Free & Local)',
    intro: 'Extract PDF pages and compile them as crisp, high-resolution JPG, PNG, or WebP images instantly in your browser window.',
    benefits: [
      { title: 'Crisp Render Scale', description: 'Renders pages at double resolution (2x) to ensure small font text and vectors remain sharp and legible.' },
      { title: 'Format Flexibility', description: 'Choose your desired output image extension (PNG for lossless graphics, WebP for web optimization, JPG for compatibility).' },
      { title: 'Local Extraction', description: 'Bypasses servers completely. Pages are rendered to image canvases directly by your browser engine.' }
    ],
    guideHtml: `
      <h2>Extract PDF Pages as Images Locally</h2>
      <p>Drop your PDF document, select your output image format and quality factor, and PDFlow will convert each page into a separate image file. This runs entirely in the browser using HTML5 Canvas rendering APIs.</p>
    `,
    faqs: [
      { q: 'How are multi-page PDFs downloaded?', a: 'PDFlow downloads the first page immediately and prompts your browser to save the remaining pages as individual image files.' }
    ],
    relatedTools: ['image-to-pdf', 'compress-pdf', 'ocr-pdf']
  },
  'excel-to-pdf': {
    toolId: 'excel-to-pdf',
    metaTitle: 'Convert Excel to PDF Online — Free & Secure | PDFlow',
    metaDescription: 'Convert Excel spreadsheets (XLSX, XLS) to PDF files. Local browser-based conversion ensures 100% data privacy. No signup or fees.',
    h1: 'Convert Excel to PDF Online (Free & Private)',
    intro: 'Convert spreadsheet data matrix sheets to clean, readable PDF documents. Processed client-side, ensuring complete data security.',
    benefits: [
      { title: 'Table Sizing', description: 'Maintains Excel column layout structures and formats spreadsheets into printable, margins-adjusted PDF pages.' },
      { title: 'Zero Cloud Uploads', description: 'Computations run on your device. Safe for sensitive financial ledgers, calculations, and tables.' }
    ],
    guideHtml: `
      <h2>Convert Spreadsheets to PDF Privately</h2>
      <p>PDFlow parses XLSX worksheets in the browser, formats grid columns, and outputs clean tabular reports to PDF. Safe for private balance sheets and payroll lists.</p>
    `,
    faqs: [
      { q: 'Does it support multi-sheet workbooks?', a: 'Yes, it reads cell data and compiles the primary sheet data layout into a PDF.' }
    ],
    relatedTools: ['pdf-to-excel', 'excel-to-pdf', 'compress-pdf']
  },
  'pdf-to-excel': {
    toolId: 'pdf-to-excel',
    metaTitle: 'Convert PDF to Excel Online — Free & Local | PDFlow',
    metaDescription: 'Extract table grids from PDF files and save them as Excel XLSX sheets for free. 100% private browser processing. No signup.',
    h1: 'Convert PDF to Excel Online (Free & Private)',
    intro: 'Extract rows and columns of table data from PDF files and compile them into structured, editable Excel XLSX spreadsheets.',
    benefits: [
      { title: 'Table Reflowing', description: 'Aligns table cell coordinates to map data into separate rows and columns correctly.' },
      { title: 'Data Confidentiality', description: 'All table parsing executes in the browser. Zero risk of leaking sensitive databases.' }
    ],
    guideHtml: `
      <h2>Extract Tables from PDF to Excel</h2>
      <p>PDFlow parses PDF data arrays, separates spaced text coordinates, and writes an Excel XLSX workbook. Avoid retyping data columns manually.</p>
    `,
    faqs: [
      { q: 'Are formulas preserved?', a: 'No, the converter extracts cell values and text tables. Formulas must be added inside Excel after download.' }
    ],
    relatedTools: ['excel-to-pdf', 'pdf-to-word', 'pdf-to-txt']
  },
  'ppt-to-pdf': {
    toolId: 'ppt-to-pdf',
    metaTitle: 'Convert PowerPoint to PDF Online — Free & Secure | PDFlow',
    metaDescription: 'Convert PPTX slideshows to PDF documents. 100% private client-side conversion. Free forever, no registration needed.',
    h1: 'Convert PowerPoint to PDF Online (Free & Private)',
    intro: 'Convert presentation slides (PPTX, PPT) to standardized PDF files instantly. Runs entirely in your browser window to guarantee data security.',
    benefits: [
      { title: 'Layout Retention', description: 'Extracts slide graphics and formats them as standard page orientations.' },
      { title: 'Local Rendering', description: 'Safe for proprietary business slides, slide notes, and pitch decks.' }
    ],
    guideHtml: `
      <h2>Convert PPTX Slides to PDF</h2>
      <p>Convert presentation slides to PDF documents locally in the browser. Helps package slideshows into shareable documents privately.</p>
    `,
    faqs: [
      { q: 'Does it support PPTX formats?', a: 'Yes, it parses standard PowerPoint presentation XMLs.' }
    ],
    relatedTools: ['pdf-to-ppt', 'compress-pdf', 'word-to-pdf']
  },
  'pdf-to-ppt': {
    toolId: 'pdf-to-ppt',
    metaTitle: 'Convert PDF to PowerPoint Online — Free & Secure | PDFlow',
    metaDescription: 'Convert PDF documents to editable PowerPoint slideshows (PPTX). 100% private client-side conversion. Free, no account.',
    h1: 'Convert PDF to PowerPoint Online (Free & Private)',
    intro: 'Convert PDF pages into slide files in your browser. Bypasses cloud uploads to guarantee complete presentation privacy.',
    benefits: [
      { title: 'Slide Structuring', description: 'Extracts page elements and writes slide structures for presentation layouts.' },
      { title: 'Local Safety', description: 'Keep corporate slideshow decks and pitches safe within your device.' }
    ],
    guideHtml: `
      <h2>Convert PDF to Slideshows</h2>
      <p>Convert PDF documents to slides locally in the browser. Helps extract text blocks and convert pages to PowerPoint files privately.</p>
    `,
    faqs: [
      { q: 'Can I edit the generated slides?', a: 'Yes, the slides compile text layers for PowerPoint slide structures.' }
    ],
    relatedTools: ['ppt-to-pdf', 'pdf-to-word', 'ocr-pdf']
  },
  'html-to-pdf': {
    toolId: 'html-to-pdf',
    metaTitle: 'Convert HTML to PDF Online — Free & Secure | PDFlow',
    metaDescription: 'Convert HTML files or website source code to PDF. 100% private browser processing. Free, no signup, no logs.',
    h1: 'Convert HTML to PDF Online (Free & Private)',
    intro: 'Convert HTML source markup into printable PDF documents in your browser. Files never leave your device.',
    benefits: [
      { title: 'Node Extraction', description: 'Parses DOM structures and formats readable text layouts into PDF margins.' },
      { title: 'Absolute Privacy', description: 'Keep code files and web structures confidential on your local system.' }
    ],
    guideHtml: `
      <h2>Compile HTML to PDF Locally</h2>
      <p>Convert HTML text code to standard PDF files in the browser. Safe for developers compiling localized web data privately.</p>
    `,
    faqs: [
      { q: 'Does it download styles?', a: 'It extracts and reflows code texts and paragraph nodes into standard PDF layouts.' }
    ],
    relatedTools: ['pdf-to-html', 'txt-to-pdf', 'word-to-pdf']
  },
  'pdf-to-html': {
    toolId: 'pdf-to-html',
    metaTitle: 'Convert PDF to HTML Online — Free & Secure | PDFlow',
    metaDescription: 'Convert PDF documents to responsive HTML code files. 100% private client-side conversion. Free, no uploads.',
    h1: 'Convert PDF to HTML Online (Free & Private)',
    intro: 'Convert PDF text layers to responsive HTML webpage files. Bypasses cloud uploads to keep document code private.',
    benefits: [
      { title: 'Responsive Tags', description: 'Reflows PDF characters into readable webpage nodes and paragraphs.' },
      { title: 'Local Synthesis', description: 'Runs in browser memory. Keep code directories and documentation secure.' }
    ],
    guideHtml: `
      <h2>Convert PDF to HTML Webpages</h2>
      <p>Reflow PDF text contents into standard HTML codes locally in the browser. Useful for uploading PDF content to websites privately.</p>
    `,
    faqs: [
      { q: 'Does it preserve PDF links?', a: 'Yes, it compiles text contents into link blocks where applicable.' }
    ],
    relatedTools: ['html-to-pdf', 'pdf-to-txt', 'pdf-to-word']
  },
  'epub-to-pdf': {
    toolId: 'epub-to-pdf',
    metaTitle: 'Convert EPUB to PDF Online — Free & Secure | PDFlow',
    metaDescription: 'Convert EPUB e-books to standardized PDF files. 100% private browser processing. Free forever, no signup.',
    h1: 'Convert EPUB to PDF Online (Free & Private)',
    intro: 'Convert EPUB ebook files into printable, formatted PDF documents locally in your browser window.',
    benefits: [
      { title: 'E-book Sizing', description: 'Reflows book text nodes into standardized printable page structures.' },
      { title: 'Privacy Guaranteed', description: 'Bypasses file uploads. Keep your digital book library completely private.' }
    ],
    guideHtml: `
      <h2>Convert EPUB Books to PDF</h2>
      <p>Convert EPUB format digital books to PDF format in the browser locally. Safe for personal reading files and private publications.</p>
    `,
    faqs: [
      { q: 'Does it support DRM protected books?', a: 'No, DRM protected ebooks must have protection removed before converting.' }
    ],
    relatedTools: ['pdf-to-epub', 'txt-to-pdf', 'compress-pdf']
  },
  'pdf-to-epub': {
    toolId: 'pdf-to-epub',
    metaTitle: 'Convert PDF to EPUB Online — Free & Secure | PDFlow',
    metaDescription: 'Convert PDF documents to e-reader compatible EPUB format. 100% private browser-based conversion. Free, no signup.',
    h1: 'Convert PDF to EPUB Online (Free & Private)',
    intro: 'Reflow PDF books and articles into fluid EPUB ebooks. Processes client-side to guarantee document privacy.',
    benefits: [
      { title: 'E-reader Reflowing', description: 'Compiles text flows that adapt automatically to any e-reader screen.' },
      { title: 'Zero File Uploads', description: 'Keep private documents, journals, and ebooks safe inside your browser.' }
    ],
    guideHtml: `
      <h2>Convert PDF Documents to EPUB</h2>
      <p>Reflow static PDFs to fluid EPUB ebook packages locally in the browser. Safe for converting e-books privately.</p>
    `,
    faqs: [
      { q: 'Can I read the output on my phone?', a: 'Yes, the compiled EPUB works on Apple Books, Google Play Books, and Kindle.' }
    ],
    relatedTools: ['epub-to-pdf', 'pdf-to-txt', 'pdf-to-word']
  },
  'txt-to-pdf': {
    toolId: 'txt-to-pdf',
    metaTitle: 'Convert Text to PDF Online — Free & Secure | PDFlow',
    metaDescription: 'Convert plain text TXT files to margin-adjusted PDF documents. 100% private browser processing. Free, no limits.',
    h1: 'Convert TXT to PDF Online (Free & Private)',
    intro: 'Compile plain text documents into professional PDF files with automatic margins and standard typography.',
    benefits: [
      { title: 'Margin Sizing', description: 'Formats lines to wrap neatly within standard A4 margins.' },
      { title: 'Total Privacy', description: 'Computations run on your device CPU. Safe for log files, keys, and notes.' }
    ],
    guideHtml: `
      <h2>Convert Plain Text to PDF</h2>
      <p>Convert plain TXT logs or files to PDF in the browser. Safe for logs, documentation, and notes client-side.</p>
    `,
    faqs: [
      { q: 'Can I adjust font sizes?', a: 'Yes, standard settings let you configure basic layout elements.' }
    ],
    relatedTools: ['pdf-to-txt', 'word-to-pdf', 'html-to-pdf']
  },
  'pdf-to-txt': {
    toolId: 'pdf-to-txt',
    metaTitle: 'Convert PDF to Text Online — Free & Secure | PDFlow',
    metaDescription: 'Extract plain text from PDF documents. 100% private browser-based scraping. Free, no sign-up or limits.',
    h1: 'Extract Text from PDF Online (Free & Private)',
    intro: 'Scrape and extract plain characters from PDF files. Runs entirely in your browser to secure private data.',
    benefits: [
      { title: 'Line Merging', description: 'Collects page paragraphs and returns clean text lines.' },
      { title: '100% Local Scraping', description: 'Never uploads files. Keeps sensitive data in your browser memory.' }
    ],
    guideHtml: `
      <h2>Scrape PDF Text Locally</h2>
      <p>Extract all copyable characters from PDFs to TXT files in the browser. Quick and safe for data mining privately.</p>
    `,
    faqs: [
      { q: 'Does it work on scanned images?', a: 'For image-only files, use our OCR & AI PDF Text tool for optical character recognition.' }
    ],
    relatedTools: ['txt-to-pdf', 'pdf-to-word', 'ocr-pdf']
  },
  'merge-pdf': {
    toolId: 'merge-pdf',
    metaTitle: 'Merge PDF Files Online — Combine PDFs Privately | PDFlow',
    metaDescription: 'Combine multiple PDF documents into a single file easily. Rearrange pages using drag-and-drop. 100% private client-side processing.',
    h1: 'Merge PDF Files Online (Free & Private)',
    intro: 'Combine multiple PDF documents into a single cohesive file. Rearrange or delete specific pages visually using drag-and-drop, all processed 100% locally in your browser.',
    benefits: [
      { title: 'Visual Drag-and-Drop', description: 'Easily reorder specific pages from different documents before merging.' },
      { title: 'Zero Cloud Uploads', description: 'Merging happens locally using WebAssembly. Safe for highly confidential files.' }
    ],
    guideHtml: `
      <h2>Combine PDFs Privately</h2>
      <p>Select multiple PDF files to upload them into our secure local processing engine. You can drag and drop the thumbnails to arrange the exact order of pages, or delete unwanted pages before clicking Merge to generate your final document.</p>
    `,
    faqs: [
      { q: 'Is there a limit to how many files I can merge?', a: 'You can merge files up to a combined size of 100MB directly in your browser without any uploads.' }
    ],
    relatedTools: ['compress-pdf', 'pdf-to-image', 'pdf-to-word']
  },
  'recent': {
    toolId: 'recent',
    metaTitle: 'Session History & Local File Cache | PDFlow',
    metaDescription: 'Access, download, and chain files processed during your active session. 100% private local caching. Zero file uploads.',
    h1: 'Active Session Log (100% Private & Local)',
    intro: 'Access and chain files processed during your active session. To maintain absolute privacy, this logs data only in your browser memory.',
    benefits: [
      { title: 'Local Caching Only', description: 'Operation metadata is saved in local browser storage, and file content is cleared upon closing the page.' },
      { title: 'Smart Chaining workflows', description: 'Directly send previous output files into other PDF tools with one click.' }
    ],
    guideHtml: `
      <h2>Review and Chain Your Operations</h2>
      <p>Your session logs are stored locally using Zustand persistent cache mappings. If you reload the tab, metadata is preserved, but heavy base64 file payloads are cleared automatically to keep memory usage low and protect document confidentiality.</p>
    `,
    faqs: [
      { q: 'How long is history saved?', a: 'Metadata is persistent until you manually clear it or delete site data. Raw file content is cleared when you close the tab.' }
    ],
    relatedTools: ['compress-pdf', 'pdf-to-word', 'ocr-pdf']
  }
};
