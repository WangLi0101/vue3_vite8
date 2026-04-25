<template>
  <section class="h-[500px] overflow-hidden" aria-label="首页焦点图">
    <Swiper
      :autoplay="{ delay: 5000, disableOnInteraction: false }"
      :loop="true"
      :modules="modules"
      :pagination="{ clickable: true }"
      class="h-[500px]"
    >
      <SwiperSlide v-for="slide in slides" :key="slide.id">
        <div
          class="relative h-[500px] bg-cover bg-[center_top]"
          :style="{ backgroundImage: `url(${slide.image})` }"
        >
          <div
            class="absolute inset-0 bg-[linear-gradient(90deg,rgb(0_91_204_/_78%)_0%,rgb(0_91_204_/_42%)_40%,rgb(0_91_204_/_5%)_78%)]"
          />
          <div
            class="absolute top-[219px] z-[1] text-white"
            style="left: max(calc((100vw - var(--container-width)) / 2), 60px)"
          >
            <h1
              class="m-0 flex items-center text-[46px] font-medium leading-[58px] [text-shadow:0_3px_8px_rgb(0_60_150_/_38%)]"
            >
              <template v-for="(word, index) in slide.title" :key="word">
                <span>{{ word }}</span>
                <i
                  v-if="index < slide.title.length - 1"
                  class="mx-[34px] h-3 w-3 rounded-full bg-white"
                />
              </template>
            </h1>
            <div class="mt-[38px] flex gap-[39px]">
              <span
                v-for="item in slide.features"
                :key="item"
                class="inline-flex min-w-64 items-center text-[26px] font-medium leading-[48px]"
              >
                <b class="mr-3.5 text-[42px] leading-none text-success">✓</b>
                {{ item }}
              </span>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </section>
</template>

<script setup lang="ts">
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";
import heroImage from "@/assets/figma/hero.png";

const modules = [Autoplay, Pagination];
const features = ["更可靠：三星认证", "更安全：三级等保", "更权威：专利认证"];

const slides = [
  { id: 1, image: heroImage, title: ["阳光采购", "绿色采购", "智慧采购"], features },
  { id: 2, image: heroImage, title: ["阳光采购", "绿色采购", "智慧采购"], features },
  { id: 3, image: heroImage, title: ["阳光采购", "绿色采购", "智慧采购"], features },
];
</script>

<style scoped lang="scss">
:deep(.swiper-pagination) {
  bottom: 45px;
}

:deep(.swiper-pagination-bullet) {
  width: 48px;
  height: 4px;
  margin: 0 3px;
  background: rgb(var(--color-slider));
  border-radius: 0;
  opacity: 1;
}

:deep(.swiper-pagination-bullet-active) {
  background: white;
}
</style>
