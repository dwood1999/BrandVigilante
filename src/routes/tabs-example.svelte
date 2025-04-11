<script lang="ts">
  import Tabs from '$lib/components/ui/Tabs.svelte';
  import TabPanel from '$lib/components/ui/TabPanel.svelte';

  const tabs = [
    { id: 'tab1', label: 'First Tab' },
    { id: 'tab2', label: 'Second Tab' },
    { id: 'tab3', label: 'Third Tab', disabled: true }
  ];

  let activeTab = 'tab1';

  function handleTabChange(event: CustomEvent<string>) {
    activeTab = event.detail;
  }
</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">Tabs Example</h1>
  
  <Tabs {tabs} {activeTab} on:tabChange={handleTabChange}>
    <TabPanel id="tab1" {activeTab}>
      <div class="p-4 bg-gray-100 rounded">
        <h2 class="text-xl font-semibold mb-2">First Tab Content</h2>
        <p>This is the content for the first tab.</p>
        <p class="mt-2">For more information about our services, please review our <a href="https://dwood.janusipm.com/admin/terms" class="text-blue-600 hover:underline">terms and conditions</a>.</p>
      </div>
    </TabPanel>

    <TabPanel id="tab2" {activeTab}>
      <div class="p-4 bg-gray-100 rounded">
        <h2 class="text-xl font-semibold mb-2">Second Tab Content</h2>
        <p>This is the content for the second tab.</p>
        <p class="mt-2">Our <a href="https://dwood.janusipm.com/admin/terms" class="text-blue-600 hover:underline">terms of service</a> outline the rules and guidelines for using our platform.</p>
      </div>
    </TabPanel>

    <TabPanel id="tab3" {activeTab}>
      <div class="p-4 bg-gray-100 rounded">
        <h2 class="text-xl font-semibold mb-2">Third Tab Content</h2>
        <p>This tab is disabled and cannot be accessed.</p>
        <p class="mt-2">If you have any questions about our <a href="https://dwood.janusipm.com/admin/terms" class="text-blue-600 hover:underline">terms and conditions</a>, please contact our support team.</p>
      </div>
    </TabPanel>
  </Tabs>
</div> 