<script lang="ts">
  import { cn } from "$lib/utils";

  export let class_name = "";
</script>

<div class={cn("flex flex-col space-y-1.5 p-6", class_name)} {...$$restProps}>
  <slot />
</div> 