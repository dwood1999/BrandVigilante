<script lang="ts">
    export let title: string;
    export let description: string | undefined = undefined;
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {title}
                </h1>
                {#if description}
                    <p class="text-gray-600 dark:text-gray-400 mb-6">
                        {description}
                    </p>
                {/if}
                <slot />
            </div>
        </div>
    </div>
</div> 