<template>
  <button type="button" class="btn btn-light btn-sm" @click="goBack">后退</button>
  <h4 class="text-center">节点详情 --- {{id}}</h4>
  <tr>
    <!-- item = portlist[i+1]
    <td>{{id}}</td>
    <td>{{item.name}}</td>
    <td>{{item.type}}</td>
    <td>{{item.ip}}</td>
    <td>{{item.port}}</td>
    <td>{{item.path}}</td> -->
  </tr>
 </template>

<script>
export default {
  name: 'MyNodeDetail',
  props:['id'],
  methods:{
    goBack(){
      this.$router.go(-1);
    }
  },
  data(){
    return{
      portlist: [
        { id: 1, name: '潍柴设计部', type: 1,ip: '127.0.0.1',port: 1234, path: "/designDept"},
        { id: 2, name: '潍柴零件供应商', type: 1,ip: '127.0.0.1',port: 1234, path: "/partsSupplier"},
        { id: 3, name: '潍柴主机厂', type: 1,ip: '127.0.0.1',port: 1234, path: "/hostPlant"},
        { id: 4, name: '潍柴实验相关部门', type: 1,ip: '127.0.0.1',port: 1234, path: "/experimentDept"},
      ],
    }
  }
}
</script>

<style lang="less" scoped>
</style>