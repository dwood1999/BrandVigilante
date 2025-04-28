<script lang="ts">
  import { cn } from "$lib/utils";
  import { badgeVariants, type BadgeVariants } from "./variants";
  import type { VariantProps } from "tailwind-variants";

  type $$Props = VariantProps<typeof badgeVariants>;

  let className: string | undefined | null = undefined;
  export let variant: $$Props["variant"] = "default";
  export { className as class };
</script>

<div class={cn(badgeVariants({ variant }), className)} {...$$restProps}>
  <slot />
</div> 