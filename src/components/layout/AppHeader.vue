<template>
  <header
    class="fixed left-0 top-0 z-[100] h-[var(--header-height)] w-full min-w-[var(--container-width)] border-b border-hairline bg-white"
  >
    <div class="container relative flex h-[var(--header-height)] items-start">
      <img
        class="mt-[22px] h-[52px] w-[358px] object-contain"
        :src="logoUrl"
        alt="国投智慧招采平台"
      />
      <nav class="ml-[18px] mt-4 flex h-16 items-start" aria-label="主导航">
        <a
          v-for="item in navItems"
          :key="item"
          :class="[navItemClass, item === '首页' && activeNavItemClass]"
          href="#"
        >
          {{ item }}
        </a>
      </nav>
      <a
        class="ml-2 mt-4 flex h-16 w-24 items-center text-lg font-medium text-nav no-underline visited:text-nav"
        href="#"
        >用户登录</a
      >
      <a
        class="absolute right-0 top-0 flex h-[95px] w-[120px] items-center justify-center bg-primary text-lg font-semibold text-white no-underline visited:text-white"
      >
        用户注册
      </a>
    </div>
  </header>
</template>

<script setup lang="ts">
import logoUrl from "@/assets/figma/logo.png";

const navItems = ["首页", "公司信息", "采购信息", "法规中心", "新闻中心", "帮助中心"];
const navItemClass =
  "flex h-16 w-24 items-center justify-center text-xl leading-none text-nav no-underline visited:text-nav";
const activeNavItemClass =
  "mr-3 mt-3 !h-10 !w-[88px] rounded-[20px] !bg-primary font-semibold !text-white visited:!text-white";
</script>
