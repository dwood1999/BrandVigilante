<script lang="ts">
  import { cn } from "$lib/utils";
  import { buttonVariants, type ButtonVariants } from "./variants";
  import type { VariantProps } from "tailwind-variants";

  type $$Props = VariantProps<typeof buttonVariants> & {
    className?: string;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    loading?: boolean;
    ariaLabel?: string;
  };

  export let variant: $$Props["variant"] = "default";
  export let size: $$Props["size"] = "default";
  export let className: $$Props["className"] = "";
  export let disabled: $$Props["disabled"] = false;
  export let type: $$Props["type"] = "button";
  export let loading: $$Props["loading"] = false;
  export let ariaLabel: $$Props["ariaLabel"] = "";
</script>

<button
  class={cn(buttonVariants({ variant, size }), className)}
  disabled={disabled || loading}
  type={type}
  aria-label={ariaLabel}
  aria-busy={loading}
  {...$$restProps}
>
  {#if loading}
    <span class="inline-block animate-spin mr-2" aria-hidden="true">⟳</span>
  {/if}
  <slot />
</button>

<style>
  /* Focus styles */
  button:focus-visible {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 2px;
  }

  /* Loading animation */
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  /* Reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    .animate-spin {
      animation: none;
    }
  }
</style> 