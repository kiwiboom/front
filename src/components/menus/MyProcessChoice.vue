<template>
  <div class="container" style="min-height: 100%; padding-bottom: 100px;">
    <van-cell-group></van-cell-group>
    <el-input
      v-model="inputStartTime"
      placeholder="请输入开始时间"
      size="small"
      class="input"
    ></el-input>
    <div div-lc-mark>
      <el-input
        v-model="inputEndTime"
        placeholder="请输入终止时间"
        size="small"
        class="input"
      ></el-input>
    </div>
    <div div-lc-mark>
      <el-tag>状态选择</el-tag>
      <el-radio-group v-model="radio">
        <el-radio :label="3">Done</el-radio>
        <el-radio :label="6">NotDone</el-radio>
      </el-radio-group>
      <div div-lc-mark></div>
    </div>
    <div div-lc-mark>
      <el-button type="danger" round @click="onQueryButtonClick" size="small"
        >查询</el-button
      >
    </div>
    <div div-lc-mark>
      <el-button-group>
        <el-button type="primary" @click="onEventClickLastPage">上一页</el-button>
        <el-button type="primary" @click="onEventClickNextPage">下一页</el-button>
      </el-button-group>
    </div>
  </div>
</template>

<script>
  export default {
    props: [],
    components: {},
    data() {
      return {
        inputEndTime: "",
        inputStartTime: "",
        radio: 3,
      }
    },
    watch: {},
    computed: {},
    beforeCreate() {},
    created() {},
    beforeMount() {},
    mounted() {},
    beforeUpdate() {},
    updated() {},
    destroyed() {},
    methods: {
      request() {},
      onQueryButtonClick() {alert("请求查询成功")},
      onEventClickLastPage() {},
      onEventClickNextPage() {},
    },
    fillter: {},
  }
</script>

<style scoped>
  .input{}
  .container {  }
</style>