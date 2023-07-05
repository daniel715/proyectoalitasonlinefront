<template>
  <div>
    <label v-if="label != ''" :class="`v-label ${themeClass}`">{{
      label
    }}</label>
    <div
      class="upload-image d-flex align-center justify-center"
      @dragover="onDragover"
      @dragleave="onDragleave"
      @drop="onDrop"
      :id="`container_${imageFileId}`"
    >
      <v-btn
        @click="close"
        icon
        v-if="img || url"
        x-small
        style="
          position: absolute;
          top: 2px;
          right: 3px;
          width: 12px !important;
          height: 12px !important;
        "
        ><v-icon small>mdi-close</v-icon></v-btn
      >
      <input
        type="file"
        name="imageFile"
        :id="imageFileId"
        style="display: none"
        @change="onChange"
        ref="file"
        accept="image/*"
      />
      <span
        v-if="!isMobile || img == null "
        class="upload-image__text"
        :style="`${img || url? 'position:absolute;left:40px;transition:auto' : ''}`"
        >Suelta tu imagen o
        <span class="upload-image__browse" @click="triggerImageFile"
          >busca aquí</span
        ></span
      >
      <div
        v-else
        class="d-flex flex-column"
        :style="`${img || url ? 'position:absolute;left:16px;transition:auto' : ''}`"
      >
        <span class="upload-image__text">Suelta tu imagen o </span>
        <span class="upload-image__browse" @click="triggerImageFile"
          >busca aquí</span
        >
      </div>
      <!-- <zoom-img
        v-if="img || url"
        :src="url"
        :max-width="widthImage"
        :max-height="heightImage"
        :width="widthImage"
        :height="heightImage"
        class="upload-image__image"
        :class="`${themeClass}`"
      /> -->
    </div>
  </div>
</template>

<script>
// import ZoomImg from "@/components/common/images/ZoomImg";
export default {
  name: "UploadImage",
  components: {
    // ZoomImg,
  },
  props: {
    widthImage: {
      type: String,
      default: "100px",
    },
    heightImage: {
      type: String,
      default: "120px",
    },
    label: {
      type: String,
      default: "",
    },
    base64: {
      type: Boolean,
      default: false,
    },
    urlByProp:{
      type:String,
      default:null
    }

  },
  data: () => ({
    dragoverClassName: "upload-image__dragover",
    imageFileId: "f",
    img: null,
    url: null,
    isMobile: false
  }),
  methods: {
    close() {
      this.img = null;
      this.url = "";
      document
        .getElementById(`container_${this.imageFileId}`)
        .classList.remove("upload-image__success");
    },
    onDrop(e) {
      e.preventDefault();
      e.currentTarget.classList.remove(this.dragoverClassName);
      this.$refs.file.files = e.dataTransfer.files;
      this.onChange();
    },
    onChange() {
      let images = this.$refs.file.files;
      if (images.length > 0) {
        this.img = images[0];
        this.showTempImage();
        document
          .getElementById(`container_${this.imageFileId}`)
          .classList.add("upload-image__success");
      } else {
        this.img = null;
        this.url = null;
        return;
      }
      setTimeout(() => {
        this.$emit("input", this.base64 ? this.url : this.img);
      }, 500);
      /* setTimeout(() => {
        this.$emit("input", this.base64 ? this.url : this.img);
      }, 500); */
    },
    showTempImage() {
      let reader = new FileReader();
      let me = this;
      reader.onload = function (e) {
        me.url = e.target.result;
        console.log("onload");
      };
      reader.readAsDataURL(this.img);
    },
    triggerImageFile() {
      document.getElementById(this.imageFileId).click();
    },
    onDragover(e) {
      e.preventDefault();
      /* alert('asd') */
      /* let { classList } = e.currentTarget; */
      if (!e.currentTarget.classList.contains(this.dragoverClassName)) {
        e.currentTarget.classList.add(this.dragoverClassName);
      }
    },
    onDragleave(e) {
      e.currentTarget.classList.remove(this.dragoverClassName);
    },
  },
  watch:{
    urlByProp(newVal){
      this.url = newVal
      /* if(newVal) this.url = newVal */
    }
  },
  created() {
    this.imageFileId = new Date().getTime();
  },
};
</script>