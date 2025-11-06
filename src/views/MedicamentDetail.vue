<template>
  <div class="py-8 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading state -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-500">Chargement des détails du médicament...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center py-12">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <p class="text-red-600 mb-4">{{ error }}</p>
          <router-link to="/search" class="btn-primary">
            ← Retour à la recherche
          </router-link>
        </div>
      </div>

      <!-- Medicament details -->
      <div v-else-if="medicament" class="space-y-6">
        <!-- Header avec breadcrumb -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <!-- Breadcrumb -->
          <nav class="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <router-link to="/" class="hover:text-blue-600">Accueil</router-link>
            <span>›</span>
            <router-link to="/search" class="hover:text-blue-600">Recherche</router-link>
            <span>›</span>
            <span class="text-gray-900">Détail médicament</span>
          </nav>

          <!-- Header principal -->
          <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div class="flex-1">
              <h1 class="text-3xl font-bold text-gray-900 mb-3">
                {{ medicament.denomination }}
              </h1>
              
              <div class="flex flex-wrap gap-3 mb-4">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {{ medicament.formePharma }}
                </span>
                <span 
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="medicament.etatCommercial === 'Commercialisée' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ medicament.etatCommercial }}
                </span>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  CIS: {{ medicament.codeCIS }}
                </span>
              </div>

              <p class="text-gray-600 text-lg">{{ medicament.substance }} - {{ medicament.dosage }}</p>
            </div>

            <!-- Actions rapides -->
            <div class="flex-shrink-0">
              <div class="flex space-x-3">
                <button 
                  v-if="medicament.sectionsRCP"
                  @click="changeTab('rcp')"
                  class="btn-secondary text-sm"
                >
                  Voir RCP ({{ medicament.sectionsRCP ? 'OK' : 'NON' }})
                </button>
                <button 
                  v-if="medicament.sectionsNotice"
                  @click="changeTab('notice')"
                  class="btn-secondary text-sm"
                >
                  Voir Notice ({{ medicament.sectionsNotice ? 'OK' : 'NON' }})
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation par onglets -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <nav class="flex space-x-8 px-6 pt-6 border-b border-gray-200">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
              :class="activeTab === tab.id 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              {{ tab.name }}
            </button>
          </nav>

          <div class="p-6">
            <!-- Onglet Informations générales -->
            <div v-if="activeTab === 'general'" class="space-y-6">
              <div class="grid md:grid-cols-2 gap-8">
                <!-- Informations principales -->
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">Informations réglementaires</h3>
                  <dl class="space-y-4">
                    <div class="flex justify-between py-2 border-b border-gray-100">
                      <dt class="font-medium text-gray-500">Laboratoire titulaire</dt>
                      <dd class="text-gray-900 text-right max-w-xs">{{ medicament.titulaires }}</dd>
                    </div>
                    <div class="flex justify-between py-2 border-b border-gray-100">
                      <dt class="font-medium text-gray-500">Substance active</dt>
                      <dd class="text-gray-900 text-right">{{ medicament.substance }}</dd>
                    </div>
                    <div class="flex justify-between py-2 border-b border-gray-100">
                      <dt class="font-medium text-gray-500">Dosage</dt>
                      <dd class="text-gray-900 text-right">{{ medicament.dosage }}</dd>
                    </div>
                    <div class="flex justify-between py-2 border-b border-gray-100">
                      <dt class="font-medium text-gray-500">Voie d'administration</dt>
                      <dd class="text-gray-900 text-right">{{ medicament.voiesAdmin }}</dd>
                    </div>
                    <div class="flex justify-between py-2 border-b border-gray-100">
                      <dt class="font-medium text-gray-500">Date d'AMM</dt>
                      <dd class="text-gray-900 text-right">{{ formatDate(medicament.dateAMM) }}</dd>
                    </div>
                  </dl>
                </div>

                <!-- Actions et recherches similaires -->
                <div class="space-y-6">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Documentation officielle</h3>
                    <div class="space-y-3">
                      <button 
                        v-if="medicament.sectionsRCP"
                        @click="changeTab('rcp')"
                        class="w-full flex items-center p-4 border border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
                      >
                        <div class="flex-1 text-left">
                          <p class="font-medium text-blue-900">RCP (Résumé Caractéristiques Produit)</p>
                          <p class="text-sm text-blue-700">Document officiel pour les professionnels de santé</p>
                        </div>
                        <svg class="w-5 h-5 text-blue-600 group-hover:text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      <button 
                        v-if="medicament.sectionsNotice"
                        @click="changeTab('notice')"
                        class="w-full flex items-center p-4 border border-green-200 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
                      >
                        <div class="flex-1 text-left">
                          <p class="font-medium text-green-900">Notice patient</p>
                          <p class="text-sm text-green-700">Information destinée aux patients</p>
                        </div>
                        <svg class="w-5 h-5 text-green-600 group-hover:text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Recherches similaires</h3>
                    <div class="space-y-2">
                      <button 
                        @click="searchSimilar('substance')"
                        class="w-full text-left p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                      >
                        🔬 Autres médicaments avec {{ medicament.substance }}
                      </button>
                      <button 
                        @click="searchSimilar('laboratoire')"
                        class="w-full text-left p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                      >
                        🏢 Autres produits de {{ medicament.titulaires }}
                      </button>
                      <button 
                        @click="searchSimilar('forme')"
                        class="w-full text-left p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors text-sm font-medium"
                      >
                        💊 Autres {{ medicament.formePharma }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Onglet RCP -->
            <div v-if="activeTab === 'rcp'" class="space-y-4">
              <div v-if="medicament.sectionsRCP" class="flex gap-6">
                <!-- Table des matières RCP -->
                <div class="w-64 flex-shrink-0">
                  <div class="sticky top-4">
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 class="font-semibold text-blue-900 mb-3 flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        Sommaire RCP
                      </h4>
                      <nav class="space-y-1">
                        <button
                          v-for="(section, index) in rcpSections"
                          :key="index"
                          @click="scrollToRcpSection(index)"
                          class="w-full text-left px-3 py-2 text-sm rounded-md transition-colors hover:bg-blue-100 hover:text-blue-800 text-blue-700"
                          :class="{ 'bg-blue-100 text-blue-800 font-medium': currentRcpSection === index }"
                        >
                          {{ section.title }}
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>

                <!-- Contenu RCP -->
                <div class="flex-1 prose prose-sm max-w-none">
                  <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                    <div class="flex">
                      <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm text-blue-700">
                          <strong>Information professionnelle</strong> - Le RCP est destiné aux professionnels de santé et contient les informations techniques et scientifiques.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="text-gray-700" id="rcp-content" ref="rcpContent">
                    <div v-html="formatRCP(medicament.sectionsRCP)"></div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-12">
                <p class="text-gray-500 mb-4">Contenu du RCP non disponible</p>
                <a 
                  v-if="medicament.urlRCP"
                  :href="medicament.urlRCP" 
                  target="_blank"
                  class="btn-primary"
                >
                  Consulter le RCP sur le site ANSM ↗
                </a>
              </div>
            </div>

            <!-- Onglet Notice -->
            <div v-if="activeTab === 'notice'" class="space-y-4">
              <div v-if="medicament.sectionsNotice" class="flex gap-6">
                <!-- Table des matières Notice -->
                <div class="w-64 flex-shrink-0">
                  <div class="sticky top-4">
                    <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 class="font-semibold text-green-900 mb-3 flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        Sommaire Notice
                      </h4>
                      <nav class="space-y-1">
                        <button
                          v-for="(section, index) in noticeSections"
                          :key="index"
                          @click="scrollToNoticeSection(index)"
                          class="w-full text-left px-3 py-2 text-sm rounded-md transition-colors hover:bg-green-100 hover:text-green-800 text-green-700"
                          :class="{ 'bg-green-100 text-green-800 font-medium': currentNoticeSection === index }"
                        >
                          {{ section.title }}
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>

                <!-- Contenu Notice -->
                <div class="flex-1 prose prose-sm max-w-none">
                  <div class="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                    <div class="flex">
                      <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm text-green-700">
                          <strong>Information patient</strong> - Cette notice contient des informations importantes pour le patient concernant l'utilisation de ce médicament.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="text-gray-700" id="notice-content" ref="noticeContent">
                    <div v-html="formatNotice(medicament.sectionsNotice)"></div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-12">
                <p class="text-gray-500 mb-4">Contenu de la notice non disponible</p>
                <a 
                  v-if="medicament.urlNotice"
                  :href="medicament.urlNotice" 
                  target="_blank"
                  class="btn-primary"
                >
                  Consulter la notice sur le site ANSM ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useMedicamentsStore } from '@/stores/medicaments'

export default {
  name: 'MedicamentDetail',
  data() {
    return {
      medicament: null,
      isLoading: true,
      error: null,
      activeTab: 'general',
      tabs: [
        { id: 'general', name: 'Informations générales' },
        { id: 'rcp', name: 'RCP (Professionnels)' },
        { id: 'notice', name: 'Notice (Patients)' }
      ],
      rcpSections: [],
      noticeSections: [],
      currentRcpSection: null,
      currentNoticeSection: null
    }
  },
  async mounted() {
    await this.loadMedicament()
  },
  watch: {
    '$route.params.id'() {
      this.loadMedicament()
    }
  },
  methods: {
    async loadMedicament() {
      this.isLoading = true
      this.error = null
      
      try {
        const medicamentsStore = useMedicamentsStore()
        const id = this.$route.params.id
        
        this.medicament = await medicamentsStore.getMedicamentById(id)
        
        if (!this.medicament) {
          this.error = 'Médicament non trouvé'
        }
      } catch (err) {
        this.error = 'Erreur lors du chargement du médicament'
        console.error('Erreur:', err)
      } finally {
        this.isLoading = false
      }
    },

    formatDate(dateString) {
      if (!dateString) return 'Non disponible'
      try {
        return new Date(dateString).toLocaleDateString('fr-FR')
      } catch (e) {
        return dateString
      }
    },

    formatRCP(rcpText) {
      if (!rcpText) return 'Aucun contenu RCP disponible'
      
      console.log('RCP Text:', rcpText.substring(0, 200) + '...')
      
      // Parser les sections pour la table des matières d'abord
      this.parseRcpSections(rcpText)
      console.log('Parsed RCP sections:', this.rcpSections)
      
      // Formatage ligne par ligne pour être sûr
      const lines = rcpText.split('\n')
      const formattedLines = lines.map((line) => {
        const trimmedLine = line.trim()
        
        // Trouver si cette ligne correspond à une section
        const sectionIndex = this.rcpSections.findIndex(s => s.title === trimmedLine)
        
        if (sectionIndex >= 0) {
          return `<h3 id="rcp-section-${sectionIndex}" class="font-bold text-blue-900 mt-6 mb-3 pb-2 border-b border-blue-200">${trimmedLine}</h3>`
        }
        
        return line
      })
      
      return formattedLines.join('<br>')
    },

    formatNotice(noticeText) {
      if (!noticeText) return 'Aucun contenu Notice disponible'
      
      console.log('Notice Text:', noticeText.substring(0, 200) + '...')
      
      // Parser les sections pour la table des matières d'abord
      this.parseNoticeSections(noticeText)
      console.log('Parsed Notice sections:', this.noticeSections)
      
      // Formatage ligne par ligne pour être sûr
      const lines = noticeText.split('\n')
      const formattedLines = lines.map((line) => {
        const trimmedLine = line.trim()
        
        // Trouver si cette ligne correspond à une section
        const sectionIndex = this.noticeSections.findIndex(s => s.title === trimmedLine)
        
        if (sectionIndex >= 0) {
          return `<h3 id="notice-section-${sectionIndex}" class="font-bold text-green-900 mt-6 mb-3 pb-2 border-b border-green-200">${trimmedLine}</h3>`
        }
        
        return line
      })
      
      let formatted = formattedLines.join('<br>')
      
      // Mettre en évidence ATTENTION
      formatted = formatted.replace(/\b(ATTENTION)\b/g, '<span class="bg-red-100 text-red-800 px-2 py-1 rounded font-semibold">$1</span>')
      
      return formatted
    },

    async reloadData() {
      const medicamentsStore = useMedicamentsStore()
      medicamentsStore.clearCache()
      await this.loadMedicament()
    },

    parseRcpSections(rcpText) {
      this.rcpSections = []
      const lines = rcpText.split('\n')
      
      lines.forEach((line) => {
        const trimmedLine = line.trim()
        // Détecter les titres de sections RCP - amélioré pour être plus flexible
        if (/^\d+\s*\..+/.test(trimmedLine) && trimmedLine.length > 3) {
          this.rcpSections.push({
            title: trimmedLine,
            index: this.rcpSections.length
          })
        }
      })
      console.log('Found RCP sections:', this.rcpSections.length)
    },

    parseNoticeSections(noticeText) {
      this.noticeSections = []
      const lines = noticeText.split('\n')
      
      lines.forEach((line) => {
        const trimmedLine = line.trim()
        // Détecter les titres de sections Notice - plus flexible
        if ((trimmedLine.toLowerCase().startsWith('qu') && trimmedLine.endsWith('?')) ||
            /^\d+\s*[.-]/.test(trimmedLine) ||
            trimmedLine.toLowerCase().includes('que contient') ||
            trimmedLine.toLowerCase().includes('comment ')) {
          if (trimmedLine.length > 5) {
            this.noticeSections.push({
              title: trimmedLine,
              index: this.noticeSections.length
            })
          }
        }
      })
      console.log('Found Notice sections:', this.noticeSections.length)
    },

    scrollToRcpSection(index) {
      console.log('Clic sur section RCP:', index, this.rcpSections[index])
      this.currentRcpSection = index
      
      if (!this.rcpSections[index]) {
        console.error('Section non trouvée:', index)
        return
      }
      
      // Utiliser le texte de la section pour faire le scroll
      const sectionTitle = this.rcpSections[index].title
      
      this.$nextTick(() => {
        setTimeout(() => {
          // D'abord essayer avec l'ID
          const sectionId = `rcp-section-${index}`
          let element = document.getElementById(sectionId)
          console.log('Elément trouvé par ID:', element)
          
          // Si pas trouvé par ID, chercher par texte
          if (!element && this.$refs.rcpContent) {
            const allH3 = this.$refs.rcpContent.querySelectorAll('h3')
            console.log('Nombre de H3 trouvés:', allH3.length)
            
            for (let h3 of allH3) {
              if (h3.textContent.trim() === sectionTitle) {
                element = h3
                console.log('Elément trouvé par texte:', element)
                break
              }
            }
          }
          
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start' 
            })
          } else {
            console.error('Élément non trouvé du tout pour:', sectionTitle)
          }
        }, 500)
      })
    },

    scrollToNoticeSection(index) {
      console.log('Clic sur section Notice:', index, this.noticeSections[index])
      this.currentNoticeSection = index
      
      if (!this.noticeSections[index]) {
        console.error('Section non trouvée:', index)
        return
      }
      
      // Utiliser le texte de la section pour faire le scroll
      const sectionTitle = this.noticeSections[index].title
      
      this.$nextTick(() => {
        setTimeout(() => {
          // D'abord essayer avec l'ID
          const sectionId = `notice-section-${index}`
          let element = document.getElementById(sectionId)
          console.log('Élément trouvé par ID:', element)
          
          // Si pas trouvé par ID, chercher par texte
          if (!element && this.$refs.noticeContent) {
            const allH3 = this.$refs.noticeContent.querySelectorAll('h3')
            console.log('Nombre de H3 trouvés:', allH3.length)
            
            for (let h3 of allH3) {
              if (h3.textContent.trim() === sectionTitle) {
                element = h3
                console.log('Élément trouvé par texte:', element)
                break
              }
            }
          }
          
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start' 
            })
          } else {
            console.error('Élément non trouvé du tout pour:', sectionTitle)
          }
        }, 500)
      })
    },

    changeTab(tabName) {
      console.log('Clic sur bouton pour changer vers:', tabName)
      console.log('Active tab avant:', this.activeTab)
      console.log('Medicament sectionsRCP:', !!this.medicament?.sectionsRCP)
      console.log('Medicament sectionsNotice:', !!this.medicament?.sectionsNotice)
      
      this.activeTab = tabName
      console.log('Active tab après:', this.activeTab)
      
      // Scroll vers le haut de la section onglets
      this.$nextTick(() => {
        const tabsSection = document.querySelector('.bg-white.rounded-lg.shadow-sm.border.border-gray-200:nth-child(2)')
        if (tabsSection) {
          tabsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      })
    },

    searchSimilar(type) {
      let query = ''
      switch (type) {
        case 'substance':
          query = this.medicament.substance
          break
        case 'laboratoire':
          query = this.medicament.titulaires
          break
        case 'forme':
          query = this.medicament.formePharma
          break
      }
      
      if (query) {
        this.$router.push({
          name: 'Search',
          query: { q: query }
        })
      }
    }
  }
}
</script>