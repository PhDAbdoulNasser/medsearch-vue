<template>
  <div id="app" class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <router-link to="/" class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold">M</span>
              </div>
              <span class="text-xl font-bold text-blue-600">MedSearch Pro</span>
            </router-link>
          </div>
          
          <nav class="flex items-center space-x-8">
            <router-link to="/" class="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Accueil
            </router-link>
            <router-link to="/search" class="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Recherche
            </router-link>
            <router-link to="/about" class="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              À propos
            </router-link>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p>&copy; 2024 MedSearch Pro. Tous droits réservés.</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>