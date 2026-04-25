<template>
  <div class="relative min-w-[var(--container-width)] overflow-x-hidden bg-white text-heading">
    <HeroCarousel />
    <main class="relative z-[1] bg-white">
      <ProcurementList title="招标采购" :tabs="bidTabs" :items="bidItems" />
      <ProcurementList title="非招标采购" :tabs="nonBidTabs" :items="bidItems" compact />
      <IndustryCarousel />
      <NewsSection />
      <PartnersSection />
    </main>
    <SiteFooter />
    <FloatingContact />
  </div>
</template>

<script setup lang="ts">
import ProcurementList from "@/components/procurement/ProcurementList.vue";
import FloatingContact from "./components/FloatingContact.vue";
import HeroCarousel from "./components/HeroCarousel.vue";
import IndustryCarousel from "./components/IndustryCarousel.vue";
import NewsSection from "./components/NewsSection.vue";
import PartnersSection from "./components/PartnersSection.vue";
import SiteFooter from "./components/SiteFooter.vue";

const bidTabs = ["招标公告", "变更公告", "候选人公示", "结果公告", "招标计划", "其它公示"];
const nonBidTabs = ["非招标公告", "变更公告", "候选人公示", "结果公告", "招标计划", "其它公示"];

const bidItems = Array.from({ length: 3 }, () => ({
  status: "发布",
  day: "08",
  month: "2022-10",
  title: "“砥砺十年路，扬帆再起航”江苏华信自驾游活动圆满举行",
  deadline: "截止时间：2016-04-12",
  description:
    "江苏华信科技有限公司2023年新春团拜会议今日顺利召开，公司总经理室、各业务公司负责人、及公司全体员工共同参加。江苏华信科技有限公司2023年新春团拜会议今日顺利召开，公司总经理室、各业务公司负责人、及公司全体员工共同参加。",
}));
</script>
