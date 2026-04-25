<template>
  <section class="h-[289px] border-t-8 border-hairline bg-white">
    <h2 class="m-0 pt-[66px] text-center text-[32px] font-medium leading-[48px] text-nav">
      合作伙伴
    </h2>
    <div class="container mt-12 flex h-[78px] items-center justify-between">
      <img
        v-for="partner in partners"
        :key="partner.alt"
        :class="partner.className"
        :src="partner.logo"
        :alt="partner.alt"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import ctgi from "@/assets/figma/partner_ctgi.png";
import ganneng from "@/assets/figma/partner_ganneng.png";
import guangxi from "@/assets/figma/partner_guangxi.png";
import truelore from "@/assets/figma/partner_truelore.png";
import xiongan from "@/assets/figma/partner_xiongan.png";

const partners = [
  { alt: "中投保", logo: ctgi, className: "h-[60px] w-[174px] object-contain" },
  { alt: "广西投资集团咨询有限公司", logo: guangxi, className: "h-14 w-[286px] object-contain" },
  { alt: "筑龙", logo: truelore, className: "h-[60px] w-[196px] object-contain" },
  { alt: "中国雄安集团", logo: xiongan, className: "h-12 w-[187px] object-contain" },
  { alt: "江西赣能股份有限公司", logo: ganneng, className: "h-[54px] w-[216px] object-contain" },
];
</script>
