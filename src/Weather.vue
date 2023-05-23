<script setup lang="ts">
import Navbar from './components/Navbar.vue';
import Spinner from './components/Spinner.vue';
</script>

<template>
  <div id="theme" :class="{ dark: theme === 'dark' }">
    <div id="background" class="min-h-screen bg-light pb-16 dark:bg-dark">
      <Navbar />
      <div class="container mx-auto px-4 font-sans">
        <!-- REALTIME START -->
        <div
          id="realtime"
          class="flex flex-col items-center justify-start"
          :class="{ hidden: mode !== 'realtime' }"
        >
          <div class="mt-12 flex h-10 w-3/4 flex-row lg:w-5/12">
            <a
              class="flex w-14 items-center justify-center rounded rounded-e-none border-2 border-e-0 border-slate-200 bg-slate-200 text-slate-600 dark:border-slate-600 dark:bg-slate-300"
              ><i class="fa-solid fa-magnifying-glass"></i
            ></a>
            <input
              type="text"
              placeholder="City / State / ZIP"
              v-model="search"
              class="w-full border-2 border-x-0 border-slate-200 bg-slate-50 px-2 focus:outline-none dark:border-slate-600 dark:bg-slate-200"
              @keypress="
                (event) => {
                  error = false;
                  if (event.key == 'Enter') {
                    if (!search) return;
                    getCurrentWeatherInfo(search);
                  }
                }
              "
            />
            <a
              class="flex w-16 cursor-pointer items-center justify-center rounded rounded-s-none border-2 border-s-0 border-slate-200 bg-emerald-400/75 font-bold text-slate-800 transition-[width] hover:w-24 dark:border-slate-600"
              @click="
                () => {
                  if (!search) return;
                  getCurrentWeatherInfo(search);
                }
              "
              >Go</a
            >
          </div>
          <a
            class="my-8 cursor-pointer rounded-lg bg-sky-600/30 p-2 font-medium elevation-4 dark:text-slate-200"
            :class="{ hidden: weatherData.available }"
            @click="getLocation()"
            >Use my current location</a
          >
          <Spinner size="md" :class="{ hidden: !loading }" />
          <div
            class="mt-8 flex w-2/3 flex-col items-center break-all rounded border-2 border-red-600/60 bg-red-500/40 p-2 text-center"
            :class="{ hidden: !error }"
          >
            <h4 class="text-xl font-medium">Error</h4>
            <h5>
              Could not find location <strong>{{ errorSearch }}</strong>
            </h5>
          </div>
          <div class="flex flex-col items-center" :class="{ hidden: !weatherData.available }">
            <h2 class="mt-8 text-center text-2xl font-semibold text-slate-800 dark:text-slate-300">
              <vue-custom-tooltip label="Not your location?">
                <i
                  class="fa-solid fa-location-dot cursor-pointer text-slate-900 dark:text-red-500"
                  :class="{ hidden: !isCurrentLocation }"
                  @click="resetLocation()"
                ></i>
              </vue-custom-tooltip>
              {{ weatherData.location.region }}
            </h2>
            <h3 class="text-md text-center text-slate-600 dark:text-slate-400">
              {{ weatherData.location.country }}
            </h3>
            <h2 class="mt-8 text-center text-3xl text-slate-700 dark:text-slate-300">
              {{ weatherData.realtime.condition }}
            </h2>
            <img
              :src="weatherData.realtime.icon"
              :class="{ hidden: !weatherData.available }"
              class="mt-4 w-1/3"
            />
          </div>
          <div
            id="data"
            class="mt-2 grid w-11/12 place-items-center gap-y-8 align-middle text-slate-600 dark:text-slate-300 xl:grid-cols-4"
            :class="{ hidden: !weatherData.available }"
          >
            <h3 class="text-3xl font-light xl:text-2xl">
              <i
                class="fa-solid fa-temperature-three-quarters dark:text-orange-600pk text-sky-400"
              ></i
              >&nbsp;&nbsp;Temperature
            </h3>
            <div class="grid w-full grid-cols-2 md:w-2/3 lg:w-1/2 xl:w-full">
              <div
                class="flex w-full flex-wrap justify-center rounded-s-lg border-2 border-stone-400/50 p-2 text-center text-2xl font-bold"
              >
                <p>&deg;C</p>
                &nbsp;
                <p :class="tempTextColor(weatherData.realtime.temp_c, 'C')">
                  {{ weatherData.realtime.temp_c }}
                </p>
                <div class="h-0 basis-full"></div>
                <p class="text-sm">
                  Feels like &deg;C
                  <span :class="tempTextColor(weatherData.realtime.feelslike_c, 'C')">{{
                    weatherData.realtime.feelslike_c
                  }}</span>
                </p>
              </div>
              <div
                class="flex w-full flex-wrap justify-center rounded-e-lg border-2 border-stone-400/50 p-2 text-center text-2xl font-bold"
              >
                <p>&deg;F</p>
                &nbsp;
                <p :class="tempTextColor(weatherData.realtime.temp_f, 'F')">
                  {{ weatherData.realtime.temp_f }}
                </p>
                <div class="h-0 basis-full"></div>
                <p class="text-sm">
                  Feels like &deg;F
                  <span :class="tempTextColor(weatherData.realtime.feelslike_f, 'F')">{{
                    weatherData.realtime.feelslike_f
                  }}</span>
                </p>
              </div>
            </div>
            <h3 class="text-3xl font-light xl:text-2xl">
              <i class="fa-solid fa-smog text-stone-500/75"></i>&nbsp;&nbsp;Humidity
            </h3>
            <div class="grid w-2/3 grid-cols-1 md:w-1/2 lg:w-1/3 xl:w-full">
              <div
                class="flex w-full flex-wrap justify-center rounded-lg border-2 border-stone-400/50 p-2 text-center text-2xl font-bold"
              >
                <p>{{ weatherData.realtime.humidity }}&nbsp;%</p>
                <div class="h-0 basis-full"></div>
                <div class="h-2 w-full rounded-full bg-slate-500/50">
                  <div
                    class="h-2 rounded-full bg-slate-600 dark:bg-slate-300"
                    :style="{ width: `${weatherData.realtime.humidity}%` }"
                  ></div>
                </div>
              </div>
            </div>
            <h3 class="text-3xl font-light xl:text-2xl">
              <i class="fa-solid fa-cloud text-white"></i>&nbsp;&nbsp;Cloud Cover
            </h3>
            <div class="grid w-2/3 grid-cols-1 md:w-1/2 lg:w-1/3 xl:w-full">
              <div
                class="flex w-full flex-wrap justify-center rounded-lg border-2 border-stone-400/50 p-2 text-center text-2xl font-bold"
              >
                <p>{{ weatherData.realtime.cloudCover }}&nbsp;%</p>
                <div class="h-0 basis-full"></div>
                <div class="h-2 w-full rounded-full bg-slate-500/50">
                  <div
                    class="h-2 rounded-full bg-slate-600 dark:bg-slate-300"
                    :style="{ width: `${weatherData.realtime.cloudCover}%` }"
                  ></div>
                </div>
              </div>
            </div>
            <h3 class="text-3xl font-light xl:text-2xl">
              <i class="fa-solid fa-cloud-showers-heavy text-sky-400"></i>&nbsp;&nbsp;Precipitation
            </h3>
            <div class="grid w-2/3 grid-cols-1 md:w-1/2 lg:w-1/3 xl:w-full">
              <div
                class="flex w-full flex-wrap justify-center rounded-lg border-2 border-stone-400/50 p-2 text-center text-2xl font-bold"
              >
                <p>{{ weatherData.realtime.precip }}&nbsp;%</p>
                <div class="h-0 basis-full"></div>
                <div class="h-2 w-full rounded-full bg-slate-500/50">
                  <div
                    class="h-2 rounded-full bg-slate-600 dark:bg-slate-300"
                    :style="{ width: `${weatherData.realtime.precip}%` }"
                  ></div>
                </div>
              </div>
            </div>
            <h3 class="text-3xl font-light xl:text-2xl">
              <i class="fa-solid fa-wind text-sky-100"></i>&nbsp;&nbsp;Wind
            </h3>
            <div class="grid w-11/12 grid-cols-2 md:w-1/2 xl:w-full">
              <div
                class="flex w-full flex-wrap justify-center rounded-s-lg border-2 border-stone-400/50 p-2 text-center text-2xl font-bold"
              >
                <div class="grid w-full grid-flow-col grid-cols-2 grid-rows-2 place-items-center">
                  <p>{{ weatherData.realtime.wind_mph }}</p>
                  <p class="text-sm">mph</p>
                  <p>{{ weatherData.realtime.wind_kph }}</p>
                  <p class="text-sm">kph</p>
                </div>
              </div>
              <div
                class="flex w-full flex-wrap items-center justify-center rounded-e-lg border-2 border-stone-400/50 p-2 text-center text-5xl font-bold"
              >
                <p>{{ weatherData.realtime.wind_dir }}</p>
              </div>
            </div>
            <h3 class="text-3xl font-light xl:text-2xl">
              <i class="fa-solid fa-eye"></i>&nbsp;&nbsp;Visibility
            </h3>
            <div class="grid w-1/2 grid-cols-1 md:w-1/3 lg:w-1/4 xl:w-2/3">
              <div
                class="flex w-full flex-wrap justify-center rounded-lg border-2 border-stone-400/50 p-2 text-center text-2xl font-bold"
              >
                <div class="grid w-full grid-flow-col grid-cols-2 grid-rows-2 place-items-center">
                  <p>{{ weatherData.realtime.vis_m }}</p>
                  <p class="text-sm">miles</p>
                  <p>{{ weatherData.realtime.vis_km }}</p>
                  <p class="text-sm">km</p>
                </div>
              </div>
            </div>
            <h3 class="text-3xl font-light xl:text-2xl">
              <i class="fa-solid fa-cloud-sun text-amber-400/75"></i>&nbsp;&nbsp;UV index
            </h3>
            <div class="grid w-32 grid-cols-1">
              <div
                class="flex w-full flex-wrap justify-center rounded-lg border-2 border-stone-400/50 p-2 text-center text-2xl font-bold"
              >
                <p :class="uvTextColor()">{{ weatherData.realtime.uv }}</p>
              </div>
            </div>
          </div>
        </div>
        <!-- REALTIME END -->
        <!-- FORECAST START -->
        <div
          id="forecast"
          class="flex flex-col items-center justify-start"
          :class="{ hidden: mode !== 'forecast' }"
        >
          <div class="mt-12 flex h-10 w-3/4 flex-row lg:w-5/12">
            <a
              class="flex w-14 items-center justify-center rounded rounded-e-none border-2 border-e-0 border-slate-200 bg-slate-200 text-slate-600 dark:border-slate-600 dark:bg-slate-300"
              ><i class="fa-solid fa-magnifying-glass"></i
            ></a>
            <input
              type="text"
              placeholder="City / State / ZIP"
              v-model="search"
              class="w-full border-2 border-x-0 border-slate-200 bg-slate-50 px-2 focus:outline-none dark:border-slate-600 dark:bg-slate-200"
              @keypress="
                (event) => {
                  error = false;
                  if (event.key == 'Enter') {
                    if (!search) return;
                    getCurrentWeatherInfo(search);
                  }
                }
              "
            />
            <a
              class="flex w-16 cursor-pointer items-center justify-center rounded rounded-s-none border-2 border-s-0 border-slate-200 bg-emerald-400/75 font-bold text-slate-800 transition-[width] hover:w-24 dark:border-slate-600"
              @click="
                () => {
                  if (!search) return;
                  getCurrentWeatherInfo(search);
                }
              "
              >Go</a
            >
          </div>
          <a
            class="my-8 cursor-pointer rounded-lg bg-sky-600/30 p-2 font-medium elevation-4 dark:text-slate-200"
            :class="{ hidden: weatherData.available }"
            @click="getLocation()"
            >Use my current location</a
          >
          <Spinner size="md" :class="{ hidden: !loading }" />
          <div
            class="mt-8 flex w-2/3 flex-col items-center break-all rounded border-2 border-red-600/60 bg-red-500/40 p-2 text-center"
            :class="{ hidden: !error }"
          >
            <h4 class="text-xl font-medium">Error</h4>
            <h5>
              Could not find location <strong>{{ errorSearch }}</strong>
            </h5>
          </div>
          <div class="flex flex-col items-center" :class="{ hidden: !weatherData.available }">
            <h2 class="mt-8 text-center text-2xl font-semibold text-slate-800 dark:text-slate-300">
              <vue-custom-tooltip label="Not your location?">
                <i
                  class="fa-solid fa-location-dot cursor-pointer text-slate-900 dark:text-red-500"
                  :class="{ hidden: !isCurrentLocation }"
                  @click="resetLocation()"
                ></i>
              </vue-custom-tooltip>
              {{ weatherData.location.region }}
            </h2>
            <h3 class="text-md text-center text-slate-600 dark:text-slate-400">
              {{ weatherData.location.country }}
            </h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      mode: window.location.pathname.split('/')[2],
      theme: localStorage.theme || 'light',
      api: `https://api.weatherapi.com/v1/current.json?key=a24feac5eafe4a288f8160227231805`,
      isCurrentLocation: false,
      search: '',
      loading: false,
      error: false,
      errorSearch: '',
      weatherData: {
        realtime: {
          condition: '',
          icon: '',
          temp_c: 0,
          temp_f: 0,
          feelslike_c: 0,
          feelslike_f: 0,
          humidity: 0,
          cloudCover: 0,
          precip: 0,
          wind_mph: 0,
          wind_kph: 0,
          wind_dir: '',
          vis_m: 0,
          vis_km: 0,
          uv: 0,
          last_updated: ''
        },
        available: false,
        location: {
          region: '',
          country: ''
        }
      }
    };
  },
  mounted() {
    if (!['light', 'dark'].includes(localStorage.theme)) localStorage.theme = this.theme = 'light';

    if (localStorage.location) {
      this.getCurrentWeatherInfo(localStorage.location, true);
    }
  },
  beforeCreate() {
    if (!['realtime', 'forecast'].includes(window.location.pathname.split('/')[2])) {
      window.location.href = '/404';
    }
  },
  methods: {
    async getCurrentWeatherInfo(search: string, current: boolean = false) {
      await fetch(this.api + `&q=${search}`)
        .then((res) => res.json())
        .then((data) => {
          this.weatherData.location.region = data.location.region
            ? [data.location.name, data.location.region].join(', ')
            : data.location.name;
          this.weatherData.location.country = data.location.country;

          this.weatherData.realtime.condition = data.current.condition.text;
          this.weatherData.realtime.icon =
            'https://' +
            (data.current.condition.icon as string).slice(2).replace('64x64', '128x128');

          this.weatherData.realtime.temp_c = data.current.temp_c;
          this.weatherData.realtime.temp_f = data.current.temp_f;
          this.weatherData.realtime.feelslike_c = data.current.feelslike_c;
          this.weatherData.realtime.feelslike_f = data.current.feelslike_f;
          this.weatherData.realtime.humidity = data.current.humidity;

          this.weatherData.realtime.cloudCover = data.current.cloud;
          this.weatherData.realtime.precip = data.current.precip_in;
          this.weatherData.realtime.wind_mph = data.current.wind_mph;
          this.weatherData.realtime.wind_kph = data.current.wind_kph;
          this.weatherData.realtime.wind_dir = data.current.wind_dir;
          this.weatherData.realtime.vis_m = data.current.vis_miles;
          this.weatherData.realtime.vis_km = data.current.vis_km;
          this.weatherData.realtime.uv = data.current.uv;

          this.weatherData.realtime.last_updated = data.current.last_updated;

          this.error = false;
          this.loading = false;
          this.isCurrentLocation = current;

          this.weatherData.available = true;
        })
        .catch(() => {
          this.weatherData.available = false;
          this.errorSearch = this.search;
          this.error = true;
        });
    },
    tempTextColor(temp: number, unit: 'F' | 'C') {
      const temps = {
        '30': 'text-cyan-400',
        '40': 'text-sky-400',
        '50': 'text-amber-300',
        '60': 'text-amber-500',
        '70': 'text-orange-600',
        '80': 'text-red-500',
        '90': 'text-red-600'
      };

      if (unit === 'C') {
        temp = this.cToF(temp);
      }

      let closestTemp: number = 50;
      let minDif = Infinity;

      for (const tempIndex in temps) {
        const dif = Math.abs(Number(tempIndex) - temp);

        if (dif < minDif) {
          minDif = dif;
          closestTemp = Number(tempIndex);
        }
      }

      return temps[closestTemp as keyof null];
    },
    uvTextColor() {
      const uvs = {
        1: 'text-green-500',
        3: 'text-yellow-500',
        5: 'text-amber-400',
        6: 'text-orange-600',
        8: 'text-red-600'
      };

      let closestUV: number = 50;
      let minDif = Infinity;

      for (const uvIndex in uvs) {
        const dif = Math.abs(Number(uvIndex) - this.weatherData.realtime.uv);

        if (dif < minDif) {
          minDif = dif;
          closestUV = Number(uvIndex);
        }
      }

      return uvs[closestUV as keyof null];
    },
    cToF(c: number) {
      return c * (9 / 5) + 32;
    },
    getLocation() {
      if (navigator.geolocation) {
        this.loading = true;
        navigator.geolocation.getCurrentPosition((pos) => {
          localStorage.location = [
            pos.coords.latitude.toFixed(3),
            pos.coords.longitude.toFixed(3)
          ].join();

          this.getCurrentWeatherInfo(localStorage.location, true);
        });
      }
    },
    resetLocation() {
      localStorage.removeItem('location');
      window.location.reload();
    }
  }
};
</script>
