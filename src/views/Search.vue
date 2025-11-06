<template>
  <div class="py-4 sm:py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Recherche de médicaments</h1>
      
      <!-- Barre de recherche -->
      <div class="mb-6 sm:mb-8">
        <div class="max-w-2xl">
          <SearchBar
            v-model="searchQuery"
            placeholder="Rechercher un médicament, substance ou laboratoire..."
            @search="search"
            @select="handleSuggestionSelect"
          />
        </div>
      </div>

      <!-- État de chargement -->
      <div v-if="isLoading" class="text-center py-12">
        <p class="text-gray-500">Recherche en cours...</p>
      </div>

      <!-- Résultats -->
      <div v-else-if="results.length > 0" class="space-y-3 sm:space-y-4">
        <p class="text-gray-600 mb-4 text-sm sm:text-base">{{ results.length }} résultat(s) trouvé(s)</p>
        <div 
          v-for="medicament in results" 
          :key="medicament.id"
          @click="goToMedicament(medicament.id)"
          class="card p-4 sm:p-6 hover:shadow-xl transition-shadow cursor-pointer"
        >
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 flex-1 leading-tight">
              {{ medicament.denomination }}
            </h3>
            <span 
              class="px-2 py-1 text-xs rounded-full self-start sm:self-auto"
              :class="medicament.etatCommercial === 'Commercialisée' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
            >
              {{ medicament.etatCommercial }}
            </span>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
            <div>
              <p><span class="font-medium">Laboratoire:</span> {{ medicament.titulaires }}</p>
              <p><span class="font-medium">Forme:</span> {{ medicament.formePharma }}</p>
            </div>
            <div>
              <p><span class="font-medium">Substance:</span> {{ medicament.substance }}</p>
              <p><span class="font-medium">Dosage:</span> {{ medicament.dosage }}</p>
            </div>
          </div>
          
          <div class="mt-3 flex justify-between items-center">
            <p class="text-xs text-gray-500">Code CIS: {{ medicament.codeCIS }} | AMM: {{ medicament.dateAMM }}</p>
            <span class="text-xs text-blue-600 font-medium">Cliquer pour voir les détails →</span>
          </div>
        </div>
      </div>

      <div v-else-if="searched" class="text-center py-12">
        <p class="text-gray-500">Aucun résultat trouvé pour "{{ searchQuery }}".</p>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-gray-500">Saisissez un terme de recherche pour commencer.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useMedicamentsStore } from '@/stores/medicaments'
import SearchBar from '@/components/SearchBar.vue'

export default {
  name: 'Search',
  components: {
    SearchBar
  },
  data() {
    return {
      searchQuery: this.$route.query.q || '',
      results: [],
      searched: false,
      isLoading: false
    }
  },
  mounted() {
    if (this.searchQuery) {
      this.search(this.searchQuery)
    }
  },
  watch: {
    '$route.query.q'(newQuery) {
      this.searchQuery = newQuery || ''
      if (this.searchQuery) {
        this.search(this.searchQuery)
      }
    }
  },
  methods: {
    async search(query = this.searchQuery) {
      if (!query || !query.trim()) return
      
      this.searched = true
      this.isLoading = true
      
      try {
        const medicamentsStore = useMedicamentsStore()
        this.results = await medicamentsStore.searchMedicaments(query)
      } catch (error) {
        console.error('Erreur lors de la recherche:', error)
        this.results = []
      } finally {
        this.isLoading = false
      }
    },
    handleSuggestionSelect(suggestion) {
      if (suggestion.type === 'medicament') {
        // Aller directement aux détails du médicament
        this.goToMedicament(suggestion.id)
      } else {
        // Rechercher pour les autres types
        this.search(suggestion.title)
      }
    },
    goToMedicament(medicamentId) {
      this.$router.push({
        name: 'MedicamentDetail',
        params: { id: medicamentId }
      })
    }
  }
}
</script>