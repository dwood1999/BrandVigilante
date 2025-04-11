# Form Component Migration Guide

This guide will help you update your existing forms to use the new form components for a consistent, accessible, and modern user experience.

## Components Overview

1. **FormContainer** - Wraps the entire form and handles form submission
2. **FormGroup** - Groups related form fields with a legend
3. **FormField** - Individual form input with label, error handling, and accessibility features

## Migration Steps

### 1. Import the Components

Add these imports to your form page:

```svelte
import FormField from '$lib/components/ui/FormField.svelte';
import FormContainer from '$lib/components/ui/FormContainer.svelte';
import FormGroup from '$lib/components/ui/FormGroup.svelte';
```

### 2. Replace the Form Element

Replace your existing `<form>` element with `<FormContainer>`:

```svelte
<!-- Before -->
<form 
    method="POST" 
    class="space-y-6" 
    use:enhance={handleSubmit}
>
    <!-- Form content -->
</form>

<!-- After -->
<FormContainer 
    onSubmit={handleSubmit}
    className="space-y-6"
    novalidate
>
    <!-- Form content -->
</FormContainer>
```

### 3. Group Related Fields

Use `<FormGroup>` to group related fields:

```svelte
<FormGroup legend="Personal Information">
    <!-- Related form fields -->
</FormGroup>
```

### 4. Replace Input Fields

Replace your existing input fields with `<FormField>`:

```svelte
<!-- Before -->
<div>
    <label for="email" class="block text-sm font-medium text-gray-700">
        Email address
    </label>
    <div class="mt-1">
        <input
            id="email"
            name="email"
            type="email"
            required
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            aria-required="true"
            aria-invalid={form?.fieldErrors?.email ? 'true' : 'false'}
            aria-describedby={form?.fieldErrors?.email ? 'email-error' : undefined}
            value={form?.data?.email ?? ''}
        />
    </div>
    {#if form?.fieldErrors?.email}
        <p 
            id="email-error" 
            class="mt-2 text-sm text-red-600"
            role="alert"
        >
            {form.fieldErrors.email}
        </p>
    {/if}
</div>

<!-- After -->
<FormField
    label="Email address"
    name="email"
    type="email"
    bind:value={email}
    required
    error={form?.fieldErrors?.email}
    autocomplete="email"
/>
```

### 5. Add State Variables

Add state variables for each form field:

```svelte
let email = form?.data?.email ?? '';
let password = '';
// Add more variables as needed
```

### 6. Update Submit Button

Enhance your submit button with loading state:

```svelte
<button
    type="submit"
    disabled={loading}
    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
>
    {#if loading}
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Submitting...
    {:else}
        Submit
    {/if}
</button>
```

## Special Cases

### Password Fields with Show/Hide Toggle

For password fields with a show/hide toggle:

```svelte
<div class="relative">
    <FormField
        label="Password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        bind:value={password}
        required
        error={form?.fieldErrors?.password}
        autocomplete="current-password"
    />
    
    <button
        type="button"
        class="absolute top-8 right-0 pr-3 flex items-center"
        on:click={togglePassword}
    >
        <span class="text-sm text-gray-500">
            {showPassword ? 'Hide' : 'Show'}
        </span>
    </button>
</div>
```

### Checkbox Fields

For checkbox fields:

```svelte
<label class="flex items-start">
    <div class="flex items-center h-5">
        <input
            type="checkbox"
            name="agreeToTerms"
            bind:checked={formData.agreeToTerms}
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            aria-invalid={errors.agreeToTerms ? 'true' : 'false'}
        />
    </div>
    <div class="ml-3 text-sm">
        <span class="text-gray-700">I agree to the <a href="#" class="text-blue-600 hover:text-blue-500">Terms and Conditions</a></span>
        {#if errors.agreeToTerms}
            <p class="mt-1 text-red-600" role="alert">{errors.agreeToTerms}</p>
        {/if}
    </div>
</label>
```

## Benefits of the New Components

- **Improved Accessibility**: Proper ARIA attributes and semantic HTML
- **Consistent Styling**: Uniform appearance across all forms
- **Enhanced User Experience**: Better focus states, error handling, and loading indicators
- **Reduced Code Duplication**: Reusable components for common form patterns
- **Type Safety**: TypeScript interfaces for form props

## Example: Complete Form Migration

See the updated sign-in and sign-up forms for complete examples of how to migrate your forms. 