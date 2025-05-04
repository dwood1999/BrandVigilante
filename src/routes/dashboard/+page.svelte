<script lang="ts">
    import { fade } from 'svelte/transition';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import type { PageData } from './$types';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { Button } from '$lib/components/ui/button';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
    import { Badge } from '$lib/components/ui/badge';
    import { Plus, Search, AlertTriangle, CheckCircle, XCircle } from 'lucide-svelte';

    export let data: PageData;
    const { user, brands } = data;

    $: isAdmin = user?.role === 'admin';
    $: hasBrands = brands && brands.length > 0;

    let loading = true;

    onMount(() => {
        // Set loading to false after a short delay to ensure the component is fully mounted
        setTimeout(() => {
            loading = false;
        }, 100);
    });

    function formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function formatDateTime(dateString: string): string {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    }

    function formatPhoneNumber(phone: string): string {
        // Implement your formatting logic here
        return phone;
    }
</script>

<div class="container mx-auto px-4 py-8">
    <div class="flex flex-wrap justify-between items-center gap-4 sm:gap-0 mb-8">
        <div>
            <h1 class="text-3xl font-bold">Welcome, {user.first_name}!</h1>
            <p class="text-muted-foreground mt-1">Manage your brands and monitor their performance</p>
        </div>
        <div class="flex items-center gap-4">
            <Button variant="outline" on:click={() => goto('/profile')}>
                Profile Settings
            </Button>
            <Button variant="default" on:click={() => goto('/admin/brands/new')}>
                <Plus class="w-4 h-4 mr-2" />
                Add New Brand
            </Button>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Brand Actions Card -->
        <Card>
            <CardHeader>
                <CardTitle>Brand Actions</CardTitle>
                <CardDescription>Quick actions for your brands</CardDescription>
            </CardHeader>
            <CardContent>
                <div class="space-y-4">
                    {#if hasBrands}
                        {#each brands as brand}
                            <div class="p-4 border rounded-lg">
                                <div class="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 class="font-semibold">{brand.name}</h3>
                                        <p class="text-sm text-muted-foreground">{brand.display_name}</p>
                                    </div>
                                    <Badge variant={brand.status === 'active' ? 'success' : 'secondary'}>
                                        {brand.status}
                                    </Badge>
                                </div>
                                <div class="flex gap-2 mt-2">
                                    <Button variant="outline" size="sm" on:click={() => goto(`/admin/brands/${brand.id}/edit`)}>
                                        Edit
                                    </Button>
                                    <Button variant="outline" size="sm" on:click={() => goto(`/admin/brands/${brand.id}/terms`)}>
                                        Terms
                                    </Button>
                                    <Button variant="outline" size="sm" on:click={() => goto(`/admin/brands/${brand.id}/marketplaces`)}>
                                        Marketplaces
                                    </Button>
                                </div>
                            </div>
                        {/each}
                    {:else}
                        <div class="text-center py-4">
                            <p class="text-muted-foreground">No brands found</p>
                            <Button variant="link" class="mt-2" on:click={() => goto('/admin/brands/new')}>
                                Add your first brand
                            </Button>
                        </div>
                    {/if}
                </div>
            </CardContent>
        </Card>

        <!-- Account Status Card -->
        <Card>
            <CardHeader>
                <CardTitle>Account Status</CardTitle>
                <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent>
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <span class="text-muted-foreground">Email</span>
                        <span class="font-medium">{user.email}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-muted-foreground">Role</span>
                        <Badge variant={isAdmin ? 'default' : 'secondary'}>
                            {user.role}
                        </Badge>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-muted-foreground">Email Verified</span>
                        {#if user.email_verified}
                            <CheckCircle class="w-5 h-5 text-green-500" />
                        {:else}
                            <XCircle class="w-5 h-5 text-red-500" />
                        {/if}
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-muted-foreground">Member Since</span>
                        <span>{formatDate(user.created_at)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>

        <!-- Quick Stats Card -->
        <Card>
            <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
                <CardDescription>Overview of your brands</CardDescription>
            </CardHeader>
            <CardContent>
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <span class="text-muted-foreground">Total Brands</span>
                        <span class="font-medium">{brands.length}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-muted-foreground">Active Brands</span>
                        <span class="font-medium">
                            {brands.filter(b => b.status === 'active').length}
                        </span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-muted-foreground">Total Marketplaces</span>
                        <span class="font-medium">
                            {brands.reduce((acc, brand) => acc + brand.marketplaces.length, 0)}
                        </span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-muted-foreground">Total Terms</span>
                        <span class="font-medium">
                            {brands.reduce((acc, brand) => acc + brand.trademark_terms.length, 0)}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
</div> 