// Simple Next.js development server wrapper
import { spawn } from 'child_process'
import path from 'path'

const isDev = process.env.NODE_ENV === 'development'

if (isDev) {
  console.log('Starting Next.js development server...')
  
  // Start Next.js dev server
  const nextProcess = spawn('npx', ['next', 'dev', '-p', '5000'], {
    stdio: 'inherit',
    cwd: process.cwd()
  })
  
  nextProcess.on('close', (code) => {
    console.log(`Next.js dev server exited with code ${code}`)
    process.exit(code || 0)
  })
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\nShutting down server...')
    nextProcess.kill('SIGINT')
  })
  
  process.on('SIGTERM', () => {
    console.log('\nShutting down server...')
    nextProcess.kill('SIGTERM')
  })
} else {
  console.log('Starting Next.js production server...')
  
  // Start Next.js production server
  const nextProcess = spawn('npx', ['next', 'start', '-p', '5000'], {
    stdio: 'inherit',
    cwd: process.cwd()
  })
  
  nextProcess.on('close', (code) => {
    console.log(`Next.js production server exited with code ${code}`)
    process.exit(code || 0)
  })
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\nShutting down server...')
    nextProcess.kill('SIGINT')
  })
  
  process.on('SIGTERM', () => {
    console.log('\nShutting down server...')
    nextProcess.kill('SIGTERM')
  })
}