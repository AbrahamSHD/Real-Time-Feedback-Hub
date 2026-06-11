<script lang="ts">
  import PostCard from '../lib/components/PostCard.svelte';
  import CreatePost from '../lib/components/CreatePost.svelte';

  // Mock data managed with Svelte 5 rune $state
  let posts = $state([
    {
      id: 1,
      username: 'ui_designer',
      avatar: 'https://ui-avatars.com/api/?name=UI+Designer&background=FFB6C1&color=fff',
      content: 'Just wrapped up a new design system using minimal aesthetic! What do you guys think? ✨🎨',
      likes: 342,
      date: '2 hours ago',
      isLiked: true
    },
    {
      id: 2,
      username: 'svelte_dev',
      avatar: 'https://ui-avatars.com/api/?name=Svelte+Dev&background=ff3e00&color=fff',
      content: 'Svelte 5 runes make state management so clean. The developer experience is just unmatched. 🔥',
      likes: 128,
      date: '5 hours ago',
      isLiked: false
    },
    {
      id: 3,
      username: 'frontend_master',
      avatar: 'https://ui-avatars.com/api/?name=Frontend+Master&background=7FFFD4&color=333',
      content: 'Learning to build highly interactive UIs. Consistency and micro-animations are key to a premium feel. 💻',
      likes: 89,
      date: '1 day ago',
      isLiked: false
    }
  ]);

  function handleCreatePost(content: string) {
    const newPost = {
      id: Date.now(),
      username: 'current_user',
      avatar: 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff',
      content,
      likes: 0,
      date: 'Just now',
      isLiked: false
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
