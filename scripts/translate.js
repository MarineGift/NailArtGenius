#!/usr/bin/env node

/**
 * Translation management script
 * Helps manage and validate translation files
 */

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '../public/locales');
const SUPPORTED_LANGUAGES = ['ko', 'en', 'ja', 'es'];

function loadTranslations(lang) {
  const filePath = path.join(LOCALES_DIR, lang, 'common.json');
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Translation file not found: ${filePath}`);
    return null;
  }
  
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`❌ Error parsing ${filePath}:`, error.message);
    return null;
  }
}

function getAllKeys(obj, prefix = '') {
  const keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys.push(...getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function validateTranslations() {
  console.log('🔍 Validating translations...\n');
  
  const translations = {};
  let hasErrors = false;
  
  // Load all translations
  for (const lang of SUPPORTED_LANGUAGES) {
    translations[lang] = loadTranslations(lang);
    if (!translations[lang]) {
      hasErrors = true;
    }
  }
  
  if (hasErrors) {
    console.log('❌ Some translation files have errors. Please fix them first.');
    return false;
  }
  
  // Get all keys from Korean (reference language)
  const referenceKeys = getAllKeys(translations.ko);
  console.log(`📊 Reference language (Korean) has ${referenceKeys.length} keys`);
  
  // Check each language
  for (const lang of SUPPORTED_LANGUAGES) {
    if (lang === 'ko') continue;
    
    const langKeys = getAllKeys(translations[lang]);
    const missingKeys = referenceKeys.filter(key => !langKeys.includes(key));
    const extraKeys = langKeys.filter(key => !referenceKeys.includes(key));
    
    console.log(`\n🌐 ${lang.toUpperCase()} (${langKeys.length} keys):`);
    
    if (missingKeys.length > 0) {
      console.log(`  ❌ Missing ${missingKeys.length} keys:`);
      missingKeys.forEach(key => console.log(`    - ${key}`));
      hasErrors = true;
    }
    
    if (extraKeys.length > 0) {
      console.log(`  ⚠️  Extra ${extraKeys.length} keys:`);
      extraKeys.forEach(key => console.log(`    + ${key}`));
    }
    
    if (missingKeys.length === 0 && extraKeys.length === 0) {
      console.log('  ✅ All keys match reference');
    }
  }
  
  if (!hasErrors) {
    console.log('\n🎉 All translations are valid!');
    return true;
  } else {
    console.log('\n❌ Translation validation failed. Please fix the issues above.');
    return false;
  }
}

function listKeys() {
  console.log('📋 All translation keys:\n');
  
  const translations = loadTranslations('ko');
  if (!translations) return;
  
  const keys = getAllKeys(translations);
  keys.sort().forEach(key => {
    console.log(`  ${key}`);
  });
  
  console.log(`\n📊 Total: ${keys.length} keys`);
}

// Main execution
const command = process.argv[2];

switch (command) {
  case 'validate':
    validateTranslations();
    break;
  case 'list':
    listKeys();
    break;
  default:
    console.log('🌐 Translation Management Tool\n');
    console.log('Usage:');
    console.log('  node scripts/translate.js validate  - Validate all translations');
    console.log('  node scripts/translate.js list      - List all translation keys');
    break;
}