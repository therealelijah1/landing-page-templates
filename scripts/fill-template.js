#!/usr/bin/env node
// Replaces {{placeholders}} in a template with values from a JSON file.
// Usage: node scripts/fill-template.js saas/index.html content.json > out.html

const fs = require("fs");

function fill(template, values) {
  const missing = new Set();
  const output = template.replace(/\{\{\s*([a-z0-9_]+)\s*\}\}/gi, (match, key) => {
    if (Object.prototype.hasOwnProperty.call(values, key)) return String(values[key]);
    missing.add(key);
    return match;
  });
  return { output, missing: [...missing] };
}

if (require.main === module) {
  const [templatePath, valuesPath] = process.argv.slice(2);
  if (!templatePath || !valuesPath) {
    console.error("Usage: fill-template.js <template.html> <values.json>");
    process.exit(1);
  }
  const { output, missing } = fill(
    fs.readFileSync(templatePath, "utf8"),
    JSON.parse(fs.readFileSync(valuesPath, "utf8"))
  );
  if (missing.length) console.error(`Unfilled placeholders: ${missing.join(", ")}`);
  process.stdout.write(output);
}

module.exports = { fill };
