<script lang="ts">
    import { Label } from './label';
    import Input from './Input.svelte';
    import { Eye, EyeOff } from 'lucide-svelte';
    import { Button } from './button';

    export let label: string;
    export let name: string;
    export let type = 'text';
    export let value: string;
    export let error: string[] | undefined;
    export let required = false;
    export let autocomplete: string | undefined;
    export let placeholder: string | undefined;
    export let showPasswordToggle = false;
    export let showPassword = false;

    $: inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;
</script>

<div class="space-y-2">
    <div class="flex items-center justify-between">
        <Label for={name} class="font-semibold text-gray-900">{label}</Label>
        {#if showPasswordToggle}
            <Button
                type="button"
                variant="ghost"
                size="sm"
                class="h-auto p-0 hover:bg-transparent"
                on:click={() => showPassword = !showPassword}
                aria-label={showPassword ? "Hide password" : "Show password"}
            >
                {#if showPassword}
                    <EyeOff class="h-4 w-4" />
                {:else}
                    <Eye class="h-4 w-4" />
                {/if}
            </Button>
        {/if}
    </div>
    <div class="relative">
        <Input
            id={name}
            name={name}
            type={inputType}
            bind:value
            {required}
            {autocomplete}
            {placeholder}
            aria-invalid={!!error?.length}
            aria-describedby={error?.length ? `${name}-error` : undefined}
            class="w-full bg-white border border-gray-200 rounded-lg h-12 text-base px-4 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition disabled:cursor-not-allowed disabled:opacity-50 {error?.length ? 'border-destructive focus:ring-destructive' : ''}"
        />
    </div>
    {#if error?.length}
        <p id={`${name}-error`} class="text-sm text-destructive">{error[0]}</p>
    {/if}
</div> 