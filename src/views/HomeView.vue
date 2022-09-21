<script setup>
import axios from "axios";
import { ref } from "vue";

let fetchUrl = "https://pokeapi.co/api/v2/pokemon";
let loading = ref(true);
let filtered = false;
let pokemonList = ref([]);
let backupList = [];
let modalPoke = ref({});

const pokemonTypes = [
  "bug",
  "dark",
  "dragon",
  "electric",
  "fairy",
  "fighting",
  "fire",
  "flying",
  "ghost",
  "grass",
  "ground",
  "ice",
  "normal",
  "poison",
  "psychic",
  "rock",
  "steel",
  "water",
];

async function fetchData(qtd) {
  if (filtered) {
    filterByType("");
    fetchData(27);
  } else {
    await axios
      .get(fetchUrl, {
        params: {
          limit: qtd,
        },
      })
      .then((response) => {
        fetchUrl = response.data.next;
        Object.keys(response.data.results).forEach(async (item) => {
          await fetchPokemon(response.data.results[item].url);
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .then(() => {
        setTimeout(() => {
          const newList = pokemonList.value.sort((a, b) => a.id - b.id);
          pokemonList.value = newList;
          loading.value = false;
        }, 100);
      });
  }
}

async function fetchPokemon(url) {
  await axios
    .get(url)
    .then((response) => {
      pokemonList.value.push(response.data);
    })
    .catch((error) => {
      console.log(error);
    })
    .then(() => {
      loading.value = false;
    });
}

function filterByType(type) {
  if (filtered) {
    pokemonList.value = backupList;
    backupList = [];
    filtered = false;
  } else {
    const filteredList = pokemonList.value.filter((el) => {
      return (
        el.types[0].type.name == type ||
        (el.types[1] ? el.types[1].type.name == type : "")
      );
    });

    backupList = pokemonList.value;
    pokemonList.value = filteredList;
    filtered = true;
    // console.log(filteredList)
  }
}

function formatedID(id) {
  if (id.toString().length == 1) {
    return `00${id}`;
  } else if (id.toString().length == 2) {
    return `0${id}`;
  } else {
    return id;
  }
}

function imgUrl(type) {
  return new URL(`/src/assets/types/${type}.svg`, import.meta.url).href;
}

fetchData(27);
setTimeout(() => {
  modalPoke.value = pokemonList.value[0]
}, 500);

</script>

<template>
  <div>
    <header>
      <img class="ms-4 mt-4" src="@/assets/logo.svg" alt="" />
    </header>

    <div class="container">
      <div class="row p-2">
        <div class="col-12 col-xl-4">
          <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1">
              <img src="@/assets/icon.png" alt="" style="width: 24px" />
            </span>
            <input
              type="text"
              id="search"
              class="form-control"
              placeholder="Procurar por nome ou ID.."
            />
          </div>
        </div>
        <div class="col-12">
          <ul
            class="d-flex justify-content-around p-0 flex-wrap"
            style="color: rgba(177, 177, 177, 0.7)"
          >
            <li
              class="filter-item"
              @click="filterByType(type)"
              v-for="(type, idx) in pokemonTypes"
              :key="idx"
            >
              <img :src="imgUrl(type)" alt="" />
              <span class="filterActive text-capitalize">{{ type }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading w-100 d-flex justify-content-center" v-if="loading">
        <img
          id="loader"
          src="@/assets/loader.svg"
          alt=""
          style="width: 100px"
        />
      </div>
      <div class="row gx-5 gy-4" v-if="!loading">
        <div class="col-12 col-xl-4" v-for="p in pokemonList" :key="p.id">
          <Transition name="slide-fade" appear>
            <div
              role="button"
              :class="'poke-card ' + p.types[0].type.name"
              @click="modalPoke = p"
              data-bs-toggle="modal"
              data-bs-target="#pokemonInfoModal"
            >
              <div
                class="poke-photo d-flex justify-content-center align-items-center me-5"
              >
                <img
                  v-if="p.id < 650"
                  :src="p.sprites.other.dream_world.front_default"
                  class="w-100 h-100"
                  alt=""
                />
                <img
                  v-if="p.id > 650"
                  :src="p.sprites.other.official-artwork.front_default"
                  class="w-100 h-100"
                  alt=""
                />
              </div>
              <div class="poke-info d-flex flex-column justify-content-around">
                <div class="poke-name">
                  <div class="poke-id">
                    <span>#{{ formatedID(p.id) }}</span>
                  </div>
                  <span class="text-capitalize">{{ p.name }}</span>
                </div>
                <div class="poke-elements">
                  <img
                    class="me-2"
                    :src="imgUrl(p.types[0].type.name)"
                    alt=""
                  />
                  <img
                    v-if="p.types[1]"
                    :src="imgUrl(p.types[1].type.name)"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </Transition>
        </div>
        <div class="col-12 col-lg-12">
          <button class="btn btn-secondary mt-4 w-100" @click="fetchData(27)">
            Carregar mais..
          </button>
        </div>
      </div>
    </div>

    <footer>
      <div class="container">
        <div class="row">
          <div class="d-none d-lg-block col-12">
            <div class="d-flex align-items-center justify-content-between">
              <div><img style="max-width: 200px" src="@/assets/logo.svg" alt="" /></div>
              <div>linkedin.com/in/rodrigoandradee1</div>
            </div>
          </div>
          <div class="d-lg-none col-12">
            <div class="d-flex flex-column align-items-center justify-content-between">
              <div><img style="max-width: 200px" src="@/assets/logo.svg" alt="" /></div>
              <div>linkedin.com/in/rodrigoandradee1</div>
            </div>
          </div>
        </div>
      </div>
    </footer>

    <div v-if="!Object.keys(modalPoke).length == 0">
      <div
        class="modal fade"
        id="pokemonInfoModal"
        tabindex="-1"
        aria-labelledby="pokemonInfoModal"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content">
            <div
              class="modal-body bg-dark text-white rounded-5"
              style="min-height: 300px"
            >
              <div class="row">
                <div class="col-4">
                  <div class="modal-photo">
                    <img
                      :src="modalPoke.sprites.other.dream_world.front_default"
                      class="w-100"
                      alt=""
                    />
                  </div>
                </div>
                <div class="col-8">
                  <div class="row">
                    <div class="col-12">
                      <div class="d-flex justify-content-between">
                        <div class="d-flex align-items-center">
                          <span class="text-capitalize fs-4">{{
                            modalPoke.name
                          }}</span>
                          <span class="ms-2 mt-2" style="color: gray"
                            >#{{ formatedID(modalPoke.id) }}</span
                          >
                        </div>
                        <div
                          class="rounded"
                          style="
                            width: 24px;
                            height: 24px;
                            background-color: gray;
                          "
                        >
                          <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="element-box-fire">
                        <img
                          class="mb-1"
                          :src="imgUrl(modalPoke.types[0].type.name)"
                          alt=""
                        />
                        <span class="text-uppercase ms-2">{{
                          modalPoke.types[0].type.name
                        }}</span>
                      </div>
                      <div v-if="modalPoke.types[1]" class="element-box-fire">
                        <img
                          class="mb-1"
                          :src="imgUrl(modalPoke.types[1].type.name)"
                          alt=""
                        />
                        <span
                          class="text-uppercase ms-2"
                          v-if="modalPoke.types[1]"
                          >{{ modalPoke.types[1].type.name }}</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
header {
  height: 60vh;
  width: 100vw;
  background-image: url("@/assets/bg.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: inset 0px -24px 20px -6px #181818;
}

ul {
  list-style: none;
}

ul > li {
  display: flex;
  flex-direction: column;
}

ul > li > img {
  height: 23px;
}

.poke-card {
  background-color: rgba(211, 211, 211, 0.205);
  height: 8rem;
  display: flex;
  /* box-shadow: 0px 10px 51px -5px rgba(255, 255, 255, 0.3); */
  border: 1px solid rgba(182, 182, 182, 0.103);
  transition: 0.2s;
  border-radius: 100px 0 60px 100px;
  cursor: pointer;
}

.poke-card:hover {
  transform: translateY(-3px);
  /* box-shadow: 0px 10px 21px -5px rgba(224, 224, 224, 0.3); */
  outline: 0.2em solid rgba(224, 224, 224, 0.644);
  outline-offset: -3px;
}

.poke-photo {
  height: 7rem;
  width: 7rem;
  align-self: center;
  border-radius: 5%;
  position: relative;
  right: -5px;
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
  font-size: 27px;
  font-weight: bold;
  color: white;
}

.poke-id span {
  font-size: 14px;
  color: rgba(247, 247, 247, 0.582);
}

.modal-photo {
  /* background-color: rgba(240, 248, 255, 0.068); */
  height: 100%;
  width: 100%;
  border-radius: 25%;
  /* border: 1px solid rgba(128, 128, 128, 0.315); */
}

.modal-photo img {
}

.element-box-fire {
  background-color: rgba(230, 230, 230, 0.459);
  color: rgb(214, 211, 211);
  border-radius: 10px;
  padding: 3px 12px;
  font-size: 15px;
  font-weight: 600;
  display: inline-block;
  margin-right: 10px;
}

footer {
  margin-top: 20px;
  height: 14vh;
  color: white;
  background-color: #0003209c;
  box-shadow: inset 0px 29px 20px -6px #181818;
  display: flex;
  align-items: center;
}

.filter-item {
  transition: 0.2s;
  cursor: pointer;
}

.filter-item:hover {
  transform: scale(1.2);
}

.modal-content {
  background-color: transparent !important;
  border: none !important;
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

.poke-card.bug .poke-photo::before {
  background-color: rgb(164, 224, 24);
}

.poke-card.dark .poke-photo::before {
  background-color: rgb(48, 26, 88);
}

.poke-card.dragon .poke-photo::before {
  background-color: rgb(25, 159, 192);
}

.poke-card.electric .poke-photo::before {
  background-color: rgb(217, 255, 0);
}

.poke-card.fairy .poke-photo::before {
  background-color: rgb(224, 24, 117);
}

.poke-card.fighting .poke-photo::before {
  background-color: rgb(224, 224, 224);
}

.poke-card.fire .poke-photo::before {
  background-color: rgb(224, 104, 24);
}

.poke-card.flying .poke-photo::before {
  background-color: rgb(44, 161, 228);
}

.poke-card.ghost .poke-photo::before {
  background-color: rgb(171, 64, 197);
}

.poke-card.grass .poke-photo::before {
  background-color: rgb(105, 196, 93);
}

.poke-card.ground .poke-photo::before {
  background-color: rgb(139, 92, 61);
}

.poke-card.ice .poke-photo::before {
  background-color: rgb(24, 201, 224);
}

.poke-card.normal .poke-photo::before {
  background-color: rgb(224, 224, 224);
}

.poke-card.poison .poke-photo::before {
  background-color: rgb(131, 19, 223);
}

.poke-card.psychic .poke-photo::before {
  background-color: rgb(247, 0, 255);
}

.poke-card.rock .poke-photo::before {
  background-color: rgb(99, 65, 34);
}

.poke-card.steel .poke-photo::before {
  background-color: rgb(77, 104, 83);
}

.poke-card.water .poke-photo::before {
  background-color: rgb(24, 134, 224);
}
</style>
