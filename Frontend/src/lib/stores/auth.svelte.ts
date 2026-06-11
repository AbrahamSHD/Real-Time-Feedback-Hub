const browser = typeof window !== 'undefined';

export function createAuthStore() {
  let user = $state<any>(null);

  async function init() {
    if (!browser) return;

    const stored = localStorage.getItem('guest_user');
    if (stored) {
      try {
        user = JSON.parse(stored);
        return;
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }

    try {
      const res = await fetch('/api/users/random');
      if (res.ok) {
        const data = await res.json();
        user = data;
        localStorage.setItem('guest_user', JSON.stringify(data));
      }
    } catch (e) {
      console.error('Failed to init guest user:', e);
    }
  }

  init();

  return {
    get user() { return user; },
    set user(val) { user = val; }
  };
}

export const auth = createAuthStore();
