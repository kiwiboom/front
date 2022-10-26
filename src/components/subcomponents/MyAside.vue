<template>
  <div class="layout-aside-container">
    <!-- 左侧边栏列表 -->
    <ul class="user-select-none menu">
      <li class="menu-item">
        <router-link to="/home/processChoice">动态流程选择</router-link>
      </li>
      <li class="menu-item">
        <router-link to="/home/flowcharts">静态流程图</router-link>
      </li>
      <li class="menu-item">
        <router-link to="/home/nodes">节点列表</router-link></li>
        <li class="menu-item">
          <router-link to="/home/orders">测试</router-link></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'MyAside',
}
</script>

<style lang="less" scoped>
.layout-aside-container {
  width: 250px;
  height: 100%;
  border-right: 1px solid #eaeaea;
}

.menu {
  list-style-type: none;
  padding: 0;}
  .menu-item {
    line-height: 50px;
    font-weight: bold;
    font-size: 14px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;}
    :hover {
      background-color: #efefef;
      cursor: pointer;
    }
    a {
      display: block;
      color: black;
      padding-left: 30px;
    }
    :hover {
        text-decoration: none;
      }


.router-link-active {
  background-color: #efefef;
  box-sizing: border-box;
  position: relative;
}
  ::before {
    content: ' ';
    display: block;
    width: 4px;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: #42b983;
  }
</style>