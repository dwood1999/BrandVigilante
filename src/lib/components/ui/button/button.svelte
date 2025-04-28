<script lang="ts">
  import { cn } from "$lib/utils";
  import { Button as ButtonPrimitive } from "bits-ui";
  import type { Button as ButtonPrimitiveType } from "bits-ui";
  import type { VariantProps } from "tailwind-variants";
  import { buttonVariants } from "./variants";

  type $$Props = ButtonPrimitiveType.Props & VariantProps<typeof buttonVariants>;

  let className: string | undefined | null = undefined;
  export let variant: $$Props["variant"] = "default";
  export let size: $$Props["size"] = "default";
  export { className as class };
</script>

<ButtonPrimitive.Root
  class={cn(buttonVariants({ variant, size }), className)}
  {...$$restProps}
>
  <slot />
</ButtonPrimitive.Root> 