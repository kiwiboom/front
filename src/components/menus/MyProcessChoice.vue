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
        <el-radio :label="0">NotDone</el-radio>
        <el-radio :label="1">Done</el-radio>
      </el-radio-group>
      <div div-lc-mark></div>
    </div>
    <div div-lc-mark>
      <el-button type="danger" round @click="onQueryButtonClick" size="small"
        >查询</el-button
      >
    </div>
    <!-- 用户列表 -->
  <table class="table table-bordered table-striped table-hover">
    <thead>
      <tr>
        <th>顺序</th>
        <th>执行记录id</th>
        <th>执行记录开始时间</th>
        <th>执行记录结束时间</th>
        <th>是否完成</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item,i) in processList" :key = 'item.id'>
        <td>{{i+1}}</td>
        <td>{{item.id}}</td>
        <td>{{item.from}}</td>
        <td>{{item.to}}</td>
        <td>{{item.done}}</td>
        <td>
          <router-link :to="'/home/process/' + item.id">查看详情</router-link>
        </td>
      </tr>
    </tbody>
  </table>
    <div div-lc-mark>
      <el-button-group>
        <el-button type="primary" @click="onEventClickLastPage">上一页</el-button>
        <el-button type="primary" @click="onEventClickNextPage">下一页</el-button>
      </el-button-group>
    </div>
  </div>
</template>

<script>
import api from '/src/js/api.js'
  export default {
    props: [],
    components: {},
    data() {
      return {
        processList: [],//用来存储查询到的流程
        inputEndTime:"",
        inputStartTime: "",
        radio: 0,//状态存储，radio=1代表done，=0代表notDone
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
      onQueryButtonClick() {
        // console.log(this.inputStartTime)
        api.queryExecution(this.radio,this.inputStartTime,this.inputEndTime).then(res =>{
          console.log("radio状态="+this.radio)
          console.log("开始时间="+this.inputStartTime)
          console.log("终止时间="+this.inputEndTime)
          console.log("res="+res)
          this.processList = res.data.valueMap.data
        })
        alert("请求查询成功")
      },
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