<template>
  <div class="print-page">
    <div class="print-page-body">
      <div class="print-page-content">
        <table>
          <tr>
            <td />
            <td />
            <td />
            <td />
            <td />
          </tr>
        </table>
      </div>
    </div>

  </div>
</template>
<script>
export default {

}
</script>
<style lang="scss" scoped>
.print-page-body{
    border-top: solid 1px #e0e0e0;
    background: #f0f0f0;
    overflow: auto;
    .print-page-content{
      background: #fff;
      margin: 20px;
      padding: 0 67px;
    }
    table{
      table-layout: fixed;
      border-collapse: collapse;
      border-spacing: 0;
      width: 100%;
      td{
        border: solid 1px #e0e0e0;
        height: 25px;
        width: 120px;
      }
    }
}
</style>

