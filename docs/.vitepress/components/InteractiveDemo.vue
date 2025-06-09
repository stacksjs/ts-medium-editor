<script setup>
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  title: String,
  icon: String,
  badge: String,
  badgeClass: String,
  content: String,
  description: String,
  autoInit: {
    type: Boolean,
    default: true,
  },
})

const status = ref('Loading interactive demo...')
const statusClass = ref('loading')

const statusIcon = computed(() => {
  switch (statusClass.value) {
    case 'loading': return '⏳'
    case 'success': return '✅'
    case 'error': return '❌'
    default: return '⏳'
  }
})

onMounted(async () => {
  if (props.autoInit) {
    await initializeDemo()
  }
})

async function initializeDemo() {
  try {
    // Load FontAwesome
    await loadFontAwesome()

    // Load MediumEditor
    await loadMediumEditor()

    // Initialize editors
    await new Promise(resolve => setTimeout(resolve, 100))
    initializeEditors()

    status.value = 'Demo ready'
    statusClass.value = 'success'
  }
  catch (error) {
    console.error('Demo initialization failed:', error)
    status.value = 'Demo failed to load'
    statusClass.value = 'error'
  }
}

function loadFontAwesome() {
  return new Promise((resolve, reject) => {
    if (document.querySelector('link[href*="font-awesome"]')) {
      resolve()
      return
    }

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    link.onload = resolve
    link.onerror = () => {
      // Try alternative CDN
      const altLink = document.createElement('link')
      altLink.rel = 'stylesheet'
      altLink.href = 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css'
      altLink.onload = resolve
      altLink.onerror = reject
      document.head.appendChild(altLink)
    }
    document.head.appendChild(link)
  })
}

function loadMediumEditor() {
  return new Promise((resolve, reject) => {
    if (window.MediumEditor) {
      resolve()
      return
    }

    // Load CSS
    const css = document.createElement('link')
    css.rel = 'stylesheet'
    css.href = 'https://cdn.jsdelivr.net/npm/medium-editor@5.23.3/dist/css/medium-editor.min.css'
    document.head.appendChild(css)

    const themeCss = document.createElement('link')
    themeCss.rel = 'stylesheet'
    themeCss.href = 'https://cdn.jsdelivr.net/npm/medium-editor@5.23.3/dist/css/themes/default.min.css'
    document.head.appendChild(themeCss)

    // Load JS
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/medium-editor@5.23.3/dist/js/medium-editor.min.js'
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

function initializeEditors() {
  // Initialize all editable elements
  const editables = document.querySelectorAll('.demo-editable')
  editables.forEach((element) => {
    if (!element.mediumEditor) {
      const config = JSON.parse(element.dataset.config || '{}')
      element.mediumEditor = new window.MediumEditor(element, config)
    }
  })
}
</script>

<template>
  <div class="interactive-demo">
    <div class="demo-header">
      <div class="demo-title">
        <!-- eslint-disable-next-line vue/require-component-is, vue/no-v-text-v-html-on-component -->
        <component is="span" class="demo-icon" v-html="icon" />
        <h4>{{ title }}</h4>
        <span v-if="badge" class="demo-badge" :class="badgeClass">{{ badge }}</span>
      </div>
      <div class="demo-status" :class="statusClass">
        <span class="status-icon">{{ statusIcon }}</span>
        {{ status }}
      </div>
    </div>

    <div class="demo-content" v-html="content" />

    <div v-if="description" class="demo-footer">
      <small>{{ description }}</small>
    </div>
  </div>
</template>

<style scoped>
.interactive-demo {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  margin: 24px 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.demo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.demo-title {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.demo-title h4 {
  margin: 0;
  color: #1e293b;
  font-size: 1.1em;
  font-weight: 600;
}

.demo-icon {
  font-size: 1.2em;
}

.demo-badge {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75em;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.demo-badge.minimal {
  background: #dbeafe;
  color: #1e40af;
}

.demo-badge.none {
  background: #fee2e2;
  color: #dc2626;
}

.demo-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85em;
  font-weight: 500;
}

.demo-status.loading {
  background: #fef3c7;
  color: #92400e;
}

.demo-status.success {
  background: #d1fae5;
  color: #065f46;
}

.demo-status.error {
  background: #fee2e2;
  color: #dc2626;
}

.demo-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e5e7eb;
}

.demo-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
  color: #6b7280;
}

/* Dark mode support */
.dark .interactive-demo {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-color: #374151;
}

.dark .demo-title h4 {
  color: #f1f5f9;
}

.dark .demo-content {
  background: #1f2937;
  border-color: #374151;
  color: #f9fafb;
}

.dark .demo-footer {
  border-color: #374151;
  color: #9ca3af;
}

/* Responsive design */
@media (max-width: 768px) {
  .demo-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .interactive-demo {
    padding: 16px;
  }
}
</style>
