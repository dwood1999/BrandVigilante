<script lang="ts">
  export let id: string;
  export let activeTab: string;
</script>

<div
  role="tabpanel"
  id="panel-{id}"
  aria-labelledby="tab-{id}"
  class:hidden={activeTab !== id}
>
  <slot />
</div>

<style>
  .hidden {
    display: none;
  }
</style> 