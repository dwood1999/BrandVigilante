<script lang="ts">
  import { cn } from "$lib/utils";

  export let class_name = "";
</script>

<div class={cn("rounded-lg border bg-card text-card-foreground shadow-sm", class_name)}>
  <slot />
</div>

<slot name="header" />
<slot name="content" />
<slot name="footer" /> 