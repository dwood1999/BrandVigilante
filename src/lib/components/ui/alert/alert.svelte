<script lang="ts">
    import { cn } from "$lib/utils";
    import { AlertCircle, AlertTriangle, Info, CheckCircle } from "lucide-svelte";

    export let variant: "default" | "destructive" = "default";
    export let class_name = "";

    const variants = {
        default: "bg-background text-foreground",
        destructive: "destructive border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
    };

    const icons = {
        default: Info,
        destructive: AlertCircle
    };

    $: Icon = icons[variant];
</script>

<div
    role="alert"
    class={cn(
        "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
        variants[variant],
        class_name
    )}
>
    <Icon class="h-4 w-4" />
    <slot />
</div> 