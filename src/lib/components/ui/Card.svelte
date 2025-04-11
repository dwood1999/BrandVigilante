<script lang="ts">
  export let title: string | undefined = undefined;
  export let subtitle: string | undefined = undefined;
  export let padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
  export let elevation: 'none' | 'sm' | 'md' | 'lg' = 'md';
  export let class_ = '';
  
  // Determine card classes based on props
  $: cardClasses = `
    rounded-lg overflow-hidden
    ${elevation === 'none' ? '' : ''}
    ${elevation === 'sm' ? 'shadow-sm' : ''}
    ${elevation === 'md' ? 'shadow-md' : ''}
    ${elevation === 'lg' ? 'shadow-lg' : ''}
    ${class_}
  `;
  
  // Determine content padding based on props
  $: contentPadding = `
    ${padding === 'none' ? 'p-0' : ''}
    ${padding === 'sm' ? 'p-3' : ''}
    ${padding === 'md' ? 'p-5' : ''}
    ${padding === 'lg' ? 'p-7' : ''}
  `;
  
  // Determine header padding based on props
  $: headerPadding = `
    ${padding === 'none' ? 'p-0' : ''}
    ${padding === 'sm' ? 'px-3 pt-3 pb-0' : ''}
    ${padding === 'md' ? 'px-5 pt-5 pb-0' : ''}
    ${padding === 'lg' ? 'px-7 pt-7 pb-0' : ''}
  `;
</script>

<div class={cardClasses}>
  {#if title || subtitle}
    <div class={`bg-white ${headerPadding}`}>
      {#if title}
        <h3 class="text-lg font-medium text-gray-900">{title}</h3>
      {/if}
      {#if subtitle}
        <p class="mt-1 text-sm text-gray-500">{subtitle}</p>
      {/if}
    </div>
  {/if}
  
  <div class={`bg-white ${contentPadding}`}>
    <slot />
  </div>
  
  <slot name="footer" />
</div> 