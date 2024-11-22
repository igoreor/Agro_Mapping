<template>
    <div>
      <h2>Mapa de Feiras</h2>
      <div v-if="erro" class="error">{{ erro }}</div>
      <div id="map" ref="map" style="width: 100%; height: 500px;"></div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        feiras: [], // Armazena as feiras obtidas do backend
        mapa: null,
        marcadores: [],
        erro: "",
      };
    },
    methods: {
      async listarFeiras() {
        try {
          // Substitua pela URL do seu backend
          const apiUrl = "http://localhost:8090/feiras";
          const response = await fetch(apiUrl);
          if (!response.ok) {
            throw new Error("Erro ao buscar feiras do backend.");
          }
  
          this.feiras = await response.json(); // Obtem feiras
          this.buscarCoordenadasDasFeiras();
          console.log(this.feiras);
        } catch (error) {
          console.error(error);
          this.erro = "Erro ao carregar as feiras.";
        }
      },
      async buscarCoordenadasDasFeiras() {
        try {
          const apiKey = "AIzaSyDk4SEQzeihcc866JNybge7_InJvEjwDP8"; // Substitua pela sua chave de API
          for (const feira of this.feiras) {
            const endereco = feira.localizacao; // Supondo que 'endereco' é uma propriedade em cada feira
            const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
              endereco
            )}&key=${apiKey}`;
            const response = await fetch(url);
            const data = await response.json();
  
            if (data.status === "OK" && data.results.length > 0) {
              const location = data.results[0].geometry.location;
              this.adicionarMarcador(location.lat, location.lng, feira.nome); // Supondo que cada feira tem um 'nome'
            } else {
              console.warn(`Endereço não encontrado: ${endereco}`);
            }
          }
        } catch (error) {
          console.error(error);
          this.erro = "Erro ao buscar coordenadas das feiras.";
        }
      },
      inicializarMapa() {
        const mapaElemento = this.$refs.map;
  
        this.mapa = new google.maps.Map(mapaElemento, {
          center: { lat: -8.89074, lng: -36.4966 }, // Ponto central do Brasil (Brasília)
          zoom: 13,
        });
      },
      adicionarMarcador(latitude, longitude, titulo) {
        const marcador = new google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: this.mapa,
          title: titulo,
        });
  
        this.marcadores.push(marcador);
      },
    },
    async mounted() {
      this.inicializarMapa();
      await this.listarFeiras();
    },
  };
  </script>
  
  <style>
  .error {
    color: rgb(38, 255, 0);
    margin-top: 10px;
  }
  </style>
  