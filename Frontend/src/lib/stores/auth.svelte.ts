const browser = typeof window !== 'undefined';

export const auth = $state<{ user: any }>({
    user: null
});

export async function initAuth() {
    if (!browser) return;

    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        try {
            auth.user = JSON.parse(storedUser);
            return;
        } catch (error) {
            console.error('Error parsing stored user:', error);
        }
    }

    try {
        const response = await fetch('http://localhost:3000/api/users/random');
        if (response.ok) {
            const user = await response.json();
            auth.user = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
        } else {
            console.error('Failed to fetch random user:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching random user:', error);
    }
}
