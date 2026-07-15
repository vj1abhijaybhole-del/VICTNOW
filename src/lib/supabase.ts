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

// Helper to authenticate (login) a user via email and password
export async function loginUser(email: string, password: string) {
  try {
    console.log('Authenticating client with server for:', email);
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Authentication failed');
    }
    
    const result = await response.json();
    return { data: result.user, error: null };
  } catch (err: any) {
    console.error('loginUser exception in client helper:', err);
    return { data: null, error: err.message };
  }
}

// Helper to check if an email already exists
export async function checkEmailExists(email: string) {
  try {
    const response = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    if (!response.ok) {
      throw new Error('Check email failed');
    }
    const result = await response.json();
    return result.exists;
  } catch (err) {
    console.error('checkEmailExists error:', err);
    return false;
  }
}

// Helper to register a new user with email, password, mobile and optional name
export async function registerUser(email: string, password: string, mobile: string, name?: string) {
  try {
    console.log('Registering client with server for:', email);
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, mobile, name })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Registration failed');
    }
    
    const result = await response.json();
    return { data: result.user, error: null };
  } catch (err: any) {
    console.error('registerUser exception in client helper:', err);
    return { data: null, error: err.message };
  }
}

// Helper to fetch user activities (orders and customized gifting requests)
export async function fetchUserActivities(email: string) {
  try {
    console.log('Fetching activities from server for:', email);
    const response = await fetch(`/api/profiles/${encodeURIComponent(email)}/activities`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch user activities');
    }
    
    const result = await response.json();
    return { orders: result.orders || [], giftingRequests: result.giftingRequests || [], error: null };
  } catch (err: any) {
    console.error('fetchUserActivities exception in client helper:', err);
    return { orders: [], giftingRequests: [], error: err.message };
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

// Helper to fetch all dynamic products from the database
export async function fetchProducts() {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) {
      throw new Error('Failed to fetch dynamic products catalog');
    }
    const result = await response.json();
    if (result.success && result.data && result.data.length > 0) {
      // Map keys from Postgres snake_case into React camelCase structures
      const mapped = result.data.map((p: any) => ({
        id: p.id,
        name: p.name,
        type: p.type,
        tagline: p.tagline,
        price: Number(p.price),
        size: p.size,
        edition: p.edition,
        imageUrl: p.image_url,
        description: p.description,
        concentration: p.concentration,
        longevity: p.longevity,
        sillage: p.sillage,
        notes: typeof p.notes === 'string' ? JSON.parse(p.notes) : p.notes,
        character: typeof p.character === 'string' ? JSON.parse(p.character) : p.character,
        isLimitedEdition: p.is_limited_edition !== undefined ? p.is_limited_edition : true
      }));
      return { data: mapped, error: null };
    }
    return { data: null, error: 'Database table is empty' };
  } catch (err: any) {
    console.error('fetchProducts client exception:', err);
    return { data: null, error: err.message || err };
  }
}

// Helper to request a private VIP reserve invitation
export async function submitInvitationRequest(email: string) {
  try {
    const response = await fetch('/api/invitations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to request invitation');
    }
    const result = await response.json();
    return { data: result.data, error: null };
  } catch (err: any) {
    console.error('submitInvitationRequest client exception:', err);
    return { data: null, error: err.message || err };
  }
}
