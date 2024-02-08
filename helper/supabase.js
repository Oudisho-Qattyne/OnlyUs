import { setupURLPolyfill } from 'react-native-url-polyfill'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
// 
setupURLPolyfill()
// Create a single supabase client for interacting with your database
export const supabase = createClient(
    'https://gxhrzxsrvbiuvolhytvw.supabase.co'
    , '', {
        auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        }})

