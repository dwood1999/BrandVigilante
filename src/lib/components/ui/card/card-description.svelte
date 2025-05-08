<script lang="ts">
  import { cn } from "$lib/utils";

  export let class_name = "";
</script>

<p class={cn("text-sm text-muted-foreground", class_name)}>
  <slot />
</p> 