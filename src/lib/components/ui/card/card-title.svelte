<script lang="ts">
  import { cn } from "$lib/utils";

  export let class_name = "";
</script>

<h3 class={cn("text-2xl font-semibold leading-none tracking-tight", class_name)}>
  <slot />
</h3> 