<script lang="ts">
	import { page } from '$app/stores';
</script>

<footer class="bg-gray-100 mt-auto">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
			<div class="col-span-1 sm:col-span-2">
				<h3 class="text-lg font-semibold mb-4">JanusIPM</h3>
				<p class="text-gray-600 text-sm sm:text-base">
					Protecting your intellectual property through advanced trademark monitoring and enforcement.
				</p>
			</div>
			<div>
				<h3 class="text-lg font-semibold mb-4">Quick Links</h3>
				<ul class="space-y-2">
					<li>
						<a href="/about" class="text-gray-600 hover:text-gray-900 text-sm sm:text-base">
							About Us
						</a>
					</li>
					<li>
						<a href="/contact" class="text-gray-600 hover:text-gray-900 text-sm sm:text-base">
							Contact
						</a>
					</li>
					<li>
						<a href="/pricing" class="text-gray-600 hover:text-gray-900 text-sm sm:text-base">
							Pricing
						</a>
					</li>
				</ul>
			</div>
			<div>
				<h3 class="text-lg font-semibold mb-4">Legal</h3>
				<ul class="space-y-2">
					<li>
						<a href="/privacy-policy" class="text-gray-600 hover:text-gray-900">
							Privacy Policy
						</a>
					</li>
					<li>
						<a href="/terms" class="text-gray-600 hover:text-gray-900">
							Terms of Service
						</a>
					</li>
					<li>
						<a href="/accessibility" class="text-gray-600 hover:text-gray-900">
							Accessibility
						</a>
					</li>
					<li>
						<a href="/california-privacy-rights" class="text-gray-600 hover:text-gray-900">
							California Privacy Rights
						</a>
					</li>
					<li>
						<a href="/security-policy" class="text-gray-600 hover:text-gray-900">
							Security Policy
						</a>
					</li>
				</ul>
			</div>
		</div>
		<div class="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
			<p>&copy; {new Date().getFullYear()} JanusIPM. All rights reserved.</p>
		</div>
	</div>
</footer> 