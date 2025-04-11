<script lang="ts">
    export let legend: string;
    export let description: string | null = null;
    export let error: string | null = null;
    export let className = '';
</script>

<fieldset class="form-group {className}">
    <legend class="text-base font-medium text-gray-900">{legend}</legend>
    
    {#if description}
        <p class="mt-1 text-sm text-gray-500">{description}</p>
    {/if}
    
    {#if error}
        <p class="mt-1 text-sm text-red-600" role="alert">{error}</p>
    {/if}
    
    <div class="mt-4 space-y-4">
        <slot />
    </div>
</fieldset> 