const API_URL = 'http://localhost:3000/api';

export async function getFeed() {
  try {
    const res = await fetch(`${API_URL}/messages`);
    if (!res.ok) throw new Error('Failed to fetch feed');
    return await res.json();
  } catch (error) {
    console.error('Error fetching feed:', error);
    throw error;
  }
}

export async function createMessage(text: string, userId: number = 1) {
  try {
    const res = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, userId }),
    });
    if (!res.ok) throw new Error('Failed to create message');
    return await res.json();
  } catch (error) {
    console.error('Error creating message:', error);
    throw error;
  }
}

export async function likeMessage(messageId: number) {
  try {
    const res = await fetch(`${API_URL}/messages/${messageId}/like`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to like message');
    return await res.json();
  } catch (error) {
    console.error('Error liking message:', error);
    throw error;
  }
}
