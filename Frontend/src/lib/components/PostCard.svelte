<script lang="ts">
  import { likeMessage } from "../api";
  import { getInitials } from "../utils/avatar";

  let { message } = $props<{
    message: {
      id: number;
      username?: string;
      avatar?: string;
      content: string;
      likes: number;
      date: string;
      isLiked?: boolean;
    };
  }>();

  let isLiking = $state(false);

  async function toggleLike() {
    if (isLiking) return;

    // Optimistic UI update mutating the deeply reactive message prop
    message.isLiked = !message.isLiked;
    message.likes += message.isLiked ? 1 : -1;
    isLiking = true;

    try {
      await likeMessage(message.id, 1);
    } catch (error) {
      console.error("Failed to like message:", error);
      // Revert if error
      message.isLiked = !message.isLiked;
      message.likes += message.isLiked ? 1 : -1;
    } finally {
      isLiking = false;
    }
  }
</script>

<article class="post-card">
  <div class="header">
    <div class="avatar-ring">
      <div class="avatar">
        {getInitials(message.username || "User")}
      </div>
    </div>
    <div class="user-info">
      <span class="username">{message.username || "User"}</span>
      <span class="date">{message.date}</span>
    </div>
    <button class="more-options" aria-label="More options">
      <svg viewBox="0 0 24 24"
        ><circle cx="12" cy="12" r="1.5" /><circle
          cx="6"
          cy="12"
          r="1.5"
        /><circle cx="18" cy="12" r="1.5" /></svg
      >
    </button>
  </div>

  <div class="content">
    <p>{message.content}</p>
  </div>

  <div class="actions">
    <button
      class="action-btn"
      onclick={toggleLike}
      class:liked={message.isLiked}
      aria-label="Like post"
    >
      <svg viewBox="0 0 24 24" class="heart-icon">
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        />
      </svg>
    </button>
    <button class="action-btn" aria-label="Comment">
      <svg viewBox="0 0 24 24"
        ><path
          d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22z"
          fill="none"
          stroke="currentColor"
          stroke-linejoin="round"
          stroke-width="2"
        /></svg
      >
    </button>
    <button class="action-btn" aria-label="Share">
      <svg viewBox="0 0 24 24"
        ><line
          fill="none"
          stroke="currentColor"
          stroke-linejoin="round"
          stroke-width="2"
          x1="22"
          x2="9.218"
          y1="3"
          y2="10.083"
        /><polygon
          fill="none"
          points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
          stroke="currentColor"
          stroke-linejoin="round"
          stroke-width="2"
        /></svg
      >
    </button>
  </div>

  <div class="footer">
    <span class="likes-count"><strong>{message.likes}</strong> likes</span>
  </div>
</article>

<style>
  .post-card {
    background: #ffffff;
    border: 1px solid #efefef;
    border-radius: 12px;
    margin-bottom: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
    overflow: hidden;
  }
  .post-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  }
  .header {
    display: flex;
    align-items: center;
    padding: 14px 16px;
  }
  .avatar-ring {
    background: linear-gradient(
      45deg,
      #f09433 0%,
      #e6683c 25%,
      #dc2743 50%,
      #cc2366 75%,
      #bc1888 100%
    );
    border-radius: 50%;
    padding: 2px;
    margin-right: 12px;
  }
  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #0095f6; /* Solid color */
    color: #ffffff; /* White text */
    display: flex; /* Centered via flexbox */
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    border: 2px solid #fff;
    box-sizing: content-box;
  }
  .user-info {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .username {
    font-weight: 600;
    font-size: 14px;
    color: #262626;
  }
  .date {
    font-size: 12px;
    color: #8e8e8e;
    margin-top: 2px;
  }
  .more-options {
    background: none;
    border: none;
    cursor: pointer;
    color: #262626;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .more-options svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }
  .content {
    padding: 0 16px;
    font-size: 15px;
    color: #262626;
    line-height: 1.5;
    margin-bottom: 12px;
  }
  .content p {
    margin: 0;
  }
  .actions {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    gap: 16px;
  }
  .action-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: #262626;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.1s ease;
  }
  .action-btn:active {
    transform: scale(0.9);
  }
  .action-btn svg {
    width: 24px;
    height: 24px;
  }
  .heart-icon {
    fill: transparent;
    stroke: currentColor;
    stroke-width: 2;
    transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  .action-btn.liked .heart-icon {
    fill: #ed4956;
    stroke: #ed4956;
    transform: scale(1.1);
  }
  .footer {
    padding: 0 16px 16px;
  }
  .likes-count {
    font-size: 14px;
    color: #262626;
  }
</style>
