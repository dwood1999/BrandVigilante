<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Security Policy | BrandVigilante</title>
	<meta name="description" content="Learn about BrandVigilante's security measures and how we protect your data." />
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-4xl">
	<h1 class="text-3xl font-bold mb-8">Security Policy</h1>
	
	<div class="prose dark:prose-invert max-w-none">
		<p class="text-gray-600 dark:text-gray-400 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

		<section class="mb-8">
			<h2 class="text-2xl font-semibold mb-4">Our Security Commitment</h2>
			<p>At BrandVigilante, we are committed to protecting your data and maintaining the security of our systems. We implement industry-standard security measures and continuously update our security practices to address emerging threats.</p>
		</section>

		<section class="mb-8">
			<h2 class="text-2xl font-semibold mb-4">Data Protection Measures</h2>
			<p>We employ multiple layers of security to protect your data:</p>
			<ul class="list-disc pl-6 mt-4">
				<li>Encryption of data in transit and at rest</li>
				<li>Regular security assessments and penetration testing</li>
				<li>Access controls and authentication mechanisms</li>
				<li>Network security and monitoring</li>
				<li>Physical security measures for our facilities</li>
				<li>Regular security training for employees</li>
			</ul>
		</section>

		<section class="mb-8">
			<h2 class="text-2xl font-semibold mb-4">Technical Security Measures</h2>
			<p>Our technical security measures include:</p>
			<ul class="list-disc pl-6 mt-4">
				<li>SSL/TLS encryption for all data transfers</li>
				<li>Multi-factor authentication for sensitive operations</li>
				<li>Regular software updates and security patches</li>
				<li>Intrusion detection and prevention systems</li>
				<li>Firewall protection</li>
				<li>DDoS protection</li>
				<li>Regular vulnerability scanning</li>
			</ul>
		</section>

		<section class="mb-8">
			<h2 class="text-2xl font-semibold mb-4">Data Breach Response</h2>
			<p>In the event of a data breach, we follow a comprehensive response plan:</p>
			<ul class="list-disc pl-6 mt-4">
				<li>Immediate investigation and containment</li>
				<li>Notification to affected users within 72 hours</li>
				<li>Coordination with relevant authorities</li>
				<li>Implementation of corrective measures</li>
				<li>Post-incident review and improvement</li>
			</ul>
		</section>

		<section class="mb-8">
			<h2 class="text-2xl font-semibold mb-4">Third-Party Security</h2>
			<p>We carefully select and monitor third-party service providers who handle your data. All third-party providers must:</p>
			<ul class="list-disc pl-6 mt-4">
				<li>Meet our security requirements</li>
				<li>Sign confidentiality agreements</li>
				<li>Undergo regular security assessments</li>
				<li>Comply with relevant data protection regulations</li>
			</ul>
		</section>

		<section class="mb-8">
			<h2 class="text-2xl font-semibold mb-4">Employee Security</h2>
			<p>Our employees are trained in security best practices and are required to:</p>
			<ul class="list-disc pl-6 mt-4">
				<li>Complete regular security training</li>
				<li>Follow security protocols and procedures</li>
				<li>Report security incidents immediately</li>
				<li>Use secure authentication methods</li>
				<li>Maintain confidentiality of sensitive information</li>
			</ul>
		</section>

		<section class="mb-8">
			<h2 class="text-2xl font-semibold mb-4">Security Certifications</h2>
			<p>We maintain the following security certifications and compliance standards:</p>
			<ul class="list-disc pl-6 mt-4">
				<li>ISO 27001 Information Security Management</li>
				<li>SOC 2 Type II</li>
				<li>GDPR Compliance</li>
				<li>CCPA Compliance</li>
			</ul>
		</section>

		<section class="mb-8">
			<h2 class="text-2xl font-semibold mb-4">Reporting Security Issues</h2>
			<p>If you discover a security vulnerability or have concerns about our security measures, please contact us:</p>
			<ul class="list-none pl-6 mt-4">
				<li>Email: security@brandvigilante.com</li>
				<li>Phone: (555) 123-4567</li>
				<li>For urgent security issues: security-emergency@brandvigilante.com</li>
			</ul>
		</section>
	</div>
</div> 