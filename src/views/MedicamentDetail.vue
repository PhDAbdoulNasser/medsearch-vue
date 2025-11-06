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
          <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6">
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
              <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button 
                  v-if="medicament.sectionsRCP"
                  @click="changeTab('rcp')"
                  class="btn-secondary text-sm w-full sm:w-auto text-center"
                >
                  Voir RCP ({{ medicament.sectionsRCP ? 'OK' : 'NON' }})
                </button>
                <button 
                  v-if="medicament.sectionsNotice"
                  @click="changeTab('notice')"
                  class="btn-secondary text-sm w-full sm:w-auto text-center"
                >
                  Voir Notice ({{ medicament.sectionsNotice ? 'OK' : 'NON' }})
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation par onglets -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <nav class="flex flex-col sm:flex-row sm:space-x-8 px-4 sm:px-6 pt-4 sm:pt-6 border-b border-gray-200">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="py-3 px-2 sm:py-2 sm:px-1 border-b-2 font-medium text-sm transition-colors mb-2 sm:mb-0 text-left sm:text-center"
              :class="activeTab === tab.id 
                ? 'border-blue-500 text-blue-600 bg-blue-50 sm:bg-transparent rounded-t-lg sm:rounded-none' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50 sm:hover:bg-transparent rounded-lg sm:rounded-none'"
            >
              {{ tab.name }}
            </button>
          </nav>

          <div class="p-4 sm:p-6">
            <!-- Onglet Informations générales -->
            <div v-if="activeTab === 'general'" class="space-y-6">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
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
              <div v-if="medicament.sectionsRCP" class="flex flex-col lg:flex-row gap-4 lg:gap-6">
                <!-- Table des matières RCP -->
                <div class="w-full lg:w-64 flex-shrink-0">
                  <div class="lg:sticky lg:top-4">
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 class="font-semibold text-blue-900 mb-3 flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        Sommaire RCP
                      </h4>
                      <nav class="space-y-1 max-h-64 lg:max-h-none overflow-y-auto lg:overflow-visible">
                        <button
                          v-for="(section, index) in rcpSections"
                          :key="index"
                          @click="scrollToRcpSection(index)"
                          class="w-full text-left px-3 py-2 text-xs sm:text-sm rounded-md transition-colors hover:bg-blue-100 hover:text-blue-800 text-blue-700 break-words"
                          :class="{ 'bg-blue-100 text-blue-800 font-medium': currentRcpSection === index }"
                        >
                          {{ section.title }}
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>

                <!-- Contenu RCP -->
                <div class="flex-1 prose prose-sm max-w-none order-first lg:order-last">
                  <div class="bg-blue-50 border-l-4 border-blue-400 p-3 sm:p-4 mb-4 sm:mb-6">
                    <div class="flex">
                      <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <div class="ml-3">
                        <p class="text-xs sm:text-sm text-blue-700">
                          <strong>Information professionnelle</strong> - Le RCP est destiné aux professionnels de santé et contient les informations techniques et scientifiques.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="text-gray-700 text-sm sm:text-base" id="rcp-content" ref="rcpContent">
                    <div v-html="formattedRCP"></div>
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
              <div v-if="medicament.sectionsNotice" class="flex flex-col lg:flex-row gap-4 lg:gap-6">
                <!-- Table des matières Notice -->
                <div class="w-full lg:w-64 flex-shrink-0">
                  <div class="lg:sticky lg:top-4">
                    <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 class="font-semibold text-green-900 mb-3 flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        Sommaire Notice
                      </h4>
                      <nav class="space-y-1 max-h-64 lg:max-h-none overflow-y-auto lg:overflow-visible">
                        <button
                          v-for="(section, index) in noticeSections"
                          :key="index"
                          @click="scrollToNoticeSection(index)"
                          class="w-full text-left px-3 py-2 text-xs sm:text-sm rounded-md transition-colors hover:bg-green-100 hover:text-green-800 text-green-700 break-words"
                          :class="{ 'bg-green-100 text-green-800 font-medium': currentNoticeSection === index }"
                        >
                          {{ section.title }}
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>

                <!-- Contenu Notice -->
                <div class="flex-1 prose prose-sm max-w-none order-first lg:order-last">
                  <div class="bg-green-50 border-l-4 border-green-400 p-3 sm:p-4 mb-4 sm:mb-6">
                    <div class="flex">
                      <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <div class="ml-3">
                        <p class="text-xs sm:text-sm text-green-700">
                          <strong>Information patient</strong> - Cette notice contient des informations importantes pour le patient concernant l'utilisation de ce médicament.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="text-gray-700 text-sm sm:text-base" id="notice-content" ref="noticeContent">
                    <div v-html="formattedNotice"></div>
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
      currentNoticeSection: null,
      formattedRCP: '',
      formattedNotice: '',
      sectionsParsingDone: false
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
        } else {
          // Parser les sections une seule fois
          this.initializeSections()
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

    initializeSections() {
      if (this.sectionsParsingDone) return
      
      // Parser et formater le RCP
      if (this.medicament.sectionsRCP) {
        this.parseRcpSections(this.medicament.sectionsRCP)
        this.formattedRCP = this.formatRCPContent(this.medicament.sectionsRCP)
      }
      
      // Parser et formater la Notice
      if (this.medicament.sectionsNotice) {
        this.parseNoticeSections(this.medicament.sectionsNotice)
        this.formattedNotice = this.formatNoticeContent(this.medicament.sectionsNotice)
      }
      
      this.sectionsParsingDone = true
    },

    formatRCPContent(rcpText) {
      if (!rcpText) return 'Aucun contenu RCP disponible'
      
      // Formatage ligne par ligne
      const lines = rcpText.split('\n')
      const formattedLines = lines.map((line) => {
        const trimmedLine = line.trim()
        
        // Trouver si cette ligne correspond à une section
        const sectionIndex = this.rcpSections.findIndex(s => s.title === trimmedLine)
        
        if (sectionIndex >= 0) {
          return `<h3 id="rcp-section-${sectionIndex}" class="font-bold text-blue-900 mt-4 sm:mt-6 mb-2 sm:mb-3 pb-2 border-b border-blue-200 text-sm sm:text-base break-words">${trimmedLine}</h3>`
        }
        
        return line
      })
      
      return formattedLines.join('<br>')
    },

    formatNoticeContent(noticeText) {
      if (!noticeText) return 'Aucun contenu Notice disponible'
      
      // Formatage ligne par ligne
      const lines = noticeText.split('\n')
      const formattedLines = lines.map((line) => {
        const trimmedLine = line.trim()
        
        // Trouver si cette ligne correspond à une section
        const sectionIndex = this.noticeSections.findIndex(s => s.title === trimmedLine)
        
        if (sectionIndex >= 0) {
          return `<h3 id="notice-section-${sectionIndex}" class="font-bold text-green-900 mt-4 sm:mt-6 mb-2 sm:mb-3 pb-2 border-b border-green-200 text-sm sm:text-base break-words">${trimmedLine}</h3>`
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
      if (this.rcpSections.length > 0) return // Éviter de parser plusieurs fois
      
      const lines = rcpText.split('\n')
      
      lines.forEach((line) => {
        const trimmedLine = line.trim()
        // Détecter les titres de sections RCP
        if (/^\d+\s*\..+/.test(trimmedLine) && trimmedLine.length > 3) {
          this.rcpSections.push({
            title: trimmedLine,
            index: this.rcpSections.length
          })
        }
      })
    },

    parseNoticeSections(noticeText) {
      if (this.noticeSections.length > 0) return // Éviter de parser plusieurs fois
      
      const lines = noticeText.split('\n')
      
      lines.forEach((line) => {
        const trimmedLine = line.trim()
        // Détecter les titres de sections Notice
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