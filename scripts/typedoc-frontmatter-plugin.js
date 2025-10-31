// @ts-check

const path = require('path');
const fs = require('fs');

/**
 * Custom TypeDoc plugin to add frontmatter to generated markdown files
 * @param {import('typedoc').Application} app
 */
exports.load = function (app) {
  // Read version from package.json once
  const packageJsonPath = path.resolve(__dirname, '../package.json');
  let version = '1.0.0'; // Default fallback
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    version = packageJson.version || '1.0.0';
  } catch (/** @type {any} */ error) {
    console.warn('Could not read version from package.json, using default:', error.message);
  }

  // Hook into the page rendering event for markdown output
  app.renderer.on('endPage', (event) => {
    // Only process markdown files
    if (!event.filename.endsWith('.md')) {
      return;
    }

    // Extract the page title from the model
    const title = event.model.name || 'Documentation';

    // Determine the page type for better categorization
    let pageType = 'doc';
    // Check if model has kind property (it's a Reflection object)
    if ('kind' in event.model && event.model.kind !== undefined) {
      const { ReflectionKind } = require('typedoc');
      switch (event.model.kind) {
        case ReflectionKind.Module:
          pageType = 'module';
          break;
        case ReflectionKind.Class:
          pageType = 'class';
          break;
        case ReflectionKind.Interface:
          pageType = 'interface';
          break;
        case ReflectionKind.Function:
          pageType = 'function';
          break;
        case ReflectionKind.Enum:
          pageType = 'enum';
          break;
        default:
          pageType = 'doc';
      }
    }

    // Get current date in ISO format
    const dateGenerated = new Date().toISOString().split('T')[0];

    // Build the frontmatter
    const frontmatter = [
      '---',
      `title: ${title}`,
      `type: ${pageType}`,
      `version: ${version}`,
      `generated: ${dateGenerated}`,
      `repo: puya-ts`,
      '---',
      ''
    ].join('\n');

    // Prepend frontmatter to the page content
    event.contents = frontmatter + event.contents;
  });
};
