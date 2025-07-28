/**
 * Database configuration for Supabase
 */

const config = {
  development: {
    url: process.env.DATABASE_URL,
    supabase: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    }
  },
  production: {
    url: process.env.DATABASE_URL,
    supabase: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    }
  }
};

const environment = process.env.NODE_ENV || 'development';

module.exports = config[environment];