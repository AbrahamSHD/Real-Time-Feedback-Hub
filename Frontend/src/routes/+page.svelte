<script lang="ts">
  import PostCard from '../lib/components/PostCard.svelte';
  import CreatePost from '../lib/components/CreatePost.svelte';
  import { getFeed } from '../lib/api';

  let posts = $state<any[]>([]);

  $effect(() => {
    let mounted = true;
    
    async function loadData() {
      try {
        const data = await getFeed();
        if (!mounted) return;
        
        // Map backend data to the structure the UI expects
        posts = data.map((msg: any) => ({
          id: msg.id,
          username: msg.username || `user_${msg.userId || 'unknown'}`,
          avatar: msg.avatar || 'https://ui-avatars.com/api/?name=User&background=random&color=fff',
          content: msg.text || msg.content || '',
          likes: msg.likes || 0,
          date: msg.date || 'Just now',
          isLiked: msg.isLiked || false
        }));
      } catch (error) {
        console.error("Failed to load feed", error);
      }
    }
    
    loadData();
    
    return () => {
      mounted = false;
    };
  });

  function handleCreatePost(newMsg: any) {
    // Map the new message from the API back to the UI structure
    const newPost = {
      id: newMsg.id || Date.now(),
      username: newMsg.username || 'current_user',
      avatar: newMsg.avatar || 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff',
      content: newMsg.text || newMsg.content || '',
      likes: newMsg.likes || 0,
      date: newMsg.date || 'Just now',
      isLiked: newMsg.isLiked || false
    };
    
    posts.unshift(newPost);
  }
</script>

<div class="feed-layout">
  <div class="feed-container">
    <header class="app-header">
      <div class="logo">FeedbackHub</div>
    </header>

    <main class="feed-main">
      <CreatePost oncreate={handleCreatePost} />

      <div class="posts-list">
        {#each posts as post (post.id)}
          <PostCard {post} />
        {/each}
      </div>
    </main>
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    background-color: #fafafa;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #262626;
  }

  .feed-layout {
    display: flex;
    justify-content: center;
    min-height: 100vh;
    padding: 0 16px;
  }

  .feed-container {
    width: 100%;
    max-width: 470px; /* Instagram-like max width */
    display: flex;
    flex-direction: column;
    padding-top: 24px;
    padding-bottom: 40px;
  }

  .app-header {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
  }

  .logo {
    font-size: 28px;
    font-weight: 700;
    background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    letter-spacing: -0.5px;
  }

  .feed-main {
    display: flex;
    flex-direction: column;
  }

  .posts-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
</style>
