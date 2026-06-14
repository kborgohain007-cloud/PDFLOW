'use client';

import React from 'react';
import { ToolPageShell } from '@/components/tool/ToolPageShell';
import { processMergePdf } from '@/utils/pdf-processors';
import { seoContentMap } from '@/data/seo-content';
import { MergePdfOptions } from '@/components/tool/MergePdfOptions';

export default function MergePdfPage() {
  const seo = seoContentMap['merge-pdf'];

  return (
    <ToolPageShell
      toolId={seo.toolId}
      title={seo.h1}
      description={seo.intro}
      allowedTypes={['application/pdf']}
      multiple={true}
      maxSizeMB={100}
      processFiles={processMergePdf}
      optionsComponent={MergePdfOptions}
      infoSections={[
        { title: 'Benefits', content: seo.benefits.map((b) => `**${b.title}**: ${b.description}`).join('\n\n') },
        { title: 'How it Works', content: seo.guideHtml },
        { title: 'FAQ', content: seo.faqs.map((f) => `**${f.q}**\n${f.a}`).join('\n\n') },
      ]}
    />
  );
}
