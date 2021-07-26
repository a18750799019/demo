<template>
  <div class="about">
    <h1>This is an about page</h1>
     <ds-cesium @init="initMap" v-if="true" :animation="false" :orientation="$config.orientation" :options="$config.mapInitOpts" :center="$config.center"
     @click='onClick'></ds-cesium>
    
  </div>
</template>
<script>
// @ is an alias to /src
import dsCesium from '@3d-space/ds-cesium'
import '@3d-space/ds-cesium/dist/dsCesium.css'
export default {
  name: 'Home',
  methods: {
    }
}
</script>