const glob = require('fast-glob');
const { resolve, relative, join } = require('path');
const fs = require('fs').promises;

async function processMarkdownFiles(globPattern) {
  try {
    const files = await new Promise((resolve, reject) => {
      const matches = glob.sync([globPattern]);
        resolve(matches);
    });
    // console.log(files.length);

    for (const filename of files) {
      try {
        const content = await fs.readFile(filename, 'utf8');
        // Regex to match the opening tag and capture anything inside it
        const updatedContent = content
        .replace(/(<div class="alert is-helpful[^>]*>)([\s\S]*?)(<\/div>)/gs, (match, openingTagContent, innerContent) => {
          return `<ngrx-docs-alert type="help">${innerContent}</ngrx-docs-alert>`
        })
        .replace(/(<div class="alert is-critical[^>]*>)([\s\S]*?)(<\/div>)/gs, (match, openingTagContent, innerContent) => {
          return `<ngrx-docs-alert type="error">${innerContent}</ngrx-docs-alert>`
        })       
        .replace(/(<div class="alert is-important[^>]*>)([\s\S]*?)(<\/div>)/gs, (match, openingTagContent, innerContent) => {
          return `<ngrx-docs-alert type="inform">${innerContent}</ngrx-docs-alert>`
        })
        .replace(
          /<code-example\s*([^>]*)>(.*?)<\/code-example>/gms,
          (match, openingTagContent, innerContent) => {
            if (innerContent.length === 0) {
              // console.log('no content', openingTagContent, filename);
            }
            
            // console.log(`Found content in opening tag: ${openingTagContent} in: ${filename}`);
            return '<ngrx-code-example ' + openingTagContent + '>\n\n```ts' + innerContent + '```\n\n</ngrx-code-example>';
          }
        ).replaceAll('&gt;', '>').replaceAll('&lt;', '<')
        .replaceAll(`
\`\`\`ts
\`\`\`

`, '')

if (updatedContent.includes('class="alert') && filename.includes('runtime')) {
  console.log('updated alert', filename);
}

// .replace(/<div class="alert is-important">(\n*.*\n*.*)<\/div>/gs, (match, openingTagContent, innerContent) => {
//   return `<ngrx-docs-alert type="inform">${openingTagContent}</ngrx-docs-alert>`
// });
        // if (filename.includes('testing.md')) {
        //   console.log(updatedContent);
        // }
        //  console.log('new file', join(`/Users/robertsbt/projects/ngrx/platform/projects/www/src/app/pages`, relative(`${process.cwd()}/projects/ngrx.io/content`, filename)));
        // if (updatedContent !== content) {
          await fs.writeFile(join(`${process.cwd()}/projects/www/src/app/pages`, relative(`${process.cwd()}/projects/ngrx.io/content`, filename)), updatedContent, 'utf8');
          // console.log(`Processed and updated: ${join(`/Users/robertsbt/projects/ngrx/platform/projects/www/src/app/pages`, relative(`${process.cwd()}/projects/ngrx.io/content`, filename))}`);
        // } else {
          // console.log(`No changes in: ${filename}`);
        // }
      } catch (error) {
        console.error(`Error processing file ${filename}:`, error);
      }
    }

    console.log('Finished processing markdown files.');
  } catch (error) {
    console.error('Error during file globbing:', error);
  }
}

// Example usage: Process all .md files in the current directory
const markdownGlob = process.cwd() + '/projects/ngrx.io/content/guide/**/*.md';
console.log(`Looking for markdown files matching: ${markdownGlob}`);
processMarkdownFiles(markdownGlob);

// You can also specify a different glob pattern, for example:
// processMarkdownFiles('docs/**/*.md'); // Process all .md files in the 'docs' directory and its subdirectories

//<div class="alert is-helpful">(\n*.*\n*.*)</div>
//<ngrx-docs-alert type="help">$1</ngrx-alert>