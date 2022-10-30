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
                            至
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
        <th>操作</th>
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
          <van-icon class="icon-c" name="chat-o" size="1.5rem"></van-icon>
        </td>
      </tr>
    </tbody>
  </table>
    <div div-lc-mark id="clickLastOrNextPage">
      <el-button-group>
        <el-button type="primary" @click="onEventClickLastPage">上一页</el-button>
        <el-button type="primary" @click="onEventClickNextPage">下一页</el-button>
      </el-button-group>
    </div>
  </div>

  <el-steps :active="active" finish-status="success" id="steps">
      <el-step title="请查询"></el-step>
      <el-step title="请点进具体流程"></el-step>
    </el-steps>

  <!-- （隐藏的）alert样式 -->
  <div>
    <my-alert :title="myAlert.title" :show="myAlert.show" :content="myAlert.content" @submit="submit" @hideModal="hideModal"></my-alert>
  </div>
</template>

<script>
import api from '/src/js/api.js'
import MyAlert from "../utils/MyAlert.vue"
  export default {
    props: [],
    components: {
      'my-alert':MyAlert,
    },
    data() {
      return {
        active: 0,//初始化当前的步骤index=0
        myAlert: {
              title:"提示",
              content:"内容",
              show: false,
            },//出现提示用的
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
      //点击弹窗的方法
        myAlertPop(title,content)
        {
          this.myAlert.title=title
          this.myAlert.content=content
          this.myAlert.show=true
        },
        hideModal() {
          console.log("点击取消")
          this.myAlert.show=false
        },
        submit() {
          console.log("点击确认")
          this.myAlert.show=false
        },
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
        this.myAlertPop("提示","流程成功查询")
        this.active=1;//步骤条=1
    },
      onEventClickLastPage() {},
      onEventClickNextPage() {},
    },
    fillter: {},
}

</script>

<style scoped>
    #clickLastOrNextPage{
      position:absolute;
      bottom:100px; 
      right:50%;
    }
    #steps{
      position:absolute;
      bottom:0;
      width:75%;
    }
</style>