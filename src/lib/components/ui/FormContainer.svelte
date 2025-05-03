<script lang="ts">
    import { enhance } from '$app/forms';
    import { createEventDispatcher } from 'svelte';
    
    export let onSubmit: (event: SubmitEvent) => void;
    export let className = '';
    export let novalidate = false;
    
    const dispatch = createEventDispatcher();
    
    function handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        dispatch('submit', event);
        onSubmit(event);
    }
</script>

<form 
    on:submit={handleSubmit}
    class="space-y-6 {className}"
    {novalidate}
    method="POST"
    use:enhance={({ formData, cancel }) => {
        // You can modify formData here if needed
        return async ({ result, update }) => {
            // Call the onSubmit handler with the result
            if (onSubmit) {
                onSubmit({ type: result.type, data: result.data } as any);
            }
            
            // Update the form with the result
            await update();
        };
    }}
>
    <slot />
</form> 