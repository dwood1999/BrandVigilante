<script lang="ts">
    import type { Brand } from '$lib/types';

    export let brand: Brand;
</script>

<div class="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
    <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
            <a 
                href="/admin/brands/{brand.id}" 
                class="hover:text-blue-600"
            >
                {brand.name}
            </a>
        </h3>
        <p class="mt-1 text-sm text-gray-500">
            <a 
                href={brand.url} 
                target="_blank" 
                rel="noopener noreferrer"
                class="hover:text-blue-600"
            >
                {brand.url}
            </a>
        </p>
    </div>
    <div class="px-4 py-4 sm:px-6">
        <div class="flex justify-between items-center">
            <div class="flex flex-col space-y-2">
                <span class="text-xs text-gray-500">
                    {brand.trademarked_terms?.length || 0} terms
                </span>
                <span class="text-xs text-gray-500">
                    {brand.users?.length || 0} users
                </span>
            </div>
            <div class="flex space-x-2">
                <a
                    href="/admin/brands/{brand.id}/edit"
                    class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Edit
                </a>
                <form
                    action="?/deleteBrand"
                    method="POST"
                    use:enhance={() => {
                        const confirmed = confirm('Are you sure you want to delete this brand?');
                        return confirmed;
                    }}
                >
                    <input type="hidden" name="brandId" value={brand.id}>
                    <button
                        type="submit"
                        class="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Delete
                    </button>
                </form>
            </div>
        </div>
    </div>
</div> 