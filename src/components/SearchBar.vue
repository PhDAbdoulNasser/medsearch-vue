<template>
  <div class="relative" ref="searchContainer">
    <div class="flex flex-col sm:flex-row gap-2 sm:gap-0">
      <input 
        ref="searchInput"
        type="text" 
        v-model="searchQuery"
        :placeholder="placeholder"
        class="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-l-lg sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
        @input="handleInput"
        @keydown="handleKeydown"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <button 
        @click="handleSearch"
        class="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-l-none sm:rounded-r-lg hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium"
      >
        <span class="hidden sm:inline">Rechercher</span>
        <span class="sm:hidden">Recherche</span>
      </button>
    </div>

    <!-- Suggestions dropdown -->
    <div 
      v-if="showSuggestions && suggestions.length > 0"
      ref="suggestionsContainer"
      class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-64 sm:max-h-72 overflow-y-auto"
    >
      <div
        v-for="(suggestion, index) in suggestions"
        :key="suggestion.id"
        @click.stop="selectSuggestion(suggestion)"
        @mouseenter="selectedIndex = index"
        class="px-3 sm:px-4 py-2 sm:py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
        :class="{ 'bg-blue-50': index === selectedIndex }"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <p class="font-medium text-gray-900 text-sm sm:text-base truncate">{{ suggestion.title }}</p>
            <p class="text-xs sm:text-sm text-gray-500 truncate">{{ suggestion.subtitle }}</p>
          </div>
          <span 
            class="px-2 py-1 text-xs rounded-full ml-2 flex-shrink-0"
            :class="{
              'bg-blue-100 text-blue-800': suggestion.type === 'medicament',
              'bg-green-100 text-green-800': suggestion.type === 'substance',
              'bg-orange-100 text-orange-800': suggestion.type === 'laboratoire'
            }"
          >
            <span class="hidden sm:inline">{{ suggestion.type }}</span>
            <span class="sm:hidden">{{ suggestion.type.charAt(0).toUpperCase() }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useMedicamentsStore } from '@/stores/medicaments'

export default {
  name: 'SearchBar',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Rechercher...'
    }
  },
  emits: ['update:modelValue', 'search', 'select'],
  data() {
    return {
      searchQuery: this.modelValue,
      suggestions: [],
      showSuggestions: false,
      selectedIndex: -1,
      suggestionTimeout: null
    }
  },
  watch: {
    modelValue(newValue) {
      this.searchQuery = newValue
    },
    searchQuery(newValue) {
      this.$emit('update:modelValue', newValue)
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
    clearTimeout(this.suggestionTimeout)
  },
  methods: {
    handleInput() {
      clearTimeout(this.suggestionTimeout)
      
      if (this.searchQuery.length >= 2) {
        this.suggestionTimeout = setTimeout(async () => {
          await this.loadSuggestions()
        }, 300) // Debounce de 300ms
      } else {
        this.suggestions = []
        this.showSuggestions = false
      }
    },

    async loadSuggestions() {
      if (this.searchQuery.length < 2) return
      
      try {
        const medicamentsStore = useMedicamentsStore()
        this.suggestions = await medicamentsStore.getSuggestions(this.searchQuery)
        this.showSuggestions = this.suggestions.length > 0
        this.selectedIndex = -1
      } catch (error) {
        console.error('Erreur lors du chargement des suggestions:', error)
        this.suggestions = []
      }
    },

    handleKeydown(event) {
      if (!this.showSuggestions || this.suggestions.length === 0) {
        if (event.key === 'Enter') {
          this.handleSearch()
        }
        return
      }

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          this.selectedIndex = Math.min(this.selectedIndex + 1, this.suggestions.length - 1)
          break
        case 'ArrowUp':
          event.preventDefault()
          this.selectedIndex = Math.max(this.selectedIndex - 1, -1)
          break
        case 'Enter':
          event.preventDefault()
          if (this.selectedIndex >= 0) {
            this.selectSuggestion(this.suggestions[this.selectedIndex])
          } else {
            this.handleSearch()
          }
          break
        case 'Escape':
          this.hideSuggestions()
          break
      }
    },

    selectSuggestion(suggestion) {
      this.searchQuery = suggestion.title
      this.hideSuggestions()
      this.$emit('select', suggestion)
      
      // Auto-search après sélection
      setTimeout(() => {
        this.handleSearch()
      }, 100)
    },

    handleSearch() {
      if (this.searchQuery.trim()) {
        this.hideSuggestions()
        this.$emit('search', this.searchQuery.trim())
      }
    },

    handleFocus() {
      if (this.searchQuery.length >= 2 && this.suggestions.length > 0) {
        this.showSuggestions = true
      }
    },

    handleBlur() {
      // Ne pas cacher les suggestions immédiatement avec blur
      // Laissons handleClickOutside s'en charger
    },

    handleClickOutside(event) {
      if (this.$refs.searchContainer && !this.$refs.searchContainer.contains(event.target)) {
        this.hideSuggestions()
      }
    },

    hideSuggestions() {
      this.showSuggestions = false
      this.selectedIndex = -1
    }
  }
}
</script>