<template>
  <h4 class="text-center">测试</h4>
  <div>
  <el-form-item label="日期">
                         <el-date-picker
                            v-model="formData.start"
                            type="datetime"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            >
                        </el-date-picker>
                        -
                        <el-date-picker
                            v-model="formData.end"
                            type="datetime"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            >
                        </el-date-picker>
            
   </el-form-item>
   <el-form-item>
        <el-button type="primary" @click="search()">搜索</el-button>
  </el-form-item>  
</div>


</template>

<script>
export default {
  name: 'MyOrders',
  data(){
    return{
      page:{
        pageNo: 1,//当前页
        pageSize: 10,
        totalCount: 0,//总条数
      },
      formData:{
        start:'',
        end:'',
      }
    }
  },
  methods:{
    search(){
        let data = {
            asin:this.formData.sNumber,
            mapping_code:this.formData.shangpin,
            name_cn:this.formData.gname,
            start_time:this.formData.start,
            end_time:this.formData.end,
            company_name:this.formData.supplier,
            current_page: this.current_page
        }
        getDetail(data).then(res =>{
            console.log(res)
            if(res.data.code == 200){
                this.tableData = res.data.data.dataList
                this.page.totalCount = res.data.data.total_size
            }else{
                this.$message({
                type:'error',
                message:res.data.msg
                })
            this.tableData = []
            this.page.totalCount = 0
            }
        })
        
    },
  }
}
</script>

<style lang="less" scoped>
</style>