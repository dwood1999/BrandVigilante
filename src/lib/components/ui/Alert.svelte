<script lang="ts">
  import { fade } from 'svelte/transition';
  
  export let type: 'info' | 'success' | 'warning' | 'error' = 'info';
  export let title: string | undefined = undefined;
  export let message: string | undefined = undefined;
  export let dismissible = false;
  export let class_ = '';
  
  let isVisible = true;
  
  function dismiss() {
    isVisible = false;
  }
  
  // Determine alert classes based on type
  $: alertClasses = `
    rounded-md p-4
    ${type === 'info' ? 'bg-blue-50 text-blue-800' : ''}
    ${type === 'success' ? 'bg-green-50 text-green-800' : ''}
    ${type === 'warning' ? 'bg-yellow-50 text-yellow-800' : ''}
    ${type === 'error' ? 'bg-red-50 text-red-800' : ''}
    ${class_}
  `;
  
  // Determine icon based on type
  $: icon = type === 'info' 
    ? '<svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 4a1 1 0 012 0v3a1 1 0 11-2 0v-3z" clip-rule="evenodd" /></svg>'
    : type === 'success'
    ? '<svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>'
    : type === 'warning'
    ? '<svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.981-1.742 2.981H4.42c-1.53 0-2.492-1.647-1.742-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-2a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" /></svg>'
    : '<svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L9 10.586l2.707-2.707a1 1 0 00-1.414-1.414l-1.293 1.293-1.293-1.293z" clip-rule="evenodd" /></svg>';
</script>

{#if isVisible}
  <div class={alertClasses} transition:fade={{ duration: 200 }} role="alert">
    <div class="flex">
      <div class="flex-shrink-0">
        {@html icon}
      </div>
      <div class="ml-3 flex-1">
        {#if title}
          <h3 class="text-sm font-medium">{title}</h3>
        {/if}
        {#if message}
          <div class={title ? 'mt-2 text-sm' : 'text-sm'}>
            <p>{message}</p>
          </div>
        {/if}
        <slot />
      </div>
      {#if dismissible}
        <div class="ml-auto pl-3">
          <div class="-mx-1.5 -my-1.5">
            <button
              type="button"
              class="inline-flex rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-offset-2
                ${type === 'info' ? 'bg-blue-50 text-blue-500 hover:bg-blue-100 focus:ring-blue-600 focus:ring-offset-blue-50' : ''}
                ${type === 'success' ? 'bg-green-50 text-green-500 hover:bg-green-100 focus:ring-green-600 focus:ring-offset-green-50' : ''}
                ${type === 'warning' ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100 focus:ring-yellow-600 focus:ring-offset-yellow-50' : ''}
                ${type === 'error' ? 'bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-600 focus:ring-offset-red-50' : ''}"
              on:click={dismiss}
            >
              <span class="sr-only">Dismiss</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if} 