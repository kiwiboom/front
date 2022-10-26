<template>
    <div>
      <el-form-item label="日期">
                            <el-date-picker
                                v-model="formData.start"
                                type="datetime"
                                placeholder="选择日期"
                                value-format="YYYY-MM-DD HH:mm:ss"
                                >
                            </el-date-picker>
                            -
                            <el-date-picker
                                v-model="formData.end"
                                type="datetime"
                                placeholder="选择日期"
                                value-format="YYYY-MM-DD HH:mm:ss"
                                >
                            </el-date-picker>
                
      </el-form-item>
    <div div-lc-mark>
      <el-tag>状态选择</el-tag>
      <el-radio-group v-model="formData.radio">
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
      <tr v-for="(item,i) in proExecutionList" :key = 'item.id'>
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
        proExecutionList: [],//用来存储查询到的流程
        
        page:{
                pageNo: 1,//当前页
                pageSize: 10,
                totalCount: 0,//总条数
              },
        formData:{//日期时间
                    start:'',
                    end:'',
                    radio: 0,//状态存储，radio=1代表done，=0代表notDone
                  },
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
      onQueryButtonClick(){
        api.queryExecution(this.formData.radio,this.formData.start,this.formData.end).then(res =>{
          console.log("radio状态="+this.formData.radio)
          console.log("开始时间"+this.formData.start)
          console.log("end时间"+this.formData.end)
          console.log("res="+res)
          console.log(res)
          if(res.data.code == 200){
            this.proExecutionList = res.data.valueMap.data
              // this.page.totalCount = res.data.data.total_size//TODO分页
          }
          else{
            console.log("错误")
              this.$message({
              type:'error',
              message:res.data.msg
              })
                this.proExecutionList = []
                this.page.totalCount = 0
              }
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