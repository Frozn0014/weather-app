<template>
  <div id="theme" :class="{ dark: theme === 'dark' }">
    <div
      id="background"
      class="min-h-screen bg-gradient-to-b from-light to-indigo-300/50 pb-16 dark:bg-dark"
    >
      <div class="flex h-16 w-full items-center bg-sky-300/50 pl-4">
        <h1 class="pr-4 text-3xl font-semibold text-slate-700">Local Weather</h1>
        <i class="fa-solid fa-cloud-moon-rain text-3xl text-blue-400"></i>
      </div>
      <div class="container mx-auto px-4 font-sans">
        <div class="flex flex-col items-center justify-start">
          <div class="mt-12 flex h-10 w-3/4 flex-row">
            <a
              class="flex w-14 items-center justify-center rounded rounded-e-none border-2 border-e-0 border-slate-200 bg-slate-200 text-slate-600"
              ><i class="fa-solid fa-magnifying-glass"></i
            ></a>
            <input
              type="text"
              placeholder="City / State / ZIP"
              v-model="search"
              @keypress="
                (event) => {
                  error = false;
                  if (event.key == 'Enter') getCurrentWeatherInfo();
                }
              "
              class="w-full border-2 border-x-0 border-slate-200 px-2 focus:outline-none"
            />
            <a
              class="flex w-24 items-center justify-center rounded rounded-s-none border-2 border-s-0 border-slate-200 bg-emerald-400/75 font-bold text-slate-800"
              @click="getCurrentWeatherInfo()"
              >Go</a
            >
          </div>
          <div
            class="mt-8 flex w-2/3 flex-col items-center break-all rounded border-2 border-red-600/60 bg-red-500/40 p-2 text-center"
            :class="{ hidden: !error }"
          >
            <h4 class="text-xl font-medium">Error</h4>
            <h5>
              Could not find location <strong>{{ errorSearch }}</strong>
            </h5>
          </div>
          <div :class="{ hidden: !weatherData.available }">
            <h2 class="mt-8 text-center text-2xl font-semibold text-slate-800">
              {{ weatherData.location.region }}
            </h2>
            <h3 class="text-md text-center text-slate-600">{{ weatherData.location.country }}</h3>
            <h2 class="mt-8 text-center text-3xl text-slate-700">{{ weatherData.condition }}</h2>
            <img
              :src="weatherData.icon"
              :class="{ hidden: !weatherData.available }"
              class="mt-4 w-1/3"
            />
          </div>
          <div
            id="data"
            class="mt-2 flex w-11/12 flex-col items-center gap-8"
            :class="{ hidden: !weatherData.available }"
          >
            <h3 class="text-3xl font-light text-slate-600">
              <i class="fa-solid fa-temperature-three-quarters text-sky-400"></i
              >&nbsp;&nbsp;Temperature
            </h3>
            <div class="grid w-full grid-cols-2">
              <div
                class="flex w-full flex-wrap justify-center rounded-s-lg border-2 border-stone-400/50 p-2 text-center text-2xl font-bold text-slate-600"
              >
                <p>&deg;C</p>
                &nbsp;
                <p :class="tempTextColor(weatherData.temp_c, 'C')">{{ weatherData.temp_c }}</p>
                <div class="h-0 basis-full"></div>
                <p class="text-sm">
                  Feels like &deg;C
                  <span :class="tempTextColor(weatherData.feelslike_c, 'C')">{{
                    weatherData.feelslike_c
                  }}</span>
                </p>
              </div>
              <div
                class="flex w-full flex-wrap justify-center rounded-e-lg border-2 border-stone-400/50 p-2 text-center text-2xl font-bold text-slate-600"
              >
                <p>&deg;F</p>
                &nbsp;
                <p :class="tempTextColor(weatherData.temp_f, 'F')">{{ weatherData.temp_f }}</p>
                <div class="h-0 basis-full"></div>
                <p class="text-sm">
                  Feels like &deg;F
                  <span :class="tempTextColor(weatherData.feelslike_f, 'F')">{{
                    weatherData.feelslike_f
                  }}</span>
                </p>
              </div>
            </div>
            <h3 class="text-3xl font-light text-slate-600">
              <i class="fa-solid fa-smog text-stone-500/75"></i>&nbsp;&nbsp;Humidity
            </h3>
            <div class="grid w-2/3 grid-cols-1">
              <div
                class="flex w-full flex-wrap justify-center rounded-lg border-2 border-stone-400/50 p-2 text-center text-2xl font-bold text-slate-600"
              >
                <p>{{ weatherData.humidity }}&nbsp;%</p>
                <div class="h-0 basis-full"></div>
                <div class="h-2 w-full rounded-full bg-slate-500/50">
                  <div
                    class="h-2 rounded-full bg-slate-600"
                    :style="{ width: `${weatherData.humidity}%` }"
                  ></div>
                </div>
              </div>
            </div>
            <h3 class="text-3xl font-light text-slate-600">
              <i class="fa-solid fa-cloud text-white"></i>&nbsp;&nbsp;Cloud Cover
            </h3>
            <div class="grid w-2/3 grid-cols-1">
              <div
                class="flex w-full flex-wrap justify-center rounded-lg border-2 border-stone-400/50 p-2 text-center text-2xl font-bold text-slate-600"
              >
                <p>{{ weatherData.cloudCover }}&nbsp;%</p>
                <div class="h-0 basis-full"></div>
                <div class="h-2 w-full rounded-full bg-slate-500/50">
                  <div
                    class="h-2 rounded-full bg-slate-600"
                    :style="{ width: `${weatherData.cloudCover}%` }"
                  ></div>
                </div>
              </div>
            </div>
            <h3 class="text-3xl font-light text-slate-600">
              <i class="fa-solid fa-cloud-showers-heavy text-sky-400"></i>&nbsp;&nbsp;Precipitation
            </h3>
            <div class="grid w-2/3 grid-cols-1">
              <div
                class="flex w-full flex-wrap justify-center rounded-lg border-2 border-stone-400/50 p-2 text-center text-2xl font-bold text-slate-600"
              >
                <p>{{ weatherData.precip }}&nbsp;%</p>
                <div class="h-0 basis-full"></div>
                <div class="h-2 w-full rounded-full bg-slate-500/50">
                  <div
                    class="h-2 rounded-full bg-slate-600"
                    :style="{ width: `${weatherData.precip}%` }"
                  ></div>
                </div>
              </div>
            </div>
            <h3 class="text-3xl font-light text-slate-600">
              <i class="fa-solid fa-wind text-sky-100"></i>&nbsp;&nbsp;Wind
            </h3>
            <div class="grid w-11/12 grid-cols-2">
              <div
                class="flex w-full flex-wrap justify-center rounded-s-lg border-2 border-stone-400/50 p-2 text-center text-2xl font-bold text-slate-600"
              >
                <div class="grid w-full grid-flow-col grid-cols-2 grid-rows-2 place-items-center">
                  <p>{{ weatherData.wind_mph }}</p>
                  <p class="text-sm">mph</p>
                  <p>{{ weatherData.wind_kph }}</p>
                  <p class="text-sm">kph</p>
                </div>
              </div>
              <div
                class="flex w-full flex-wrap items-center justify-center rounded-e-lg border-2 border-stone-400/50 p-2 text-center text-5xl font-bold text-slate-600"
              >
                <p>{{ weatherData.wind_dir }}</p>
              </div>
            </div>
            <h3 class="text-3xl font-light text-slate-600">
              <i class="fa-solid fa-eye text-slate-600"></i>&nbsp;&nbsp;Visibility
            </h3>
            <div class="grid w-1/2 grid-cols-1">
              <div
                class="flex w-full flex-wrap justify-center rounded-lg border-2 border-stone-400/50 p-2 text-center text-2xl font-bold text-slate-600"
              >
                <div class="grid w-full grid-flow-col grid-cols-2 grid-rows-2 place-items-center">
                  <p>{{ weatherData.vis_m }}</p>
                  <p class="text-sm">miles</p>
                  <p>{{ weatherData.vis_km }}</p>
                  <p class="text-sm">km</p>
                </div>
              </div>
            </div>
            <h3 class="text-3xl font-light text-slate-600">
              <i class="fa-solid fa-cloud-sun text-amber-400/75"></i>&nbsp;&nbsp;UV index
            </h3>
            <div class="grid w-1/3 grid-cols-1">
              <div
                class="flex w-full flex-wrap justify-center rounded-lg border-2 border-stone-400/50 p-2 text-center text-2xl font-bold text-slate-600"
              >
                <p :class="uvTextColor()">{{ weatherData.uv }}</p>
              </div>
            </div>
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
      theme: 'light',
      api: `https://api.weatherapi.com/v1/current.json?key=a24feac5eafe4a288f8160227231805`,
      search: '',
      loading: false,
      error: false,
      errorSearch: '',
      weatherData: {
        available: false,
        location: {
          region: '',
          country: ''
        },
        localtime: '',
        day: true,
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
      }
    };
  },
  mounted() {},
  methods: {
    async getCurrentWeatherInfo() {
      await fetch(this.api + `&q=${this.search}`)
        .then((res) => res.json())
        .then((data) => {
          this.weatherData.location.region = data.location.region
            ? [data.location.name, data.location.region].join(', ')
            : data.location.name;
          this.weatherData.location.country = data.location.country;
          this.weatherData.localtime = data.location.localtime;

          this.weatherData.day = data.current.is_day === 1;

          this.weatherData.condition = data.current.condition.text;
          this.weatherData.icon =
            'https://' +
            (data.current.condition.icon as string).slice(2).replace('64x64', '128x128');

          this.weatherData.temp_c = data.current.temp_c;
          this.weatherData.temp_f = data.current.temp_f;
          this.weatherData.feelslike_c = data.current.feelslike_c;
          this.weatherData.feelslike_f = data.current.feelslike_f;
          this.weatherData.humidity = data.current.humidity;

          this.weatherData.cloudCover = data.current.cloud;
          this.weatherData.precip = data.current.precip_in;
          this.weatherData.wind_mph = data.current.wind_mph;
          this.weatherData.wind_kph = data.current.wind_kph;
          this.weatherData.wind_dir = data.current.wind_dir;
          this.weatherData.vis_m = data.current.vis_miles;
          this.weatherData.vis_km = data.current.vis_km;
          this.weatherData.uv = data.current.uv;

          this.weatherData.last_updated = data.current.last_updated;

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
        const dif = Math.abs(Number(uvIndex) - this.weatherData.uv);

        if (dif < minDif) {
          minDif = dif;
          closestUV = Number(uvIndex);
        }
      }

      return uvs[closestUV as keyof null];
    },
    cToF(c: number) {
      return c * (9 / 5) + 32;
    }
  }
};
</script>
