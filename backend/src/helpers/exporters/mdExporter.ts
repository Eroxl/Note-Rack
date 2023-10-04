import type exporter from './exporter';
import type { Block } from '../../models/pageModel';
import PageModel from '../../models/pageModel';

const blockTypes = {
  'h1': '#',
  'h2': '##',
  'h3': '###',
  'h4': '####',
  'h5': '#####',

  'math': '$$',
  'quote': '>',
  'callout': '|',

  'page': '[[ {{match}} ]]'
}

const inlineBlockTypes = {
  'bold': '**',
  'italic': '*',
  'strikethrough': '--',
  'underline': '__',
}

const renderInlineBlock = (block: Block) => {
  if (!block.properties.value || typeof block.properties.value !== 'string') return ''; 
  
  if (!block.properties.style) return block.properties.value;

  const styles = block.properties.style as { type: (keyof typeof inlineBlockTypes)[], start: number, end: number }[];

  let rendered = block.properties.value;

  styles.forEach((style) => {
    const binds = style.type.map((type) => inlineBlockTypes[type]).join('');

    const preText = rendered.slice(0, style.start);
    const postText = rendered.slice(style.end);
    const text = rendered.slice(style.start, style.end);

    rendered = `${preText}${binds}${text}${binds}${postText}`;
  });

  return rendered;
};

const mdExporter: exporter = async (page) => {
  const renderedBlocks = page.data.map(async (block) => {
    if (!blockTypes[block.blockType as keyof typeof blockTypes]) return '';

    if (block.blockType === 'page') {
      const pageTitle = (block.properties.value as string) || '';

      const pageInfo = await PageModel.findById((block as any)._id);

      const pageIcon = (pageInfo?.style as any)?.icon || '';

      return blockTypes[block.blockType].replace('{{match}}', `${pageIcon} ${pageTitle}`);
    }

    if (block.blockType !== 'math') {
      return `${blockTypes[block.blockType as keyof typeof blockTypes]} ${renderInlineBlock(block)}`;
    }

    return `${blockTypes[block.blockType as keyof typeof blockTypes]}${block.properties.value || ''}`;
  });

  const renderedBlocksResolved = (await Promise.all(renderedBlocks)).join('\n');

  return Buffer.from(renderedBlocksResolved, 'utf-8');
};

export default mdExporter;
