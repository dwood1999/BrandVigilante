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

<style>
  /* Focus styles */
  article:focus-visible {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 2px;
  }

  /* Reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    article {
      transition: none;
    }
  }
</style> 