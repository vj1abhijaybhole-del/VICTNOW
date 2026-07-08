import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || 'https://qfabhexouufjeyipxoes.supabase.co').trim();
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

// Keep the supabase client for compatibility, in case other code references it
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY || 'dummy-key');

// Helper to save a user session/profile
export async function saveUserProfile(email: string, mobile: string, name?: string) {
  try {
    console.log('Posting profile to secure server API for:', email);
    const response = await fetch('/api/profiles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, mobile, name })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server returned error: ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Server profiles response:', result);
    return { data: result.data, error: null };
  } catch (err: any) {
    console.error('profiles exception in client helper:', err);
    return { data: null, error: err };
  }
}

// Helper to insert an order
export async function saveOrder(orderData: {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  company?: string | null;
  address: string;
  city: string;
  zip: string;
  items: any[];
  total_price: number;
  payment_method: string;
}) {
  try {
    console.log('Posting order to secure server API:', orderData);
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server returned error: ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Server orders response:', result);
    return { data: result.data, error: null };
  } catch (err: any) {
    console.error('orders exception in client helper:', err);
    return { data: null, error: err };
  }
}

// Helper to save corporate gifting design requests
export async function saveGiftingRequest(requestData: {
  perfume_id: string;
  size: string;
  quantity: number;
  recipient_name: string;
  message: string;
  font_style: string;
  ribbon_color: string;
  customer_email: string;
  customer_phone?: string;
}) {
  try {
    console.log('Posting gifting request to secure server API:', requestData);
    const response = await fetch('/api/gifting-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server returned error: ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Server gifting_requests response:', result);
    return { data: result.data, error: null };
  } catch (err: any) {
    console.error('gifting_requests exception in client helper:', err);
    return { data: null, error: err };
  }
}
