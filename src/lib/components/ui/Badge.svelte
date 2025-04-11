<script lang="ts">
  export let type: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' = 'default';
  export let size: 'xs' | 'sm' | 'md' | 'lg' = 'md';
  export let rounded = true;
  export let class_ = '';
  
  // Determine badge classes based on props
  $: badgeClasses = `
    inline-flex items-center font-medium
    ${rounded ? 'rounded-full' : 'rounded'}
    
    ${type === 'default' ? 'bg-gray-100 text-gray-800' : ''}
    ${type === 'primary' ? 'bg-blue-100 text-blue-800' : ''}
    ${type === 'success' ? 'bg-green-100 text-green-800' : ''}
    ${type === 'warning' ? 'bg-yellow-100 text-yellow-800' : ''}
    ${type === 'error' ? 'bg-red-100 text-red-800' : ''}
    ${type === 'info' ? 'bg-indigo-100 text-indigo-800' : ''}
    
    ${size === 'xs' ? 'px-2 py-0.5 text-xs' : ''}
    ${size === 'sm' ? 'px-2.5 py-0.5 text-xs' : ''}
    ${size === 'md' ? 'px-3 py-1 text-sm' : ''}
    ${size === 'lg' ? 'px-4 py-1.5 text-base' : ''}
    
    ${class_}
  `;
</script>

<span class={badgeClasses}>
  <slot />
</span> 