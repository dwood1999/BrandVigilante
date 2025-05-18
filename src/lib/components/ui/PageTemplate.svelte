<script lang="ts">
    export let title: string;
    export let description: string | undefined = undefined;
</script>

<div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
                    {title}
                </h1>
                {#if description}
                    <p class="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                        {description}
                    </p>
                {/if}
                <slot />
            </div>
        </div>
    </div>
</div> 