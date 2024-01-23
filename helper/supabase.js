import { setupURLPolyfill } from 'react-native-url-polyfill'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
// 
setupURLPolyfill()
// Create a single supabase client for interacting with your database
export const supabase = createClient(
    'https://gxhrzxsrvbiuvolhytvw.supabase.co'
    , 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4aHJ6eHNydmJpdXZvbGh5dHZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODMwMzE4NjIsImV4cCI6MTk5ODYwNzg2Mn0.l4ePZcjEIKv9N31Wz2BlTZTpNxKMFiRiItmfEWNIGas', {
        auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        }})

