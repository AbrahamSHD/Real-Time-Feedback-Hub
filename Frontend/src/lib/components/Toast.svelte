<script lang="ts">
  let { notifications }: { notifications: { id: number; message: string }[] } = $props();
</script>

<div class="toast-container">
  {#each notifications as notif (notif.id)}
    <div class="toast">
      {notif.message}
    </div>
  {/each}
</div>

<style>
  .toast-container {
    position: fixed;
    bottom: 24px;
    right: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    z-index: 9999;
  }
  .toast {
    background-color: #262626;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    font-size: 14px;
    animation: slideIn 0.3s ease-out forwards;
  }
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
</style>
