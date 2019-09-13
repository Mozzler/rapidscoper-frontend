<template>
  <span class="mark-indicator">
    <component :is="icon" class="mark__icon"></component>
    <i class="mark__text">{{ Number(value) }}</i>
  </span>
</template>

<script>
import EstimateIcon from "../icons/Estimate";
import AttachmentIcon from "../icons/Attachment";

export default {
  name: "Number",
  components: {
    EstimateIcon,
    AttachmentIcon
  },
  props: {
    value: {
      default: 0,
      required: true
    },
    icon: {
      default: '',
      required: true
    }
  }
};
</script>
