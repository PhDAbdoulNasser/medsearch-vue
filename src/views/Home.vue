<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-indigo-100 py-24">
      <!-- Animation d'arrière-plan élégante -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <!-- Cercles flottants colorés -->
        <div 
          v-for="(circle, index) in floatingCircles" 
          :key="'circle-' + index"
          class="absolute rounded-full opacity-30 animate-float-gentle"
          :class="circle.color"
          :style="{
            left: circle.x + '%',
            top: circle.y + '%',
            width: circle.size + 'px',
            height: circle.size + 'px',
            animationDelay: circle.delay + 's',
            animationDuration: circle.duration + 's'
          }"
        ></div>
        
        <!-- Formes géométriques -->
        <div 
          v-for="(shape, index) in geometricShapes" 
          :key="'shape-' + index"
          class="absolute opacity-20 animate-rotate-slow"
          :style="{
            left: shape.x + '%',
            top: shape.y + '%',
            animationDelay: shape.delay + 's'
          }"
        >
          <div 
            :class="[shape.type, shape.color]"
            class="border-2"
            :style="{
              width: shape.size + 'px',
              height: shape.size + 'px'
            }"
          ></div>
        </div>
        
        <!-- Particules lumineuses -->
        <div 
          v-for="(particle, index) in lightParticles" 
          :key="'particle-' + index"
          class="absolute w-2 h-2 rounded-full bg-white opacity-60 animate-twinkle"
          :style="{
            left: particle.x + '%',
            top: particle.y + '%',
            animationDelay: particle.delay + 's'
          }"
        ></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center">
          <!-- Badge -->
          <div class="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-8">
            <span class="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Plateforme professionnelle de recherche médicamenteuse
          </div>

          <!-- Titre principal -->
          <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span class="text-gray-900">Recherche</span>
            <span class="text-gradient block mt-2">Médicamenteuse</span>
          </h1>

          <!-- Sous-titre -->
          <p class="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12">
            La référence des professionnels de santé pour accéder aux informations complètes sur les médicaments
          </p>

          <!-- Barre de recherche -->
          <div class="max-w-2xl mx-auto mb-8">
            <SearchBar
              v-model="searchQuery"
              placeholder="Rechercher un médicament, substance ou laboratoire..."
              @search="handleSearch"
              @select="handleSuggestionSelect"
            />
          </div>

          <!-- Statistiques -->
          <div class="flex flex-wrap justify-center gap-8 text-center">
            <div class="flex items-center space-x-2">
              <div class="w-5 h-5 bg-blue-500 rounded"></div>
              <span class="text-2xl font-bold text-gray-900">{{ stats?.totalMedicaments || 0 }}</span>
              <span class="text-gray-600">médicaments</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-5 h-5 bg-green-500 rounded"></div>
              <span class="text-2xl font-bold text-gray-900">{{ stats?.totalLaboratoires || 0 }}</span>
              <span class="text-gray-600">laboratoires</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-5 h-5 bg-orange-500 rounded"></div>
              <span class="text-2xl font-bold text-gray-900">{{ stats?.totalSubstances || 0 }}</span>
              <span class="text-gray-600">substances</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section fonctionnalités -->
    <section class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Fonctionnalités professionnelles
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Une suite d'outils avancés pour les professionnels de santé
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="card p-8 text-center hover:shadow-xl">
            <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <div class="w-8 h-8 bg-white rounded"></div>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Recherche intelligente</h3>
            <p class="text-gray-600">
              Recherche instantanée avec autocomplétion et suggestions intelligentes
            </p>
          </div>

          <div class="card p-8 text-center hover:shadow-xl">
            <div class="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <div class="w-8 h-8 bg-white rounded"></div>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Documentation complète</h3>
            <p class="text-gray-600">
              Accès aux RCP et notices patients complets directement intégrés
            </p>
          </div>

          <div class="card p-8 text-center hover:shadow-xl">
            <div class="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <div class="w-8 h-8 bg-white rounded"></div>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Export professionnel</h3>
            <p class="text-gray-600">
              Exportation des données en PDF, Excel pour vos rapports
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { useMedicamentsStore } from '@/stores/medicaments'
import SearchBar from '@/components/SearchBar.vue'

export default {
  name: 'Home',
  components: {
    SearchBar
  },
  data() {
    return {
      searchQuery: '',
      stats: null,
      floatingCircles: [],
      geometricShapes: [],
      lightParticles: []
    }
  },
  async mounted() {
    const medicamentsStore = useMedicamentsStore()
    this.stats = await medicamentsStore.loadStats()
    this.generateElegantBackground()
  },
  methods: {
    generateElegantBackground() {
      // Couleurs douces et élégantes
      const softColors = [
        'bg-blue-200', 'bg-indigo-200', 'bg-purple-200', 'bg-pink-200',
        'bg-cyan-200', 'bg-teal-200', 'bg-emerald-200'
      ]
      
      const borderColors = [
        'border-blue-300', 'border-indigo-300', 'border-purple-300', 
        'border-pink-300', 'border-cyan-300', 'border-teal-300'
      ]
      
      // Générer des cercles flottants (8-12)
      for (let i = 0; i < 10; i++) {
        this.floatingCircles.push({
          x: Math.random() * 95,
          y: Math.random() * 90,
          size: 60 + Math.random() * 120, // 60-180px
          color: softColors[Math.floor(Math.random() * softColors.length)],
          delay: Math.random() * 5,
          duration: 12 + Math.random() * 8 // 12-20s
        })
      }
      
      // Générer des formes géométriques (5-8)
      const shapeTypes = ['rounded-lg', 'rounded-full', '']
      for (let i = 0; i < 6; i++) {
        this.geometricShapes.push({
          x: Math.random() * 90,
          y: Math.random() * 85,
          size: 40 + Math.random() * 80, // 40-120px
          type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
          color: borderColors[Math.floor(Math.random() * borderColors.length)],
          delay: Math.random() * 10
        })
      }
      
      // Générer des particules lumineuses (15-20)
      for (let i = 0; i < 18; i++) {
        this.lightParticles.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 3
        })
      }
    },

    handleSearch(query) {
      if (query && query.trim()) {
        this.$router.push({ 
          name: 'Search', 
          query: { q: query } 
        })
      }
    },
    handleSuggestionSelect(suggestion) {
      // Rediriger selon le type de suggestion
      switch (suggestion.type) {
        case 'medicament':
          // Aller directement aux détails du médicament
          this.$router.push({ 
            name: 'MedicamentDetail', 
            params: { id: suggestion.id } 
          })
          break
        case 'laboratoire':
        case 'substance':
          // Aller à la recherche pour les laboratoires et substances
          this.$router.push({ 
            name: 'Search', 
            query: { q: suggestion.title } 
          })
          break
      }
    }
  }
}
</script>

<style scoped>
/* Animation flottante douce */
@keyframes float-gentle {
  0%, 100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-15px) scale(1.05);
  }
}

/* Rotation très lente */
@keyframes rotate-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Scintillement des particules */
@keyframes twinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.5);
  }
}

/* Classes d'animation */
.animate-float-gentle {
  animation: float-gentle ease-in-out infinite;
}

.animate-rotate-slow {
  animation: rotate-slow 25s linear infinite;
}

.animate-twinkle {
  animation: twinkle 2s ease-in-out infinite;
}

/* Gradient text pour le titre */
.text-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Effet de blur pour plus de douceur */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
</style>