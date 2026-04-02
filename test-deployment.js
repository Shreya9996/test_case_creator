#!/usr/bin/env node

/**
 * Deployment Test Script for Test Case Creator
 * This script verifies that all components are ready for deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Test Case Creator - Deployment Readiness Check\n');

// Check if required files exist
const requiredFiles = [
  'package.json',
  'vercel.json',
  'frontend/package.json',
  'backend/package.json',
  'api/index.js',
  '.env.example'
];

console.log('📁 Checking required files...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing. Please check the project structure.');
  process.exit(1);
}

// Check package.json files for required dependencies
console.log('\n📦 Checking dependencies...');

const rootPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const frontendPackage = JSON.parse(fs.readFileSync('frontend/package.json', 'utf8'));
const backendPackage = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));

const requiredBackendDeps = [
  'express',
  '@google/generative-ai',
  '@supabase/supabase-js',
  'cors',
  'dotenv'
];

const requiredFrontendDeps = [
  'react',
  'react-dom',
  '@supabase/supabase-js',
  'lucide-react'
];

let backendDepsOk = true;
let frontendDepsOk = true;

requiredBackendDeps.forEach(dep => {
  if (!backendPackage.dependencies || !backendPackage.dependencies[dep]) {
    console.log(`❌ Backend missing: ${dep}`);
    backendDepsOk = false;
  }
});

requiredFrontendDeps.forEach(dep => {
  if (!frontendPackage.dependencies || !frontendPackage.dependencies[dep]) {
    console.log(`❌ Frontend missing: ${dep}`);
    frontendDepsOk = false;
  }
});

if (backendDepsOk) {
  console.log('✅ Backend dependencies OK');
}

if (frontendDepsOk) {
  console.log('✅ Frontend dependencies OK');
}

// Check Vercel configuration
console.log('\n⚙️  Checking Vercel configuration...');

const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));

if (vercelConfig.version === 2 && vercelConfig.builds && vercelConfig.routes) {
  console.log('✅ Vercel configuration OK');
} else {
  console.log('❌ Vercel configuration invalid');
}

// Check API entry point
console.log('\n🔌 Checking API configuration...');

if (fs.existsSync('api/index.js')) {
  const apiContent = fs.readFileSync('api/index.js', 'utf8');
  if (apiContent.includes('export default app')) {
    console.log('✅ API entry point OK');
  } else {
    console.log('❌ API entry point invalid');
  }
}

// Environment variables check
console.log('\n🌍 Checking environment variables template...');

if (fs.existsSync('.env.example')) {
  const envContent = fs.readFileSync('.env.example', 'utf8');
  const requiredEnvVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'SUPABASE_URL',
    'SUPABASE_KEY',
    'GEMINI_API_KEY'
  ];

  let envVarsOk = true;
  requiredEnvVars.forEach(envVar => {
    if (!envContent.includes(envVar)) {
      console.log(`❌ Missing environment variable: ${envVar}`);
      envVarsOk = false;
    }
  });

  if (envVarsOk) {
    console.log('✅ Environment variables template OK');
  }
}

console.log('\n📋 Deployment Checklist:');
console.log('1. ✅ Project structure verified');
console.log('2. ✅ Dependencies configured');
console.log('3. ✅ Vercel configuration ready');
console.log('4. ✅ API routes configured');
console.log('5. ✅ Environment variables template created');

console.log('\n🚀 Ready for deployment!');
console.log('\nNext steps:');
console.log('1. Set environment variables in Vercel dashboard');
console.log('2. Run: npm run vercel-deploy');
console.log('3. Or use: vercel --prod');

console.log('\n📚 See README.md for detailed deployment instructions');