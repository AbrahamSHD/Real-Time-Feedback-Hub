<script lang="ts">
  import { createMessage } from '../api';
  import { auth } from '../stores/auth.svelte';
  import { getInitials } from '../utils/avatar';

  let { oncreate } = $props<{
    oncreate: (newMsg: any) => void;
  }>();

  let content = $state('');
  let isSubmitting = $state(false);

  async function handleSubmit(event: Event) {
    event.preventDefault();
    if (!content.trim() || isSubmitting) return;

    isSubmitting = true;
    try {
      const userId = auth.user?.id || 1;
      const newMsg = await createMessage(content.trim(), userId);
      oncreate(newMsg);
      content = '';
    } catch (error) {
      console.error("Failed to create message", error);
      alert("Error al publicar el mensaje. Intenta de nuevo.");
    } finally {
      isSubmitting = false;
    }
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  }
</script>

<form class="create-post" onsubmit={handleSubmit}>
  {#if auth.user}
    <div class="posting-as">
      Publicando como: <strong>{auth.user.username}</strong>
    </div>
  {/if}
  <div class="input-area">
    <div class="avatar">
      {getInitials(auth.user?.username || "User")}
    </div>
    <textarea 
      bind:value={content} 
      onkeydown={handleKeydown}
      placeholder="What's happening?" 
      rows="2"
      required
    ></textarea>
  </div>
  <div class="actions">
    <button type="submit" disabled={!content.trim()} class="post-btn">
      Share
    </button>
  </div>
</form>

<style>
  .create-post {
    background: #ffffff;
    border: 1px solid #efefef;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
    transition: box-shadow 0.2s ease;
  }
  .create-post:focus-within {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    border-color: #dbdbdb;
  }
  .posting-as {
    font-size: 13px;
    color: #8e8e8e;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #efefef;
  }
  .posting-as strong {
    color: #262626;
  }
  .input-area {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #0095f6;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 600;
    flex-shrink: 0;
  }
  textarea {
    flex: 1;
    border: none;
    resize: none;
    font-size: 15px;
    font-family: inherit;
    padding: 10px 0;
    outline: none;
    background: transparent;
    color: #262626;
    min-height: 44px;
  }
  textarea::placeholder {
    color: #8e8e8e;
  }
  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #efefef;
  }
  .post-btn {
    background-color: #0095f6;
    color: #ffffff;
    border: none;
    border-radius: 20px;
    padding: 8px 20px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .post-btn:hover:not(:disabled) {
    background-color: #1877f2;
    transform: translateY(-1px);
  }
  .post-btn:active:not(:disabled) {
    transform: translateY(0);
  }
  .post-btn:disabled {
    background-color: #b2dffc;
    cursor: not-allowed;
    opacity: 0.7;
  }
</style>
