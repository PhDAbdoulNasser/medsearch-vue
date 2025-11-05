import { defineStore } from 'pinia'

export const useMedicamentsStore = defineStore('medicaments', {
  state: () => ({
    medicaments: [],
    stats: null,
    isLoading: false,
    error: null
  }),

  actions: {
    // Vider le cache
    clearCache() {
      console.log('Vidage du cache des médicaments')
      this.medicaments = []
      this.stats = null
    },

    // Charger tous les médicaments
    async loadMedicaments() {
      if (this.medicaments.length > 0) {
        console.log('Médicaments déjà en cache, longueur:', this.medicaments.length)
        return this.medicaments
      }

      this.isLoading = true
      this.error = null

      try {
        console.log('Chargement des médicaments depuis API...')
        const response = await fetch(import.meta.env.BASE_URL + 'api/medicaments.json?t=' + Date.now()) // Cache busting
        if (!response.ok) throw new Error('Erreur lors du chargement')
        
        const data = await response.json()
        console.log('Données chargées:', data.length, 'médicaments')
        console.log('Premier médicament avec RCP:', data.find(m => m.sectionsRCP))
        this.medicaments = data || []
        return this.medicaments
      } catch (err) {
        this.error = 'Erreur lors du chargement des médicaments'
        console.error('Erreur:', err)
        return []
      } finally {
        this.isLoading = false
      }
    },

    // Charger les statistiques
    async loadStats() {
      if (this.stats) return this.stats

      try {
        const response = await fetch(import.meta.env.BASE_URL + 'api/stats.json')
        if (!response.ok) throw new Error('Erreur lors du chargement des stats')
        
        const data = await response.json()
        this.stats = data
        return data
      } catch (err) {
        console.error('Erreur lors du chargement des stats:', err)
        return null
      }
    },

    // Rechercher des médicaments
    async searchMedicaments(query = '', filters = {}) {
      await this.loadMedicaments()
      
      let results = [...this.medicaments]

      // Filtre par query (recherche textuelle)
      if (query && query.trim()) {
        const searchTerm = query.toLowerCase().trim()
        results = results.filter(med =>
          med.denomination.toLowerCase().includes(searchTerm) ||
          med.substance.toLowerCase().includes(searchTerm) ||
          med.titulaires.toLowerCase().includes(searchTerm) ||
          med.formePharma.toLowerCase().includes(searchTerm)
        )
      }

      // Filtre par laboratoire
      if (filters.laboratoire) {
        results = results.filter(med => 
          med.titulaires.toLowerCase().includes(filters.laboratoire.toLowerCase())
        )
      }

      // Filtre par forme pharmaceutique
      if (filters.formePharma) {
        results = results.filter(med => med.formePharma === filters.formePharma)
      }

      // Filtre par substance
      if (filters.substance) {
        results = results.filter(med => 
          med.substance.toLowerCase().includes(filters.substance.toLowerCase())
        )
      }

      // Filtre par état commercial
      if (filters.etatCommercial) {
        results = results.filter(med => med.etatCommercial === filters.etatCommercial)
      }

      return results
    },

    // Obtenir un médicament par ID
    async getMedicamentById(id) {
      await this.loadMedicaments()
      const medicament = this.medicaments.find(med => med.id === parseInt(id))
      console.log('getMedicamentById - ID:', id)
      console.log('getMedicamentById - Found:', medicament)
      if (medicament) {
        console.log('getMedicamentById - Has RCP:', !!medicament.sectionsRCP)
        console.log('getMedicamentById - Has Notice:', !!medicament.sectionsNotice)
      }
      return medicament
    },

    // Obtenir des suggestions pour l'autocomplétion
    async getSuggestions(query) {
      if (!query || query.length < 2) return []

      await this.loadMedicaments()
      const queryLower = query.toLowerCase()
      const suggestions = []

      // Suggestions de médicaments
      this.medicaments
        .filter(med => med.denomination.toLowerCase().includes(queryLower))
        .slice(0, 5)
        .forEach(med => {
          suggestions.push({
            id: med.id.toString(),
            title: med.denomination,
            subtitle: `${med.formePharma} - ${med.titulaires}`,
            type: 'medicament'
          })
        })

      // Suggestions de substances
      const substances = [...new Set(this.medicaments.map(med => med.substance))]
        .filter(substance => substance.toLowerCase().includes(queryLower))
        .slice(0, 3)

      substances.forEach(substance => {
        suggestions.push({
          id: substance,
          title: substance,
          subtitle: 'Substance active',
          type: 'substance'
        })
      })

      // Suggestions de laboratoires
      const laboratoires = [...new Set(this.medicaments.map(med => med.titulaires))]
        .filter(lab => lab.toLowerCase().includes(queryLower))
        .slice(0, 3)

      laboratoires.forEach(lab => {
        const count = this.medicaments.filter(med => med.titulaires === lab).length
        suggestions.push({
          id: lab,
          title: lab,
          subtitle: `${count} médicament${count > 1 ? 's' : ''}`,
          type: 'laboratoire'
        })
      })

      return suggestions.slice(0, 10)
    }
  },

  getters: {
    // Obtenir toutes les formes pharmaceutiques uniques
    formesPharma: (state) => {
      return [...new Set(state.medicaments.map(med => med.formePharma))].sort()
    },

    // Obtenir tous les laboratoires uniques
    laboratoires: (state) => {
      return [...new Set(state.medicaments.map(med => med.titulaires))].sort()
    },

    // Obtenir toutes les substances uniques
    substances: (state) => {
      return [...new Set(state.medicaments.map(med => med.substance))].sort()
    }
  }
})