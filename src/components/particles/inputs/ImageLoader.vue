<template>
  <div>
    <div class="signup-loader sign-up-header--m43" ref="imgContainer"
         @click="$refs.inputUpload.click()">
      <photo-camera v-if="!avatar"/>
    </div>
    <input v-show="false"
           ref="inputUpload"
           type="file"
           accept="image/*"
           @change="loadImage"/>
  </div>
</template>

<script>
import PhotoCamera from '../../particles/icons/PhotoCamera';

export default {
  name: "ImageLoader",
  components: {
    PhotoCamera,
  },
  props: {
    avatar: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    loadImage ($event) {
      let tgt = $event.target || window.event.srcElement, files = tgt.files;

      if (FileReader && files && files.length) {
        let fr = new FileReader();
        fr.onload = () => {
          this.$refs.imgContainer.style['background-image'] = `url(${ fr.result })`;
        };
        fr.readAsDataURL(files[0]);
      }
    }
  }
};
</script>
