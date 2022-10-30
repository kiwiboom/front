<template>
  <!-- （隐藏的）alert样式 -->
  <div>
    <my-alert :title="myAlert.title" :show="myAlert.show" :content="myAlert.content" @submit="submit" @hideModal="hideModal"></my-alert>
  </div>
</template>

<script>
import MyAlert from "../utils/MyAlert.vue"
export default {
    name: 'modal',
    components:{
      'my-alert':MyAlert,
    },
    data() {
        return {
            myAlert: {
              title:"成功提示",
              content:"成功查询",
              show: true,
            }
        }
    },
    methods: {
        hideModal() {
          console.log("点击取消")
          this.myAlert.show=false
        },
        submit() {
          console.log("点击确认")
          this.myAlert.show=false
        },
        myAlertPop(title,content)
        {
          this.myAlert.title=title
          this.myAlert.content=content
          this.myAlert.show=true
        },
        // this.myAlertPop("提示","流程成功查询")
        // this.active=1;//步骤条=1
    }
}
</script>

<style scoped>
</style>
