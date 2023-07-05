<template>
  <div class="d-flex flex-column">
    <label
      :class="`v-label ${isDark ? 'theme--dark' : 'theme--light'} ${
        noMarginLeft ? '' : 'pl-3'
      }`"
      class="pb-1 ml-1"
      v-if="label"
      >{{ label }}</label
    >
    <v-img
      v-if="url"
      :src="url"
      :max-width="width"
      :max-height="height"
      :width="width"
      :height="height"
      @click="triggerFileInput"
      class="py-3 custom-img px-3"
      :class="`${noMarginLeft ? '' : 'ml-2'} ${
        isDark ? 'theme--dark' : 'theme--light'
      }`"
    >
      <label :for="fileInputId">
        <input
          type="file"
          ref="fileInput"
          accept="image/*"
          :id="fileInputId"
          style="display: none"
          multiple
          @change="onChangeImage"
        />
      </label>
    </v-img>
    <v-card
      v-else
      flat
      tile
      class="d-flex rounded-lg justify-center align-center card-add-logo py-3 px-3"
      :class="`${noMarginLeft ? '' : 'ml-2'} ${
        isDark ? 'my-card-background' : ''
      }`"
      :height="height"
      :width="width"
    >
      <v-btn :disabled="disabledBtn" fab outlined color="teal" style="border: 2px dotted" readonly>
        <label :for="fileInputId">
          <v-icon color="teal" large>mdi-plus</v-icon>
          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            :id="fileInputId"
            style="display: none"
            multiple
            @change="onChangeImage"
          />
        </label>
      </v-btn>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "ImageInput",
  props: {
    disabledBtn:{
      type:Boolean,
      default:false,
    },
    value: {
      type: Object / File,
      default: null,
    },
    label: {
      type: String,
      default: null,
    },
    height: {
      type: String,
      default: "110px",
    },
    width: {
      type: String,
      default: "150px",
    },
    base64: {
      type: Boolean,
      default: false,
    },
    showUrl: {
      type: String,
      default: null,
    },
    /**elimina el margen y padding del lado izquierdo */
    noMarginLeft: {
      type: Boolean,
      default: false,
    },
    isDark:{
      type: Boolean,
      default: false,
    }
  },
  data: () => ({
    img: null,
    url: null,
    fileInputId: "f",
  }),
  methods: {
    triggerFileInput() {
      document.getElementById(this.fileInputId).click();
    },
    onChangeImage() {
      let images = this.$refs.fileInput.files;
      console.log(images)
      if (images != null) {
        this.img = images[0];
        this.showTempImage();
      } else {
        this.url = null;
        return;
      }
      setTimeout(() => {
        this.$emit("input", this.base64 ? this.url : this.img);
      }, 500);
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
  },
  watch: {
    value(newVal, oldVal) {
      if (!newVal) {
        this.url = null;
        this.img = null;
      } else if (typeof newVal == "string") {
        this.url = newVal;
        this.img = "some";
      }
    },
    showUrl(newVal, oldVal) {
      if (newVal) {
        this.url = newVal;
        this.img = "some";
      } else {
        this.url = this.value;
      }
    },
  },
  created() {
    this.fileInputId = new Date().getTime();
    if (this.showUrl) {
      this.url = this.showUrl;
      this.img = "some";
    }
  },
};
</script>

<style lang="scss">
$sizeHeight: 110px;
$sizeWidth: 170px;
/* .image-blank-container {
  border: 1.5px solid #b3b1b1;
  width: $sizeWidth;
  height: $sizeHeight;
  cursor: pointer;
} */
.card-add-logo {
  &.theme--light {
    border: 1px solid rgba(0, 0, 0, 0.38) !important;
  }
  &.theme--dark {
    border: 1px solid rgba(255, 255, 255, 0.24);
  }
  /* height: $sizeHeight;
  width: $sizeWidth; */
}
.custom-img {
  cursor: pointer;
  border-radius: 10px;
  /* background-size: contain; */
  &.theme--dark {
    border: 1px solid rgba(255, 255, 255, 0.24);
  }
  &.theme--light {
    border: 1px solid rgba(0, 0, 0, 0.38);
  }
}
.v-image__image--cover {
  background-size: contain !important;
}
</style>
