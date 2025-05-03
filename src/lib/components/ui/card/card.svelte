<script lang="ts">
  import { cn } from "$lib/utils";

  let className: string | undefined | null = undefined;
  export { className as class };
</script>

<article class={cn("rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md", className)} {...$$restProps}>
  <slot />
</article>

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