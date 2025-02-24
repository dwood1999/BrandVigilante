<script lang="ts">
    export let value = '';
    export let placeholder = 'Search...';
    export let class_ = ''; // Allow additional classes to be passed

    // Forward the class prop
    let className = `block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${class_}`;
</script>

<div class="relative">
    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <svg 
            class="h-5 w-5 text-gray-400" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor" 
            aria-hidden="true"
        >
            <path 
                fill-rule="evenodd" 
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" 
                clip-rule="evenodd" 
            />
        </svg>
    </div>
    <input
        type="text"
        bind:value
        {placeholder}
        class={className}
        style="padding-left: 2.5rem;"
    />
</div> 