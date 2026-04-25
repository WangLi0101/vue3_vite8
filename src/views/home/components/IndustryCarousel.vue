<template>
  <section class="h-[519px] overflow-hidden bg-white pt-[86px]" aria-label="产业板块">
    <div class="container grid grid-cols-4 gap-5">
      <article
        v-for="item in industries"
        :key="item.title"
        class="relative h-[236px] overflow-hidden rounded-lg bg-[var(--accent)]"
        :style="{ '--accent': item.color }"
      >
        <img class="block h-40 w-full object-cover" :src="item.image" :alt="item.title" />
        <div
          class="absolute inset-0 flex flex-col justify-end bg-[linear-gradient(180deg,rgb(0_0_0_/_20%)_0%,rgb(0_0_0_/_6%)_50%,transparent_51%)] text-center text-white"
        >
          <p
            class="absolute left-5 top-[72px] m-0 w-[calc(100%-40px)] overflow-hidden text-ellipsis whitespace-nowrap text-xs font-semibold leading-[18px]"
          >
            {{ item.caption }}
          </p>
          <h3 class="m-0 h-[76px] bg-[var(--accent)] text-[26px] font-medium leading-[76px]">
            {{ item.title }}
          </h3>
        </div>
      </article>
    </div>
    <div class="mt-[34px] flex justify-center gap-2">
      <span class="h-1 w-12 bg-primary" />
      <span class="h-1 w-12 bg-slider" />
      <span class="h-1 w-12 bg-slider" />
    </div>
  </section>
</template>

<script setup lang="ts">
import industryCapital from "@/assets/figma/industry_capital.png";
import industryCharity from "@/assets/figma/industry_charity.png";
import industryPort from "@/assets/figma/industry_port.png";
import industrySeed from "@/assets/figma/industry_seed.png";

const industries = [
  {
    title: "国投种业",
    caption: "聚焦种业创新 赋能现代农业高质量发展",
    image: industrySeed,
    color: "rgb(185 79 5)",
  },
  {
    title: "国投种业",
    caption: "深耕港口航运，构建智慧物流生态",
    image: industryPort,
    color: "rgb(26 123 123)",
  },
  {
    title: "国投创益",
    caption: "以产业帮扶助推乡村振兴与共同富裕",
    image: industryCharity,
    color: "rgb(60 138 174)",
  },
  {
    title: "国投资本",
    caption: "国投金融板块协同发展，服务实体经济",
    image: industryCapital,
    color: "rgb(8 98 198)",
  },
];
</script>
