<script lang="ts">
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
    role="form"
>
    <slot />
</form> 