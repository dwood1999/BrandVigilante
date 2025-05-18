<script lang="ts">
	import { page } from '$app/stores';
</script>

<footer class="bg-gray-100 dark:bg-gray-800 mt-auto">
	<div class="container mx-auto px-4 py-8">
		<div class="grid grid-cols-1 md:grid-cols-4 gap-8">
			<div class="col-span-1 md:col-span-2">
				<h3 class="text-lg font-semibold mb-4">BrandVigilante</h3>
				<p class="text-gray-600 dark:text-gray-400">
					Protecting your brand's integrity through advanced trademark monitoring and enforcement.
				</p>
			</div>
			<div>
				<h3 class="text-lg font-semibold mb-4">Quick Links</h3>
				<ul class="space-y-2">
					<li>
						<a href="/about" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
							About Us
						</a>
					</li>
					<li>
						<a href="/contact" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
							Contact
						</a>
					</li>
					<li>
						<a href="/pricing" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
							Pricing
						</a>
					</li>
				</ul>
			</div>
			<div>
				<h3 class="text-lg font-semibold mb-4">Legal</h3>
				<ul class="space-y-2">
					<li>
						<a href="/privacy-policy" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
							Privacy Policy
						</a>
					</li>
					<li>
						<a href="/terms" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
							Terms of Service
						</a>
					</li>
					<li>
						<a href="/accessibility" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
							Accessibility
						</a>
					</li>
					<li>
						<a href="/california-privacy-rights" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
							California Privacy Rights
						</a>
					</li>
					<li>
						<a href="/security-policy" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
							Security Policy
						</a>
					</li>
				</ul>
			</div>
		</div>
		<div class="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-gray-600 dark:text-gray-400">
			<p>&copy; {new Date().getFullYear()} BrandVigilante. All rights reserved.</p>
		</div>
	</div>
</footer> 