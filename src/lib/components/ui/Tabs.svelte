<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let tabs: { id: string; label: string; disabled?: boolean }[] = [];
  export let activeTab = tabs[0]?.id;
  export let class_ = '';
  
  const dispatch = createEventDispatcher<{
    change: { tabId: string };
  }>();
  
  function handleTabClick(tabId: string) {
    if (activeTab !== tabId) {
      activeTab = tabId;
      dispatch('change', { tabId });
    }
  }
  
  $: tabClasses = `
    flex space-x-1 rounded-lg bg-gray-100 p-1 overflow-x-auto
    ${class_}
  `;
  
  $: tabButtonClasses = (tabId: string) => `
    w-full rounded-md py-3 px-3 text-sm font-medium leading-5 min-h-[44px] whitespace-nowrap
    flex-shrink-0
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-100
    ${activeTab === tabId
      ? 'bg-white text-blue-700 shadow'
      : 'text-gray-700 hover:bg-white/[0.6]'}
    ${tabs.find(t => t.id === tabId)?.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
  `;
</script>

<div class={tabClasses} role="tablist">
  {#each tabs as tab}
    <button
      class={tabButtonClasses(tab.id)}
      role="tab"
      aria-selected={activeTab === tab.id}
      aria-controls={`panel-${tab.id}`}
      disabled={tab.disabled}
      on:click={() => handleTabClick(tab.id)}
    >
      {tab.label}
    </button>
  {/each}
</div>

<div class="mt-4">
  <slot {activeTab} />
</div> 