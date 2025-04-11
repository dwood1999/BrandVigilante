<script lang="ts">
    import type { FormFieldProps } from '$lib/types/components';
    import { createEventDispatcher } from 'svelte';
    
    export let label: FormFieldProps['label'];
    export let name: FormFieldProps['name'];
    export let type: FormFieldProps['type'] | 'textarea' = 'text';
    export let required = false;
    export let placeholder = '';
    export let error = '';
    export let value = '';
    export let disabled = false;
    export let className = '';
    export let helperText = '';
    export let icon: string | null = null;
    export let iconPosition: 'left' | 'right' = 'left';
    export let autocomplete: 'on' | 'off' | 'name' | 'email' | 'username' | 'current-password' | 'new-password' | 'one-time-code' | 'organization-title' | 'organization' | 'street-address' | 'country' | 'country-name' | 'postal-code' | 'cc-name' | 'cc-number' | 'cc-exp' | 'cc-exp-month' | 'cc-exp-year' | 'cc-csc' | 'cc-type' | 'transaction-currency' | 'transaction-amount' | 'language' | 'bday' | 'bday-day' | 'bday-month' | 'bday-year' | 'sex' | 'tel' | 'tel-country-code' | 'tel-area-code' | 'tel-local' | 'tel-local-prefix' | 'tel-local-suffix' | 'tel-extension' | 'url' | 'photo' | null = null;
    export let id = '';
    export let validateOnBlur = true;
    export let validateOnInput = false;
    export let success = '';
    
    const dispatch = createEventDispatcher();
    
    // Generate a unique ID if none is provided
    $: fieldId = id || `field-${name}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Track focus state for floating label effect
    let isFocused = false;
    
    // Determine if the field should show as "filled" (has value or is focused)
    $: isFilled = value !== '' || isFocused;
    
    // Enhanced input classes with modern styling
    const inputClasses = `
        block w-full rounded-md shadow-sm transition-all duration-200
        ${error ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}
        ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
        ${icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''}
        ${className}
    `;
    
    // Handle focus events
    function handleFocus() {
        isFocused = true;
        dispatch('focus');
    }
    
    function handleBlur() {
        isFocused = false;
        if (validateOnBlur) {
            dispatch('validate', { value });
        }
        dispatch('blur');
    }
    
    // Handle input events for real-time validation
    function handleInput(event: Event) {
        const target = event.target as HTMLInputElement;
        value = target.value;
        
        if (validateOnInput) {
            dispatch('validate', { value });
        }
        
        dispatch('input', { value });
    }
</script>

<div class="form-field">
  {#if label}
    <label for={fieldId} class="form-label">
      {label}
      {#if required}
        <span class="required">*</span>
      {/if}
    </label>
  {/if}
  <div class="input-wrapper">
    {#if type === 'textarea'}
      <textarea
        id={fieldId}
        {name}
        {placeholder}
        {required}
        {disabled}
        {autocomplete}
        class:error={!!error}
        class:success={!!success}
        class:disabled
        bind:value
        on:input={handleInput}
        on:change
        on:blur={handleBlur}
        on:focus={handleFocus}
        {...$$restProps}
      ></textarea>
    {:else}
      <input
        id={fieldId}
        {name}
        {type}
        {placeholder}
        {required}
        {disabled}
        {autocomplete}
        class:error={!!error}
        class:success={!!success}
        class:disabled
        bind:value
        on:input={handleInput}
        on:change
        on:blur={handleBlur}
        on:focus={handleFocus}
        {...$$restProps}
      />
    {/if}
  </div>
  {#if helperText}
    <p class="helper-text" class:error={!!error} class:success={!!success}>
      {helperText}
    </p>
  {/if}
  {#if error}
    <p class="error-message">{error}</p>
  {/if}
  {#if success}
    <p class="success-message">{success}</p>
  {/if}
</div>

<style>
  .form-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }

  .form-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
  }

  .required {
    color: var(--error);
    margin-left: 0.25rem;
  }

  .input-wrapper {
    position: relative;
    width: 100%;
  }

  input,
  textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    line-height: 1.5;
    color: var(--text-primary);
    background-color: #e0e0e0;
    border: 1px solid #000000;
    border-radius: 1rem;
    transition: all 0.2s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  input:hover,
  textarea:hover {
    border-color: var(--primary);
    background-color: #d5d5d5;
  }

  input:focus,
  textarea:focus {
    outline: none;
    border-color: var(--primary);
    background-color: #ffffff;
    box-shadow: 0 0 0 3px var(--primary-light);
  }

  input.error,
  textarea.error {
    border-color: var(--error);
    background-color: var(--error-light);
  }

  input.error:focus,
  textarea.error:focus {
    box-shadow: 0 0 0 3px var(--error-light);
    background-color: #ffffff;
  }

  input.success,
  textarea.success {
    border-color: var(--success);
    background-color: var(--success-light);
  }

  input.success:focus,
  textarea.success:focus {
    box-shadow: 0 0 0 3px var(--success-light);
    background-color: #ffffff;
  }

  input.disabled,
  textarea.disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    opacity: 0.7;
    border-color: #666666;
  }

  .helper-text {
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin-top: 0.25rem;
    padding-left: 0.5rem;
  }

  .helper-text.error {
    color: var(--error);
  }

  .helper-text.success {
    color: var(--success);
  }

  .error-message {
    font-size: 0.75rem;
    color: var(--error);
    margin-top: 0.25rem;
    padding-left: 0.5rem;
  }

  .success-message {
    font-size: 0.75rem;
    color: var(--success);
    margin-top: 0.25rem;
    padding-left: 0.5rem;
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }

  /* Add subtle hover effect to the entire field */
  .form-field:hover .input-wrapper {
    transform: translateY(-1px);
  }

  .input-wrapper {
    transition: transform 0.2s ease;
  }
</style> 