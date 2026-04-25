<template>
  <footer
    class="h-[392px] overflow-hidden bg-footer-bg bg-cover bg-[center_top] text-black"
    :style="{ backgroundImage: `url(${footerBg})` }"
  >
    <div class="container flex justify-center gap-[38px] pt-[45px]">
      <label v-for="item in links" :key="item">
        <select class="h-8 w-[220px] border-0 bg-white px-3.5 text-sm text-black outline-none">
          <option>{{ item }}</option>
        </select>
      </label>
    </div>
    <p class="m-0 mt-[62px] text-center text-lg leading-7">
      中投咨询有限公司（国投集团采购服务中心） © Copyright .京ICP备20019515号-1
    </p>
    <div class="container mt-5 flex justify-center gap-[30px] text-lg leading-7">
      <span>地址：北京市丰台区汽车博物馆东路8号院金茂府广场2号楼10层</span>
      <span>电话：400-688-6166</span>
      <a class="text-black no-underline" href="#"
        >工具下载：下载 <b class="text-lg font-normal text-link-blue">↧</b></a
      >
    </div>
    <div class="mt-[30px] flex justify-center gap-5">
      <img class="h-[92px] w-[92px]" :src="qrCode" alt="二维码" />
      <img class="h-[92px] w-[92px]" :src="qrCode" alt="二维码" />
    </div>
  </footer>
</template>

<script setup lang="ts">
import footerBg from "@/assets/figma/footer_bg.png";
import qrCode from "@/assets/figma/qrcode.png";

const links = ["监督管理部门", "公共服务平台", "政府交易平台", "集团成员企业"];
</script>
