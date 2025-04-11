<script lang="ts">
  import type { ButtonProps } from '$lib/types/components';
  import LoadingSpinner from './LoadingSpinner.svelte';
  
  export let variant: ButtonProps['variant'] = 'primary';
  export let size: ButtonProps['size'] = 'md';
  export let loading = false;
  export let disabled = false;
  export let type: ButtonProps['type'] = 'button';
  export let className = '';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
  } as const;
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  } as const;
</script>

<button
  {type}
  class="inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed {variantClasses[variant]} {sizeClasses[size]} {className}"
  {disabled}
  on:click
>
  {#if loading}
    <LoadingSpinner size="sm" class="mr-2" />
  {/if}
  <slot />
</button> 