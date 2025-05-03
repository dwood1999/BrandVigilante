<script lang="ts">
    import { fade } from 'svelte/transition';
    import { page } from '$app/stores';
    
    let email = $page.data.email || '';
</script>

<svelte:head>
    <title>Registration Successful - JanusIPM</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8" in:fade>
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="text-center">
            <svg class="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Registration Successful!
            </h2>
            <p class="mt-2 text-center text-sm text-gray-600">
                We've sent a verification email to {email}
            </p>
        </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div class="space-y-6">
                <div class="text-sm text-gray-600">
                    <p class="mb-4">To complete your registration, please check your email and click on the verification link we sent to:</p>
                    <p class="font-medium text-gray-900">{email}</p>
                </div>

                <div class="bg-blue-50 p-4 rounded-md">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                            </svg>
                        </div>
                        <div class="ml-3">
                            <h3 class="text-sm font-medium text-blue-800">Important</h3>
                            <div class="mt-2 text-sm text-blue-700">
                                <ul class="list-disc pl-5 space-y-1">
                                    <li>Check your spam folder if you don't see the email</li>
                                    <li>The verification link will expire in 24 hours</li>
                                    <li>You won't be able to log in until you verify your email</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="space-y-4">
                    <div class="text-sm text-center">
                        <p class="text-gray-600">Didn't receive the email?</p>
                        <a href="/resend-verification" class="font-medium text-indigo-600 hover:text-indigo-500">
                            Click here to resend verification email
                        </a>
                    </div>

                    <div class="pt-4 border-t border-gray-200">
                        <a 
                            href="/dashboard" 
                            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Go to Dashboard
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div> 