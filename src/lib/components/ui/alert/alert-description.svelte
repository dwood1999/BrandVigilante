<script lang="ts">
    import { cn } from "$lib/utils";

    export let class_name = "";
</script>

<div class={cn("text-sm [&_p]:leading-relaxed", class_name)}>
    <slot />
</div> 