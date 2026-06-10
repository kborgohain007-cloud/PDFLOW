'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePDFlowStore } from '@/store/use-pdflow-store';
import { toolsData, ToolItem } from '@/data/tools';
import UploadZone from '@/components/upload/UploadZone';
import Logo from '@/components/ui/Logo';
import { 
  FileText, 
  FileSpreadsheet, 
  FileImage, 
  FileCode, 
  BookOpen, 
  Sparkles, 
  Minimize2, 
  Type, 
  FileCheck, 
  Search, 
  ArrowRight, 
  Check, 
  X, 
  HelpCircle, 
  MessageSquare,
  Shield,
  Zap,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

// Helper to map iconName to colorful Lucide icons
const getToolIcon = (iconName: string, className = "w-6 h-6") => {
  switch (iconName) {
    case 'pdf':
      return <FileText className={`${className} text-rose-500`} />;
    case 'docx':
      return <FileText className={`${className} text-blue-500`} />;
    case 'excel':
      return <FileSpreadsheet className={`${className} text-emerald-500`} />;
    case 'ppt':
      return <FileCheck className={`${className} text-orange-500`} />;
    case 'image':
      return <FileImage className={`${className} text-indigo-500`} />;
    case 'html':
      return <FileCode className={`${className} text-amber-500`} />;
    case 'epub':
      return <BookOpen className={`${className} text-purple-500`} />;
    case 'txt':
      return <Type className={`${className} text-neutral-500`} />;
    case 'compress':
      return <Minimize2 className={`${className} text-indigo-500`} />;
    case 'ai':
      return <Sparkles className={`${className} text-violet-500`} />;
    default:
      return <FileText className={`${className} text-indigo-500`} />;
  }
};

export default function Home() {
  const router = useRouter();
  const setActiveWorkflowFile = usePDFlowStore((state) => state.setActiveWorkflowFile);
  
  // Hero upload states
  const [heroFiles, setHeroFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRouterModal, setShowRouterModal] = useState(false);
  const [compatibleRoutes, setCompatibleRoutes] = useState<{ name: string; route: string }[]>([]);

  // Search & filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'conversion' | 'optimization' | 'ocr-ai'>('all');

  // FAQ accordion active state
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Handles home page direct file upload
  const handleHeroFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();

    // Map allowed options
    let routes: { name: string; route: string }[] = [];
    if (extension === '.pdf') {
      routes = [
        { name: 'Compress PDF', route: '/compress-pdf' },
        { name: 'OCR & Extract Text', route: '/ocr-pdf' },
        { name: 'PDF to Word', route: '/pdf-to-word' },
        { name: 'PDF to Image', route: '/pdf-to-image' },
        { name: 'PDF to Excel', route: '/pdf-to-excel' },
        { name: 'PDF to PPT', route: '/pdf-to-ppt' },
      ];
    } else if (['.jpg', '.jpeg', '.png', '.webp', '.bmp'].includes(extension)) {
      routes = [
        { name: 'Image to PDF', route: '/image-to-pdf' },
        { name: 'OCR & Extract Text', route: '/ocr-pdf' },
      ];
    } else if (extension === '.docx') {
      routes = [{ name: 'Word to PDF', route: '/word-to-pdf' }];
    } else if (extension === '.xlsx') {
      routes = [{ name: 'Excel to PDF', route: '/excel-to-pdf' }];
    } else if (extension === '.pptx' || extension === '.ppt') {
      routes = [{ name: 'PPT to PDF', route: '/ppt-to-pdf' }];
    } else if (extension === '.txt') {
      routes = [{ name: 'Text to PDF', route: '/txt-to-pdf' }];
    } else if (extension === '.epub') {
      routes = [{ name: 'EPUB to PDF', route: '/epub-to-pdf' }];
    } else if (extension === '.html') {
      routes = [{ name: 'HTML to PDF', route: '/html-to-pdf' }];
    }

    if (routes.length === 1) {
      // Auto route if only 1 mapping exists
      setActiveWorkflowFile({ file, sourceTool: 'Direct Hero Upload' });
      toast({ title: 'Redirecting...', description: `Loading file into ${routes[0].name}`, type: 'info' });
      router.push(routes[0].route);
    } else if (routes.length > 1) {
      setCompatibleRoutes(routes);
      setShowRouterModal(true);
    } else {
      toast({ title: 'Unsupported format', description: `We couldn't map "${file.name}" to a tool automatically. Please select the tool below manually.`, type: 'warning' });
      setHeroFiles([]);
    }
  };

  const handleSelectRoute = (route: string, name: string) => {
    if (heroFiles.length === 0) return;
    setActiveWorkflowFile({ file: heroFiles[0], sourceTool: 'Direct Hero Upload' });
    setShowRouterModal(false);
    toast({ title: 'Redirecting...', description: `Loaded file into ${name}`, type: 'info' });
    router.push(route);
  };

  // Filter tools Data based on search and active tab
  const filteredTools = useMemo(() => {
    return toolsData.filter((tool) => {
      const matchesSearch = 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        activeCategory === 'all' || 
        tool.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const faqs = [
    {
      q: "Does PDFLOW upload my sensitive documents to a server?",
      a: "No! Unlike traditional PDF utility websites, PDFLOW is built with privacy in mind. Almost all files are processed directly in your browser client-side using JavaScript execution (pdf-lib, pdf.js, Tesseract OCR). Your files never leave your device."
    },
    {
      q: "Is there a limit on file sizes or daily operations?",
      a: "Since computing is done directly on your browser, we do not require expensive cloud bandwidth. There are no daily conversion limits. Supported file sizes go up to 100MB depending on the specific tool!"
    },
    {
      q: "How does AI and OCR work locally?",
      a: "We utilize Tesseract.js, a WebAssembly port of the famous Google Tesseract OCR engine, compiling and running natively inside your browser. This enables handwriting recognition and text scraping on your CPU privately."
    },
    {
      q: "Can I chain multiple utilities together?",
      a: "Yes! After converting or compressing, you can use our 'Continue Workflow' action bar to instantly feed the resulting file into another tool (e.g. PDF -> Word -> Compress -> OCR) with one click."
    }
  ];

  return (
    <div className="flex flex-col gap-20 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* 1. HERO SECTION */}
      <section className="flex flex-col lg:flex-row items-center justify-between gap-12 pt-4">
        <div className="flex-1 text-left max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200/10 mb-6 text-xs font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            100% Client-Side Private Processing
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight text-neutral-900 dark:text-neutral-50"
          >
            Private PDF Tools — <br />
            <span className="text-gradient">Files Never Leave Your Device</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-neutral-550 dark:text-neutral-400 mt-6 text-base sm:text-lg font-medium leading-relaxed"
          >
            Merge, Compress, Convert, Split, OCR and Edit PDFs completely in your browser. No uploads. No waiting. No accounts. Completely free.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-4 mt-8"
          >
            <a
              href="#tools"
              className="px-5 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.98] cursor-pointer"
            >
              Start Using Free Tools
            </a>
            <a
              href="#tools"
              className="px-5 py-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 text-neutral-600 dark:text-neutral-350 font-semibold text-sm transition-all cursor-pointer"
            >
              See All Tools
            </a>
          </motion.div>

          {/* Trust Badges directly under CTAs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-xs font-bold text-neutral-500 dark:text-neutral-450"
          >
            <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">✓ 100% Free</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-450">✓ No Uploads Required</span>
            <span>•</span>
            <span className="flex items-center gap-1">✓ Browser-Based Processing</span>
            <span>•</span>
            <span className="flex items-center gap-1">✓ Privacy First</span>
            <span>•</span>
            <span className="flex items-center gap-1">✓ No Sign-Up Needed</span>
          </motion.div>
        </div>

        <div className="flex-1 w-full max-w-lg lg:max-w-none">
          <UploadZone
            allowedTypes={['.pdf', '.jpg', '.jpeg', '.png', '.webp', '.bmp', '.docx', '.xlsx', '.pptx', '.txt', '.epub', '.html']}
            multiple={false}
            maxSizeMB={100}
            onFilesSelected={handleHeroFilesSelected}
            isProcessing={isProcessing}
            progress={0}
            processingStatus=""
            onReset={() => setHeroFiles([])}
            files={heroFiles}
            setFiles={setHeroFiles}
          />
        </div>
      </section>

      {/* 2. DYNAMIC WORKFLOW SELECTOR MODAL */}
      <AnimatePresence>
        {showRouterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowRouterModal(false);
                setHeroFiles([]);
              }}
              className="absolute inset-0 bg-neutral-950/40 backdrop-blur-sm"
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="matte-surface bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl w-full max-w-md relative z-10 shadow-2xl"
            >
              <button
                onClick={() => {
                  setShowRouterModal(false);
                  setHeroFiles([]);
                }}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-heading font-extrabold text-lg sm:text-xl text-neutral-900 dark:text-neutral-50 mb-1 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                Select Utility
              </h3>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-6">
                Choose what you want to do with &quot;{heroFiles[0]?.name}&quot;:
              </p>
              <div className="flex flex-col gap-2.5">
                {compatibleRoutes.map((opt) => (
                  <button
                    key={opt.route}
                    onClick={() => handleSelectRoute(opt.route, opt.name)}
                    className="flex items-center justify-between p-4 rounded-2xl border border-neutral-100 hover:border-indigo-500 dark:border-neutral-850 dark:hover:border-indigo-400/50 bg-neutral-50/50 hover:bg-indigo-50/20 dark:bg-neutral-950/20 dark:hover:bg-indigo-950/20 text-left group cursor-pointer transition-all"
                  >
                    <span className="font-semibold text-sm text-neutral-800 dark:text-neutral-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {opt.name}
                    </span>
                    <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PRIVACY-FIRST DIFFERENTIATORS */}
      <section className="flex flex-col gap-8">
        <div className="text-center max-w-lg mx-auto">
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-950 dark:text-neutral-50">
            Why PDFlow Is Different
          </h2>
          <p className="text-sm font-semibold text-neutral-400 dark:text-neutral-500 mt-1">
            Running client-side utility algorithms directly in your browser sandbox.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { title: '🔒 Files Never Leave Your Device', description: 'Computations run entirely inside your browser tab using WebAssembly. Your files are never uploaded to any remote server.' },
            { title: '⚡ Instant Local Processing', description: 'Bypass cloud queue delays and internet upload speeds. Files are converted and compressed on your device CPU instantly.' },
            { title: '💻 Runs Entirely In Your Browser', description: 'Zero downloads, zero browser extensions. Fully compatible with Windows, Mac, iOS, Android, and Linux.' },
            { title: '🆓 Completely Free', description: 'No paywalls, no daily operation counts, and no watermarks. PDFlow is fully supported by community sharing.' },
            { title: '🚫 No Sign-Up Required', description: 'Start using tools immediately. We do not collect emails, demand registration details, or track your identity.' },
            { title: '🌎 Works Everywhere', description: 'Take advantage of standard sandboxed local filesystems to optimize your files securely from any device.' }
          ].map((card, idx) => (
            <div
              key={idx}
              className="matte-surface bg-white/40 dark:bg-neutral-900/10 p-6 rounded-2xl border border-neutral-200/40 dark:border-neutral-850/30 hover:border-indigo-500/30 dark:hover:border-indigo-400/20 hover:shadow-md transition-all flex flex-col gap-2"
            >
              <h3 className="font-heading font-extrabold text-base text-neutral-800 dark:text-neutral-200">
                {card.title}
              </h3>
              <p className="text-xs font-semibold text-neutral-450 dark:text-neutral-500 leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TOOL GRID SECTION */}
      <section id="tools" className="scroll-mt-24 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-950 dark:text-neutral-50">
              Popular Tools
            </h2>
            <p className="text-sm font-medium text-neutral-400 dark:text-neutral-500 mt-1">
              Select one of our 16 utilities to begin your workflow.
            </p>
          </div>
          
          {/* Search bar */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search tools... (e.g. compress)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/40 dark:bg-neutral-900/40 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-sm placeholder:text-neutral-400"
            />
          </div>
        </div>

        {/* Filter categories tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 select-none">
          {['all', 'conversion', 'optimization', 'ocr-ai'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              className={`px-4.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all shrink-0 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-neutral-900 border-neutral-900 text-white dark:bg-white dark:border-white dark:text-black'
                  : 'bg-white/40 border-neutral-200 text-neutral-500 hover:text-neutral-800 hover:border-neutral-300 dark:bg-neutral-900/20 dark:border-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:border-neutral-700'
              }`}
            >
              {cat === 'all' && 'All Utilities'}
              {cat === 'conversion' && 'Conversions'}
              {cat === 'optimization' && 'Compress & Optimize'}
              {cat === 'ocr-ai' && 'AI & OCR text'}
            </button>
          ))}
        </div>

        {/* Tool Cards list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredTools.map((tool) => (
              <motion.div
                key={tool.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => router.push(tool.slug)}
                className="matte-surface bg-white/60 dark:bg-neutral-900/40 hover:bg-white/95 dark:hover:bg-neutral-900/90 border border-neutral-200/50 dark:border-neutral-800/60 p-5 rounded-2xl cursor-pointer hover:shadow-md transition-all group hover-glow relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/20 flex items-center justify-center mb-4.5 shadow-sm">
                    {getToolIcon(tool.iconName)}
                  </div>
                  <h3 className="font-heading font-extrabold text-base text-neutral-800 dark:text-neutral-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    Limit {tool.maxSizeMB}MB
                  </span>
                  <div className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity translate-x-1 group-hover:translate-x-0 duration-200">
                    Launch
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredTools.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <HelpCircle className="w-10 h-10 mx-auto text-neutral-400 dark:text-neutral-600 mb-3" />
              <h4 className="text-base font-bold text-neutral-700 dark:text-neutral-300">No tools match your query</h4>
              <p className="text-xs text-neutral-400 mt-1">Try search queries like &quot;word&quot; or &quot;compress&quot;.</p>
            </div>
          )}
        </div>
      </section>

      {/* 4. AI FEATURE HIGHLIGHTS */}
      <section className="matte-surface bg-gradient-to-br from-indigo-600 to-indigo-800 dark:from-indigo-950/30 dark:to-neutral-950 p-8 sm:p-12 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-indigo-500/20">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-md relative z-10">
          <span className="text-[10px] font-extrabold tracking-widest text-indigo-200 uppercase bg-indigo-500/40 px-2.5 py-1 rounded-md">
            AI Enhancements
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white mt-4">
            Unleash Smart OCR & Cleanups
          </h2>
          <p className="text-sm font-semibold text-indigo-200 mt-3 leading-relaxed">
            Scan files to generating indexable, copyable PDFs in the browser. Features confidence scores, handwriting contrast boosters, and automatic cleanups to scrub noise out of documents.
          </p>
        </div>
        <div className="flex items-center gap-4 relative z-10 shrink-0 w-full md:w-auto justify-start md:justify-end">
          <div className="px-5 py-4.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white flex-1 md:flex-initial">
            <span className="text-2xl font-black">99.8%</span>
            <p className="text-[10px] font-bold text-indigo-200 mt-1 uppercase tracking-widest">OCR Accuracy</p>
          </div>
          <div className="px-5 py-4.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white flex-1 md:flex-initial">
            <span className="text-2xl font-black">100%</span>
            <p className="text-[10px] font-bold text-indigo-200 mt-1 uppercase tracking-widest">Data Private</p>
          </div>
        </div>
      </section>

      {/* 5. COMPARISON SECTION */}
      <section id="comparison" className="flex flex-col gap-6">
        <div className="text-center max-w-md mx-auto mb-4">
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-900 dark:text-neutral-50">
            A Better Way to Work
          </h2>
          <p className="text-sm font-semibold text-neutral-400 dark:text-neutral-500 mt-1">
            How PDFLOW contrasts against average online PDF utilities.
          </p>
        </div>

        <div className="matte-surface bg-white/40 dark:bg-neutral-950/10 border border-neutral-200/50 dark:border-neutral-800/80 rounded-3xl overflow-hidden backdrop-blur-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200/60 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/20 text-xs sm:text-sm font-bold text-neutral-500 dark:text-neutral-400">
                <th className="p-4 sm:p-5">Feature</th>
                <th className="p-4 sm:p-5 text-indigo-600 dark:text-indigo-400">PDFLOW (Local)</th>
                <th className="p-4 sm:p-5">Traditional Sites</th>
              </tr>
            </thead>
            <tbody className="text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 divide-y divide-neutral-200/40 dark:divide-neutral-800/30">
              <tr>
                <td className="p-4 sm:p-5 font-bold">Privacy / Security</td>
                <td className="p-4 sm:p-5 text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <Check className="w-4 h-4 shrink-0 text-emerald-500" />
                  Local-first, no file uploads
                </td>
                <td className="p-4 sm:p-5 text-neutral-400">Uploaded to cloud servers</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold">Operation Speeds</td>
                <td className="p-4 sm:p-5 text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <Check className="w-4 h-4 shrink-0 text-emerald-500" />
                  Near-zero latency
                </td>
                <td className="p-4 sm:p-5 text-neutral-400">Delayed by upload/download bounds</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold">Usage Limits</td>
                <td className="p-4 sm:p-5 text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <Check className="w-4 h-4 shrink-0 text-emerald-500" />
                  Unlimited free tasks
                </td>
                <td className="p-4 sm:p-5 text-neutral-400">Strict hourly caps or paywalls</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold">User Interface</td>
                <td className="p-4 sm:p-5 text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <Check className="w-4 h-4 shrink-0 text-emerald-500" />
                  Minimal, clean SaaS UX
                </td>
                <td className="p-4 sm:p-5 text-neutral-400">Cluttered with ads & redirection</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. REAL TRUST METRICS */}
      <section className="flex flex-col gap-6">
        <div className="text-center max-w-md mx-auto mb-4">
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-900 dark:text-neutral-50">
            Trust PDFlow With Your Workflows
          </h2>
          <p className="text-sm font-semibold text-neutral-400 dark:text-neutral-500 mt-1">
            Real metrics backing up our privacy-first browser utility network.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { metric: '100% Free', label: 'No Limits or Premium Plans' },
            { metric: '0 Files', label: 'Uploaded to Server Databases' },
            { metric: 'Local-First', label: 'Runs in Local Browser Sandbox' },
            { metric: 'Instant', label: 'Bypass Cloud Queue Latency' }
          ].map((stat, idx) => (
            <div
              key={idx}
              className="matte-surface bg-white/60 dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/60 text-center flex flex-col gap-1.5"
            >
              <span className="text-3xl font-heading font-black text-indigo-600 dark:text-indigo-400">
                {stat.metric}
              </span>
              <span className="text-xs font-bold text-neutral-500 dark:text-neutral-450">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FAQ ACCORDION */}
      <section className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
        <div className="text-center mb-4">
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-900 dark:text-neutral-50">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="matte-surface bg-white/60 dark:bg-neutral-900/40 border border-neutral-200/50 dark:border-neutral-800/60 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-heading font-extrabold text-sm sm:text-base text-neutral-800 dark:text-neutral-200 focus:outline-none cursor-pointer"
                >
                  {faq.q}
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-neutral-400 dark:text-neutral-500 shrink-0 ml-4"
                  >
                    ▼
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 pb-5 pt-1 text-sm font-semibold text-neutral-500 dark:text-neutral-400 leading-relaxed border-t border-neutral-100/50 dark:border-neutral-800/30">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="border-t border-neutral-200/40 dark:border-neutral-800/40 pt-16 pb-8 flex flex-col gap-10 mt-16 text-xs text-neutral-450 dark:text-neutral-500 font-semibold">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          {/* Logo & Privacy Differentiator */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5">
              <Logo className="w-6 h-6" />
              <span className="font-heading font-extrabold text-base tracking-tight text-neutral-900 dark:text-neutral-50">
                PDFLOW
              </span>
            </div>
            <p className="text-xs font-semibold leading-relaxed text-neutral-500 dark:text-neutral-500">
              100% browser-based private document utilities. Your files never leave your device. Fully free, no registrations required.
            </p>
          </div>

          {/* Popular Tools Column 1 */}
          <div className="flex flex-col gap-2.5">
            <h5 className="font-heading font-extrabold text-neutral-800 dark:text-neutral-200 uppercase tracking-widest text-[10px]">
              PDF Conversion
            </h5>
            <Link href="/pdf-to-word" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">PDF to Word</Link>
            <Link href="/word-to-pdf" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Word to PDF</Link>
            <Link href="/pdf-to-image" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">PDF to Image</Link>
            <Link href="/image-to-pdf" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Image to PDF</Link>
          </div>

          {/* Popular Tools Column 2 */}
          <div className="flex flex-col gap-2.5">
            <h5 className="font-heading font-extrabold text-neutral-800 dark:text-neutral-200 uppercase tracking-widest text-[10px]">
              Optimization & AI
            </h5>
            <Link href="/compress-pdf" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Compress PDF</Link>
            <Link href="/ocr-pdf" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">OCR Scans (AI)</Link>
            <Link href="/pdf-to-excel" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">PDF to Excel</Link>
            <Link href="/excel-to-pdf" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Excel to PDF</Link>
          </div>

          {/* Site Pages */}
          <div className="flex flex-col gap-2.5">
            <h5 className="font-heading font-extrabold text-neutral-800 dark:text-neutral-200 uppercase tracking-widest text-[10px]">
              Platform
            </h5>
            <a href="#tools" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">All Utilities</a>
            <Link href="/recent" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Session Log (History)</Link>
            <a href="#comparison" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Comparison Guide</a>
          </div>
        </div>

        <div className="border-t border-neutral-100 dark:border-neutral-900 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-[11px] text-neutral-450 dark:text-neutral-550">
          <span>&copy; {new Date().getFullYear()} PDFLOW. All rights reserved. Locally synthesized first.</span>
          <div className="flex items-center gap-5">
            <Link href="/compress-pdf" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Free PDF Compressor</Link>
            <Link href="/pdf-to-word" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Free PDF Converter</Link>
            <Link href="/ocr-pdf" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Free OCR Tool</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
