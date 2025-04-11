<script lang="ts">
    import type { LoadingSpinnerProps } from '$lib/types/components';
    
    export let size: LoadingSpinnerProps['size'] = 'md';
    export let color = 'currentColor';
    export let className = '';
    
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    } as const;
</script>

<div
    class="inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] {sizeClasses[size]} {className}"
    style="color: {color};"
    role="status"
>
    <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
    </span>
</div> 