<script setup lang="ts">
import Navbar from './components/Navbar.vue';
import Spinner from './components/Spinner.vue';
</script>

<template>
  <div id="theme" :class="{ dark: theme === 'dark' }">
    <div id="background" class="min-h-screen bg-light pb-16 dark:bg-zinc-800">
      <Navbar :cf="mode === 'forecast'" />
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
              name="search"
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
              <i class="fa-solid fa-smog text-stone-500/75 dark:text-stone-400/75"></i
              >&nbsp;&nbsp;Humidity
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
              name="search"
              placeholder="City / State / ZIP"
              v-model="search"
              class="w-full border-2 border-x-0 border-slate-200 bg-slate-50 px-2 focus:outline-none dark:border-slate-600 dark:bg-slate-200"
              @keypress="
                (event) => {
                  error = false;
                  if (event.key == 'Enter') {
                    if (!search) return;
                    getForecast(search);
                  }
                }
              "
            />
            <a
              class="flex w-16 cursor-pointer items-center justify-center rounded rounded-s-none border-2 border-s-0 border-slate-200 bg-emerald-400/75 font-bold text-slate-800 transition-[width] hover:w-24 dark:border-slate-600"
              @click="
                () => {
                  if (!search) return;
                  getForecast(search);
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
          <div
            id="data"
            class="mt-12 flex w-2/3 flex-col items-center justify-center gap-x-8 gap-y-8 p-4 md:w-11/12 md:flex-row md:gap-y-4"
            :class="{ hidden: !weatherData.available }"
          >
            <div
              v-for="day in weatherData.forecast"
              class="grid w-full flex-shrink-0 flex-grow-0 grid-cols-4 place-items-center content-start items-center gap-y-2 rounded-xl border-2 border-zinc-700 bg-white/20 pb-2 pr-2 text-slate-600 dark:text-slate-200 md:w-48 md:rounded-md"
            >
              <h1 class="col-span-3 flex-[50%] text-xl font-medium">
                {{ `${day.date?.slice(5).replace('-', '/')}/${day.date?.slice(0, 4)}` }}
              </h1>
              <img :src="day.icon" class="mr-1 h-10 w-10 justify-self-end" />
              <i
                class="fa-solid fa-xl fa-temperature-three-quarters flex items-center text-sky-400"
              ></i>
              <h2
                class="text-md col-span-3 place-self-start font-semibold"
                :class="tempTextColor(unit === 'F' ? day.avgtemp_f : day.avgtemp_c, unit as 'C' | 'F')"
              >
                {{ unit === 'F' ? day.avgtemp_f : day.avgtemp_c }} &deg;<span id="unit">{{
                  unit
                }}</span>
              </h2>
              <i class="fa-solid fa-xl fa-temperature-arrow-up flex items-center text-sky-400"></i>
              <h2
                class="text-md col-span-3 place-self-start font-semibold"
                :class="tempTextColor(unit === 'F' ? day.maxtemp_f : day.maxtemp_c, unit as 'C' | 'F')"
              >
                {{ unit === 'F' ? day.maxtemp_f : day.maxtemp_c }} &deg;<span id="unit">{{
                  unit
                }}</span>
              </h2>
              <i class="fa-solid fa-smog text-stone-500/75 dark:text-stone-400/75"></i>
              <h2 class="text-md place-self-start font-semibold">{{ day.humidity }}%</h2>
              <div class="col-span-2 h-1 w-full rounded-full bg-slate-500/50">
                <div
                  class="h-1 rounded-full bg-slate-600 dark:bg-slate-300"
                  :style="{ width: `${day.humidity}%` }"
                ></div>
              </div>
              <i class="fa-solid fa-cloud-showers-heavy text-sky-400"></i>
              <h2 class="text-md col-span-3 place-self-start font-semibold">
                {{ day.precip }} inches
              </h2>
              <i class="fa-regular fa-snowflake text-gray-100"></i>
              <h2 class="text-md col-span-3 place-self-start font-semibold">
                {{ day.snow }} inches
              </h2>
              <i class="fa-solid fa-wind text-sky-100"></i>
              <h2 class="text-md col-span-3 place-self-start font-semibold">
                {{ unit === 'F' ? day.maxwind_mph : day.maxwind_kph }}
                {{ unit === 'F' ? 'mph' : 'kph' }}
              </h2>
            </div>
          </div>
        </div>
        <!-- FORECAST END -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { themeStore, unitStore } from './store';
import { LocationData, RealtimeData, ForecastData } from './types';
export default {
  data() {
    return {
      mode: window.location.pathname.split('/')[2],
      isCurrentLocation: false,
      search: '',
      loading: false,
      error: false,
      errorSearch: '',
      forecastDays: 3,
      weatherData: {
        realtime: {} as RealtimeData,
        forecast: [{} as ForecastData],
        available: false,
        location: {} as LocationData
      }
    };
  },
  computed: {
    theme() {
      return themeStore().theme;
    },
    unit() {
      return unitStore().unit;
    }
  },
  mounted() {
    if (localStorage.location) {
      switch (this.mode) {
        case 'realtime':
          this.getCurrentWeatherInfo(localStorage.location, true);
          return;
        case 'forecast':
          this.getForecast(localStorage.location, true);
          return;
      }
    }
  },
  beforeCreate() {
    if (!['realtime', 'forecast'].includes(window.location.pathname.split('/')[2])) {
      window.location.href = '/404';
    }
  },
  methods: {
    async getCurrentWeatherInfo(search: string, current: boolean = false) {
      this.query('current', search)
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
    async getForecast(search: string, current: boolean = false) {
      await this.query('forecast', search, [{ key: 'days', value: this.forecastDays.toString() }])
        .then((res) => res.json())
        .then((d) => {
          this.weatherData.location.region = d.location.region
            ? [d.location.name, d.location.region].join(', ')
            : d.location.name;
          this.weatherData.location.country = d.location.country;

          for (var i = 0; i < this.forecastDays; ++i) {
            const day = {} as ForecastData;
            const data = d.forecast.forecastday[i];

            day.date = data.date;

            day.condition = data.day.condition.text;
            day.icon =
              'https://' + (data.day.condition.icon as string).slice(2).replace('64x64', '128x128');

            day.maxtemp_c = data.day.maxtemp_c;
            day.maxtemp_f = data.day.maxtemp_f;
            day.avgtemp_c = data.day.avgtemp_c;
            day.avgtemp_f = data.day.avgtemp_f;

            day.maxwind_kph = data.day.maxwind_kph;
            day.maxwind_mph = data.day.maxwind_mph;

            day.precip = data.day.totalprecip_in;
            day.snow = data.day.totalsnow_cm;
            day.humidity = data.day.avghumidity;

            day.vis_km = data.day.avgvis_km;
            day.vis_m = data.day.avgvis_miles;

            day.rain_chance = data.day.daily_chance_of_rain;
            day.snow_chance = data.day.daily_chance_of_snow;

            day.uv = data.day.uv;

            this.weatherData.forecast[i] = day;
          }

          this.error = false;
          this.loading = false;
          this.isCurrentLocation = current;

          this.weatherData.available = true;
        })
        .catch((err) => {
          console.error(err);
          this.weatherData.available = false;
          this.errorSearch = this.search;
          this.error = true;
        });
    },
    query(method: string, query: string, params?: { key: string; value: string }[]) {
      var link = `https://api.weatherapi.com/v1/${method}.json?key=a24feac5eafe4a288f8160227231805&q=${query}`;

      params?.forEach(({ key, value }) => {
        link += `&${key}=${value}`;
      });

      return fetch(link);
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
