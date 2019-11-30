<template>
  <div class="ibps-layout">
    <div v-if="$slots.west" ref="west" class="ibps-layout_west">
      <slot name="west" />
      <!-- <div
        title="滑动展开"
        style="position: absolute; padding: 0px; margin: 0px; font-size: 1px; text-align: left; overflow: hidden; z-index: 2; background: rgb(221, 221, 221); border: none; left: 0px; cursor: pointer; height: 571px; width: 21px; top: 0px;"
      >
        <div
          class="ui-layout-toggler ui-layout-toggler-west ui-layout-toggler-closed ui-layout-toggler-west-closed"
          title="展开"
          style="position: absolute; display: block; padding: 0px; margin: 0px; overflow: hidden; text-align: center; font-size: 1px; cursor: pointer; z-index: 1; background: rgb(170, 170, 170); visibility: visible; height: 21px; width: 21px; top: 0px; left: 0px;"
        />
      </div> -->
    </div>
    <div class="ibps-layout__body">
      <slot />
    </div>
    <div v-if="$slots.east" ref="east" class="ibps-layout_east">
      <slot name="east" />
    </div>
  </div>
</template>

<style lang="scss" >
.ibps-layout{
  display: flex;
    .ibps-container-full{
      border: 0  !important;
    }

  .ibps-layout__body{
    flex: 1;
    margin: 0;
  }
}
</style>
