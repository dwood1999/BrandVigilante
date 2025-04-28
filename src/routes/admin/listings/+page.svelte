<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData;
</script>

<div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
            <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marketplace</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
            {#each data.listings as listing}
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">{listing.product_title}</div>
                        <div class="text-sm text-gray-500">
                            UPC: {listing.product_upc}<br>
                            EAN: {listing.product_ean}
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">{listing.marketplace_name}</div>
                        <div class="text-sm text-gray-500">{listing.marketplace_country}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        {#if listing.seller_id}
                            <div class="text-sm text-gray-900">
                                <a href={listing.seller_url} target="_blank" rel="noopener noreferrer" class="hover:text-blue-600">
                                    {listing.seller_name}
                                </a>
                            </div>
                            {#if listing.is_buybox_winner}
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Buy Box Winner
                                </span>
                            {/if}
                        {:else}
                            <div class="text-sm text-gray-500">No seller assigned</div>
                        {/if}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: listing.currency }).format(listing.price)}
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href="/admin/listings/{listing.id}" class="text-blue-600 hover:text-blue-900">View</a>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div> 