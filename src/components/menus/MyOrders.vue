<template>
  <h4 class="text-center">测试</h4>

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
        test(){
          
        }
    }
}
</script>

<style scoped>
</style>
