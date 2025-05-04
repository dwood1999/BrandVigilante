<script lang="ts">
    import logo_blue from '$lib/images/logo_blue.png';
    import { Radar } from 'lucide-svelte';
    
    const { 
        size = 'lg',
        showText = true,
        linkToHome = true 
    } = $props<{
        size?: 'sm' | 'md' | 'lg';
        showText?: boolean;
        linkToHome?: boolean;
    }>();
    
    const sizes = {
        sm: { img: 20, text: 'text-sm' },
        md: { img: 28, text: 'text-lg' },
        lg: { img: 36, text: 'text-xl' }
    } as const;
    
    const currentSize = $derived(sizes[size as keyof typeof sizes]);
</script>

<div 
    class="flex items-center" 
    role="banner"
    aria-label="Janus IPM Logo"
>
    {#if linkToHome}
        <a href="/" class="flex items-center hover:opacity-90 transition-opacity">
            <Radar class="w-6 h-6 text-lime-600" />
            <!-- <img 
                src={logo_blue} 
                alt="Janus IPM Company Logo" 
                width={currentSize.img} 
                height={currentSize.img}
                loading="lazy"
            /> -->
            {#if showText}
                <h1 class="ml-2 text-zinc-600 font-logo_display leading-7 tracking-widest {currentSize.text}">JANUS|IPM</h1>
            {/if}
        </a>
        <div class="pl-8 text-sm text-zinc-500">v1.2</div>
    {:else}
        <div class="flex items-center">
            <img 
                src={logo_blue} 
                alt="Janus IPM Company Logo" 
                width={currentSize.img} 
                height={currentSize.img}
                loading="lazy"
            />
            {#if showText}
                <h1 class="ml-2 font-logo_display text-zinc-500 leading-7 tracking-widest {currentSize.text}">JANUS|IPM</h1>
            {/if}
        </div>
    {/if}
</div>
<!-- <div class="text-xs ml-2 mt-1">
    Intellectual Property Management
</div> -->

