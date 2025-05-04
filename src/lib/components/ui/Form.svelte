<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { enhance } from '$app/forms';
    import { page } from '$app/stores';
    import Alert from './Alert.svelte';
    import { Button } from './button';
    import { Loader2 } from 'lucide-svelte';
    import { goto, invalidateAll } from '$app/navigation';

    export let formError: string | null = $page.form?.message || null;
    export let fieldErrors: Record<string, string[] | undefined> = $page.form?.fieldErrors || {};
    export let isLoading = false;
    export let submitLabel = 'Submit';
    export let showSuccessMessage = false;
    export let successMessage = 'Success!';
    export let className = '';
    export let successRedirect: string | undefined;
    export let buttonVariant: 'default' | 'outline' | 'secondary' | 'destructive' | 'link' | 'ghost' = 'default';

    const dispatch = createEventDispatcher();

    function handleInput(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input) {
            const fieldName = input.name;
            if (fieldErrors[fieldName]) {
                fieldErrors = { ...fieldErrors, [fieldName]: undefined };
            }
            if ($page.form?.message) {
                $page.form.message = undefined;
            }
        }
    }

    async function handleSubmitResult({ result }: { result: import('@sveltejs/kit').ActionResult<any, any> }) {
        isLoading = false;
        if (result.type === 'success') {
            dispatch('success', result);
            if (successRedirect) {
                await invalidateAll();
                goto(successRedirect);
            }
        }
    }
</script>

<form
    method="POST"
    use:enhance={() => {
        isLoading = true;
        return handleSubmitResult;
    }}
    class="space-y-6 {className}"
    on:input={handleInput}
>
    {#if formError}
        <Alert type="error" message={formError} dismissible on:dismiss={() => $page.form && ($page.form.message = undefined)} />
    {/if}

    {#if showSuccessMessage}
        <Alert type="success" message={successMessage} />
    {/if}

    <div class="space-y-4">
        <slot />
    </div>

    <Button 
        type="submit" 
        variant={buttonVariant}
        class="w-full"
        disabled={isLoading}
    >
        {#if isLoading}
            <Loader2 class="mr-2 h-4 w-4 animate-spin" />
            {submitLabel}...
        {:else}
            {submitLabel}
        {/if}
    </Button>
</form> 