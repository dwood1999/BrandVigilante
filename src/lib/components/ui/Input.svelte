<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let type: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search' = 'text';
  export let value = '';
  export let placeholder = '';
  export let label = '';
  export let helperText = '';
  export let error = '';
  export let disabled = false;
  export let required = false;
  export let name = '';
  export let id = '';
  export let class_ = '';
  export let icon: string | null = null;
  export let iconPosition: 'left' | 'right' = 'left';
  
  const dispatch = createEventDispatcher();
  
  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    value = target.value;
    dispatch('input', { value });
  }
  
  function handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    value = target.value;
    dispatch('change', { value });
  }
  
  function handleFocus(event: FocusEvent) {
    dispatch('focus', event);
  }
  
  function handleBlur(event: FocusEvent) {
    dispatch('blur', event);
  }
  
  // Generate a unique ID if none is provided
  $: inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  
  // Determine input classes based on props
  $: inputClasses = `
    block w-full rounded-md shadow-sm min-h-[44px] px-3 py-2
    ${error ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'}
    ${disabled ? 'bg-gray-100 cursor-not-allowed dark:bg-gray-600' : 'bg-white dark:bg-gray-700'}
    ${icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''}
    ${class_}
  `;
</script>

<div class="w-full">
  {#if label}
    <label for={inputId} class="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {#if required}
        <span class="text-red-500 ml-1">*</span>
      {/if}
    </label>
  {/if}
  
  <div class="relative">
    {#if icon && iconPosition === 'left'}
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span class="text-gray-400 sm:text-sm">{icon}</span>
      </div>
    {/if}
    
    <input
      {type}
      {id}
      {name}
      {placeholder}
      {required}
      {disabled}
      autocomplete="off"
      bind:value
      class={inputClasses}
      on:input={handleInput}
      on:change={handleChange}
      on:focus={handleFocus}
      on:blur={handleBlur}
      aria-invalid={!!error}
      aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
    />
    
    {#if icon && iconPosition === 'right'}
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <span class="text-gray-400 sm:text-sm">{icon}</span>
      </div>
    {/if}
  </div>
  
  {#if error}
    <p id="{inputId}-error" class="mt-1 text-sm text-red-600">{error}</p>
  {:else if helperText}
    <p id="{inputId}-helper" class="mt-1 text-sm text-gray-500">{helperText}</p>
  {/if}
</div> 