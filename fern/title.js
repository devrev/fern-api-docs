const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');
const { parse } = require('yaml');

// Function to extract frontmatter and content from MDX
const parseMdx = (content) => {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (match) {
    return {
      frontmatter: match[1],
      content: match[2],
      hasFrontmatter: true
    };
  }
  
  return {
    frontmatter: '',
    content: content,
    hasFrontmatter: false
  };
};

// Function to update or add title in frontmatter
const updateFrontmatter = (frontmatter, title) => {
  const lines = frontmatter.split('\n').filter(line => !line.trim().startsWith('title:'));
  lines.unshift(`title: ${title}`);
  return lines.join('\n');
};

// Function to update a single MDX file
const updateMdxFile = (relativePath, title) => {
  // Resolve the path - remove '../docs/pages/' or '../docs/' and use docs/pages/
  let cleanPath = relativePath
    .replace('../docs/pages/', '')
    .replace('../docs/', '');
  
  const fullPath = resolve(__dirname, 'docs', 'pages', cleanPath);
  
  try {
    // Read the MDX file
    const mdxContent = readFileSync(fullPath, 'utf8');
    const { frontmatter, content, hasFrontmatter } = parseMdx(mdxContent);
    
    // Update or create frontmatter
    let newFrontmatter;
    if (hasFrontmatter) {
      newFrontmatter = updateFrontmatter(frontmatter, title);
    } else {
      newFrontmatter = `title: ${title}`;
    }
    
    // Construct new file content
    const newContent = `---\n${newFrontmatter}\n---\n${content}`;
    
    // Write back to file
    writeFileSync(fullPath, newContent, 'utf8');
    console.log(`✓ Updated: ${cleanPath} with title "${title}"`);
    
  } catch (error) {
    console.error(`✗ Error processing ${fullPath}:`, error.message);
  }
};

// Recursive function to process navigation items at any nesting level
const processNavigationItems = (items, depth = 0) => {
  if (!items) {
    return;
  }

  // Handle array of items
  if (Array.isArray(items)) {
    items.forEach(item => {
      if (typeof item === 'object' && item !== null) {
        processNavigationItems(item, depth);
      }
    });
    return;
  }

  // Handle object items
  if (typeof items === 'object') {
    // Get the title from either 'page' or 'section' field
    const title = items.page || items.section;
    
    // Check if this object has a path (it's a page/section entry with a file)
    if (items.path && title) {
      updateMdxFile(items.path, title);
    }
    
    // Also check for standalone 'page' with 'path' (original pattern)
    if (items.page && items.path) {
      updateMdxFile(items.path, items.page);
    }
    
    // Iterate through all keys in the object to find nested structures
    Object.keys(items).forEach(key => {
      const value = items[key];
      
      // Skip already processed keys
      if (key === 'page' || key === 'path' || key === 'slug' || key === 'section') {
        return;
      }
      
      // Special handling for 'contents' which is common
      if (key === 'contents' && Array.isArray(value)) {
        processNavigationItems(value, depth + 1);
        return;
      }
      
      // Recursively process any object or array value
      if (value !== null && typeof value === 'object') {
        processNavigationItems(value, depth + 1);
      }
    });
  }
};

// Function to process YAML file and update MDX files
const processYamlFile = (yamlPath) => {
  try {
    const yamlContent = readFileSync(yamlPath, 'utf8');
    const data = parse(yamlContent);
    
    if (!data.navigation) {
      console.log(`No navigation found in ${yamlPath}`);
      return;
    }
    
    // Process navigation items recursively
    processNavigationItems(data.navigation);
    
  } catch (error) {
    console.error(`Error reading ${yamlPath}:`, error.message);
  }
};

// Main execution
const main = () => {
  console.log('Starting MDX title update process...\n');
  
  const publicYamlPath = resolve(__dirname, 'public.yml');
  const betaYamlPath = resolve(__dirname, 'beta.yml');
  
  console.log('Processing public.yml...');
  processYamlFile(publicYamlPath);
  
  console.log('\nProcessing beta.yml...');
  processYamlFile(betaYamlPath);
  
  console.log('\n✓ All files processed!');
};

main();