<template>
  <!-- 标题 -->
  <h4 class="text-center">节点列表</h4>

  <!-- 用户列表 -->
  <table class="table table-bordered table-striped table-hover">
    <thead>
      <tr>
        <th>节点id</th>
        <th>节点名称</th>
        <th>类型</th>
        <th>ip</th>
        <th>port</th>
        <th>path</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item,i) in processNodes" :key = 'item.id'>
        <td>{{i+1}}</td>
        <td>{{item.node.name}}</td>
        <td>{{item.node.type}}</td>
        <td>{{item.node.ip}}</td>
        <td>{{item.node.port}}</td>
        <td>{{item.node.path}}</td>
        <td>
          <router-link :to="'/home/nodes/' + item.id">查看详情</router-link>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import seq from 'lodash-es/seq'
import api from '/src/js/api.js'
export default {
  name: 'MyNodes',
  mounted(){
    api.getAllNodesByProcessId(1).then(res =>{
      this.processNodes = res.data.valueMap.processNodes;
      console.log(this.processNodes)
    })
  },
  data() {
    return {
      processNodes:[],//读取axios的数据

      // js文件中示例的用户列表数据
      portlist: [
        { id: 1, name: '潍柴设计部', type: 1,ip: '127.0.0.1',port: 1234, path: "/designDept"},
        { id: 2, name: '潍柴零件供应商', type: 1,ip: '127.0.0.1',port: 1234, path: "/partsSupplier"},
        { id: 3, name: '潍柴主机厂', type: 1,ip: '127.0.0.1',port: 1234, path: "/hostPlant"},
        { id: 4, name: '潍柴实验相关部门', type: 1,ip: '127.0.0.1',port: 1234, path: "/experimentDept"},
      ],
    }
  },
}
</script>

<style lang="less" scoped>
</style>