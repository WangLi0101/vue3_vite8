<template>
  <section class="container" :class="compact ? 'pt-[45px]' : 'pt-[52px]'">
    <h2 class="m-0 text-[32px] font-medium leading-[45px] text-heading">{{ title }}</h2>
    <div class="mt-[50px] grid h-12 grid-cols-[800px_340px] items-center gap-x-[60px]">
      <div class="flex items-center gap-7" aria-label="公告类型">
        <button
          v-for="tab in tabs"
          :key="tab"
          :class="tabButtonClass(tab)"
          type="button"
          @click="selectTab(tab)"
        >
          {{ tab }}
        </button>
      </div>
      <div class="flex w-[340px] items-center justify-between" aria-label="采购分类">
        <button
          v-for="category in categoryOptions"
          :key="category"
          :class="categoryButtonClass(category)"
          type="button"
          @click="selectCategory(category)"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <ul class="m-0 list-none px-0 pb-0 pt-8">
      <li
        v-for="(item, index) in items"
        :key="`${item.title}-${index}`"
        class="grid min-h-[153px] grid-cols-[112px_1fr] border-b border-line"
      >
        <div class="pt-5 text-center text-primary">
          <span class="block text-sm font-medium leading-5">{{ item.status }}</span>
          <strong class="block text-[40px] font-bold leading-[47px] text-text">{{
            item.day
          }}</strong>
          <em class="block text-base not-italic leading-[22px] text-text">{{ item.month }}</em>
        </div>
        <article class="pt-[27px]">
          <div class="flex items-start justify-between gap-8">
            <h3
              class="m-0 max-w-[740px] overflow-hidden text-ellipsis whitespace-nowrap text-lg font-medium leading-[25px] text-text"
            >
              {{ item.title }}
            </h3>
            <time class="shrink-0 text-sm leading-5 text-text">{{ item.deadline }}</time>
          </div>
          <p class="mt-[23px] line-clamp-2 overflow-hidden text-base leading-8 text-muted">
            {{ item.description }}
          </p>
        </article>
      </li>
    </ul>

    <a
      class="mx-auto mt-8 flex w-max items-center justify-center text-lg leading-6 text-muted no-underline"
      href="#"
      >查看更多 <span class="ml-2 text-2xl leading-5">›</span></a
    >
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

export interface ProcurementItem {
  status: string;
  day: string;
  month: string;
  title: string;
  deadline: string;
  description: string;
}

const props = withDefaults(
  defineProps<{
    title: string;
    tabs: string[];
    items: ProcurementItem[];
    activeTab?: string;
    categories?: string[];
    compact?: boolean;
  }>(),
  {
    activeTab: "变更公告",
    categories: () => ["工程", "物资", "服务"],
  },
);

const emit = defineEmits<{
  change: [{ tab: string; category: string }];
}>();

const selectedTab = ref(props.activeTab);
const selectedCategory = ref("全部");
const categoryOptions = computed(() => ["全部", ...props.categories]);
const filterButtonBase = "cursor-pointer border-0 p-0";
const tabButtonBase = `${filterButtonBase} h-12 w-[110px] whitespace-nowrap text-lg leading-4`;
const categoryButtonBase = `${filterButtonBase} h-7 w-[66px] text-base`;
const inactiveButtonClass = "bg-transparent font-normal text-text";
const activeButtonClass = "rounded-full !bg-primary font-semibold !text-white";

const tabButtonClass = (tab: string) => [
  tabButtonBase,
  tab === selectedTab.value ? activeButtonClass : inactiveButtonClass,
];
const categoryButtonClass = (category: string) => [
  categoryButtonBase,
  category === selectedCategory.value ? activeButtonClass : inactiveButtonClass,
];

const emitChange = () => {
  emit("change", {
    tab: selectedTab.value,
    category: selectedCategory.value,
  });
};

const selectTab = (tab: string) => {
  selectedTab.value = tab;
  emitChange();
};

const selectCategory = (category: string) => {
  selectedCategory.value = category;
  emitChange();
};

watch(
  () => props.activeTab,
  (activeTab) => {
    selectedTab.value = activeTab;
  },
);
</script>
