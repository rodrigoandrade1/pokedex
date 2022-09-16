<script setup>
import axios from "axios";
import { ref } from 'vue';

let fetchUrl = "https://pokeapi.co/api/v2/pokemon";
let loading = ref(true);
let pokemonList = ref([]);

async function fetchData() {
  await axios
    .get(fetchUrl, {
      params: {
        limit: 27
      }
    })
    .then((response) => {
      fetchUrl = response.data.next;
      Object.keys(response.data.results).forEach((item) => {
        fetchPokemon(response.data.results[item].url)
      })
      
    })
    .catch((error) => {
      console.log(error);
    })
    .then(() => {
      loading.value = false;
    });
}

async function fetchPokemon(url) {
  await axios
  .get(url)
  .then((response) => {
    pokemonList.value.push(response.data)
  })
  .catch((error) => {
    console.log(error)
  })
  .then(() => {
    loading.value = false;
  })
}

fetchData()

// window.onscroll = (ev) => {
//   if (Math.round(window.innerHeight + window.scrollY) >= Math.round(document.body.offsetHeight)) {
//     fetchData();
//   }
// }
</script>

<template>
  <div>
    <header>
      <div class="container">
        <div class="row">
          <div class="col-3">
            <input
              type="text"
              id="search"
              class="form-control"
              placeholder="Pesquise por nome ou código"
            />
          </div>
        </div>
      </div>
    </header>

    <div class="container">
      <div class="row">
        <div class="col-2">
          <ul>
            <li>Tudos</li>
            <li>Grama</li>
            <li>Fogo</li>
            <li>Terra</li>
          </ul>
        </div>
        <div class="col-10">
          <div
            class="loading w-100 d-flex justify-content-center"
            v-if="loading"
          >
            <img
              id="loader"
              src="@/assets/loader.svg"
              alt=""
              style="width: 100px"
            />
          </div>
          <div class="row gx-5 gy-4" v-if="!loading">
            <div class="col-4" v-for="p in pokemonList" :key="p.id">
              <Transition name="slide-fade" appear>
                <div :class="'poke-card ' + p.types[0].type.name">
                  <div
                    class="poke-photo d-flex justify-content-center align-items-center me-3"
                  >
                    <img :src="p.sprites.other.dream_world.front_default" class="w-100 h-100" alt="" />
                  </div>
                  <div
                    class="poke-info d-flex flex-column justify-content-around"
                  >
                    <div class="poke-name">
                      <span class="text-capitalize">{{p.name}}</span>
                    </div>
                    <div class="poke-id">
                      <span>#001</span>
                    </div>
                    <div class="poke-elements">
                      <img :src="`./src/assets/types/${p.types[0].type.name}.svg`" alt="" />
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
            <button class="btn btn-primary mt-4" @click="fetchData">Carregar mais..</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
header {
  height: 50px;
  width: 100vw;
  background-color: rgb(226, 239, 255);
  margin-top: 200px;
}

.poke-card {
  background-color: rgba(241, 241, 241, 0);
  height: 8rem;
  display: flex;
  box-shadow: 0px 10px 51px -5px rgb(183 189 193 / 30%);
  transition: 0.2s;
  border-radius: 100px 0 60px 100px;
  cursor: pointer;
}

.poke-card:hover {
  transform: translateY(-3px);
  box-shadow: 0px 10px 21px -5px rgba(39, 39, 39, 0.3);
}

.poke-photo {
  height: 7rem;
  width: 7rem;
  align-self: center;
  border-radius: 5%;
  position: relative;
  left: -20px;
  z-index: 2;
}

.poke-photo::before {
  content: "";
  width: 9rem;
  height: 9rem;
  background-color: rgb(85, 190, 150);
  position: absolute;
  z-index: -1;
  border-radius: 100%;
}

.poke-name span {
  font-size: 25px;
  font-weight: bold;
  border-radius: 10px;
  padding: 0.1em 1.1em;
}

.slide-fade-enter-active {
  transition: all 0.6s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.poke-card.bug .poke-photo::before{
  background-color: rgba(164, 224, 24, 0.5);
}

.poke-card.dark .poke-photo::before{
  background-color: rgba(48, 26, 88, 0.5);
}

.poke-card.dragon .poke-photo::before{
  background-color: rgba(25, 159, 192, 0.5);
}

.poke-card.electric .poke-photo::before{
  background-color: rgba(217, 255, 0, 0.5);
}

.poke-card.fairy .poke-photo::before{
  background-color: rgba(224, 24, 117, 0.5);
}

.poke-card.fighting .poke-photo::before{
  background-color: rgba(224, 224, 224, 0.5);
}

.poke-card.fire .poke-photo::before{
  background-color: rgba(224, 104, 24, 0.5);
}

.poke-card.flying .poke-photo::before{
  background-color: rgba(44, 161, 228, 0.5);
}

.poke-card.ghost .poke-photo::before{
  background-color: rgba(171, 64, 197, 0.5);
}

.poke-card.grass .poke-photo::before{
  background-color: rgba(105, 196, 93, 0.5);
}

.poke-card.ground .poke-photo::before{
  background-color: rgba(139, 92, 61, 0.5);
}

.poke-card.ice .poke-photo::before{
  background-color: rgba(24, 201, 224, 0.5);
}

.poke-card.normal .poke-photo::before{
  background-color: rgba(224, 224, 224, 0.5);
}

.poke-card.poison .poke-photo::before{
  background-color: rgba(131, 19, 223, 0.5);
}

.poke-card.psychic .poke-photo::before{
  background-color: rgba(247, 0, 255, 0.5);
}

.poke-card.rock .poke-photo::before{
  background-color: rgba(99, 65, 34, 0.5);
}

.poke-card.steel .poke-photo::before{
  background-color: rgba(77, 104, 83, 0.5);
}

.poke-card.water .poke-photo::before{
  background-color: rgba(24, 134, 224, 0.5);
}

</style>
