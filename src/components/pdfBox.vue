<template>
  <div class="all" v-loading="isload">
    <template v-if="!isIfream">
      <pdf :src="innerSrc"></pdf>
      <!--
              <pdf
        style="overflow:auto;"
        v-for="i in numPages"
        :key="i"
        :src="innerSrc"
        :page="i"
        @num-pages="pageCount = $event"
        @page-loaded="currentPage = $event"
        @loaded="loadPdfHandler"
        ref="wrapper"
        class="pdf"
      ></pdf>
      -->

    </template>
    <template v-if="isIfream">
      <iframe :src="src" width="100%" height="100%"></iframe>
    </template>
  </div>
</template>
<script>
/**
 * <pdfBox :src="src"></pdfBox>
 */
import pdf from "vue-pdf";
import CMapReaderFactory from "vue-pdf/src/CMapReaderFactory.js";
export default {
  name: "pdfBox",
  props: ["src", "isIfream"],
  data() {
    return {
      testsrc:'',
      currentPage: 1,
      pageCount: 0,
      //src: "", // pdf文件地址
      scale: 100, //放大系数
      idx: -1,
      clauseTitle: "",
      loadedRatio: 0,
      numPages: 1,
      innerSrc: null,
      isload: false
    };
  },
  components: {
    pdf
  },
  watch: {
    src: {
      handler(val) {
        //临时方案 更换主机地址
        val=val.replace(/dev.3dspace.top:52341/,"122.51.146.178:31349")
        this.isload = true;
        this.innerSrc = pdf.createLoadingTask({ url: val, CMapReaderFactory });
        setTimeout(() => {
          this.innerSrc.promise.then(p => {
            this.numPages = p.numPages;
            this.isload = false;
          });
        }, 1000);
      },
      immediate: true
    }
  },
  methods: {
    close() {
      this.$emit("close", true);
    },
    loadPdfHandler(e) {
      this.currentPage = 1; // 加载的时候先加载第一页
    }
  }
};
</script>
<style lang="scss" scoped>
.all {
  height: 100%;
  overflow: auto;
}
</style>
