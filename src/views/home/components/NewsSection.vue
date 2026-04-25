<template>
  <section class="h-[736px] bg-white">
    <div class="container grid grid-cols-[560px_560px] gap-20 pt-[71px]">
      <article class="h-[625px] rounded-lg bg-panel p-6">
        <img class="block h-72 w-[512px] rounded object-cover" :src="newsMain" alt="国投大厦夜景" />
        <time class="mt-7 block text-sm leading-5 text-muted">2026-02-01</time>
        <h2 class="m-0 mt-[11px] text-4xl font-medium leading-[45px] text-heading">
          2026年全球市场展望
        </h2>
        <p class="mt-3.5 line-clamp-4 overflow-hidden text-base leading-[26px] text-subtle">
          深度分析全球经济走势与投资机遇，探讨地缘政治、货币政策等关键因素对市场的影响。我们从宏观经济数据、产业发展趋势以及资本流动等多维度，为投资者揭示未来市场的主要驱动力和潜在风险点。
        </p>
        <a
          class="mt-[18px] inline-flex items-center text-sm font-medium leading-5 text-primary no-underline"
          href="#"
          >查看详情 <span class="ml-2">→</span></a
        >
      </article>

      <div class="pt-[58px]">
        <div class="mb-[26px] flex gap-5">
          <button
            class="border-0 bg-transparent p-0 text-xl font-medium leading-[48px] text-subtle"
            type="button"
          >
            最新动态
          </button>
          <button
            class="border-0 bg-transparent p-0 text-xl font-medium leading-[48px] text-primary underline underline-offset-8"
            type="button"
          >
            通知公告
          </button>
        </div>
        <article
          v-for="item in newsItems"
          :key="item.title"
          class="mb-[27px] grid min-h-[166px] grid-cols-[1fr_128px] gap-5 border-b border-divider pb-[27px] last:mb-0 last:border-b-0"
        >
          <div>
            <time class="text-sm font-bold leading-5 text-muted">{{ item.date }}</time>
            <h3 class="m-0 mt-2 text-lg font-medium leading-[23px] text-heading">
              {{ item.title }}
            </h3>
            <p class="mt-3 line-clamp-2 overflow-hidden text-sm leading-[23px] text-subtle">
              {{ item.desc }}
            </p>
            <a
              class="mt-[18px] inline-flex items-center text-sm font-medium leading-5 text-primary no-underline"
              href="#"
              >查看详情 <span class="ml-2">→</span></a
            >
          </div>
          <img class="h-32 w-32 rounded-md object-cover" :src="item.image" :alt="item.title" />
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import newsHouse from "@/assets/figma/news_house.png";
import newsMain from "@/assets/figma/news_main.png";
import newsPhone from "@/assets/figma/news_phone.png";
import newsStock from "@/assets/figma/news_stock.png";

const newsItems = [
  {
    date: "2026-01-28",
    title: "科技创新驱动投资机遇",
    desc: "聚焦人工智能、量子计算等前沿科技领域的投资价值与发展趋势。",
    image: newsStock,
  },
  {
    date: "2026-01-25",
    title: "ESG投资趋势分析",
    desc: "解读可持续发展投资理念，分析环境、社会和公司治理对投资决策的重要性。",
    image: newsPhone,
  },
  {
    date: "2026-01-20",
    title: "新兴市场投资指南",
    desc: "探索新兴市场的增长潜力，为投资者提供风险评估与机遇把握的实用建议。",
    image: newsHouse,
  },
];
</script>
