<template>
  <div class="py-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">À propos de MedSearch Pro</h1>
        <p class="text-xl text-gray-600">
          Votre plateforme professionnelle de recherche médicamenteuse
        </p>
      </div>

      <div class="prose prose-lg mx-auto">
        <div class="card p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Notre mission</h2>
          <p class="text-gray-600 mb-4">
            MedSearch Pro a été conçu pour répondre aux besoins spécifiques des professionnels de santé 
            en leur fournissant un accès rapide et fiable aux informations sur les médicaments.
          </p>
          <p class="text-gray-600">
            Notre plateforme centralise les données officielles de l'ANSM et les présente de manière 
            claire et accessible pour faciliter votre pratique quotidienne.
          </p>
        </div>

        <div class="card p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Fonctionnalités clés</h2>
          <ul class="space-y-3 text-gray-600">
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
              Recherche avancée dans une base de données complète
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
              Accès aux RCP et notices patients officiels
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
              Filtres par laboratoire, substance, forme pharmaceutique
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
              Export des données pour vos rapports
            </li>
          </ul>
        </div>

        <div class="card p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Contact</h2>
          <p class="text-gray-600">
            Pour toute question ou suggestion d'amélioration, n'hésitez pas à nous contacter.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>