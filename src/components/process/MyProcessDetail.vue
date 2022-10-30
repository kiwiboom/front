<template>
  <el-container>
    <el-header>
      <el-page-header @back="goBack" content="流程详情"></el-page-header>
    </el-header>
    <el-container>
      <el-aside width="200px">


        <el-card class="box-card">
          <template #header>
            <div class="clearfix">
              <el-tag type="danger">当前运行到的节点</el-tag>
                <!-- 这个是跳转查看所有节点按钮 -->
                <!-- 有bug，还没有赋值ProcessId -->
                <!-- <router-link :to="'/home/nodes'+ ProcessId">
                  <el-button type="primary" round size="small"
                  >查看该流程的所有节点信息</el-button>
                </router-link> -->
            </div>
              <div>选中的节点id：{{cur_run_node.id}}</div>
              <div>选中的节点name:{{cur_run_node.name}}</div>
              <div>选中的节点type：{{cur_run_node.type}}</div>
              <div>选中的节点ip：{{cur_run_node.ip}}</div>
              <div>选中的节点port：{{cur_run_node.port}}</div>
              <div>选中的节点path：{{cur_run_node.path}}</div>
            </div>
          </template>
        </el-card>
        <el-tag type="danger">选择下一节点</el-tag>
        <el-radio-group v-model="next_node_choice">
          <el-radio :label="3">备选项</el-radio>
          <el-radio :label="6">备选项</el-radio>
          <el-radio :label="9">备选项</el-radio>
        </el-radio-group>

        <el-button-group>
          <el-button type="primary" @click="onGoBackNodeClick" size="small"
            >返回上一节点</el-button
          >
          <el-button type="primary" @click="onGoNextNodeClick" size="small"
            >进入下一节点</el-button
          >
        </el-button-group>
      </el-aside>
      <el-container>
        <el-main>
          <div id="container"></div>
        </el-main>
        <el-footer>
          <el-tag type="success">进度条</el-tag>
          <van-progress :percentage="percentage"></van-progress>
        </el-footer>
      </el-container>
    </el-container>
  </el-container>

    <!-- （隐藏的）alert样式 -->
    <div>
      <my-alert :title="myAlert.title" :show="myAlert.show" :content="myAlert.content" @submit="submit" @hideModal="hideModal"></my-alert>
    </div>
 </template>

<script>
import { Graph } from "@antv/x6";
import api from '/src/js/api.js'
import dataApi from '/src/js/getDataApi.js' 
import { DagreLayout } from '@antv/layout'
import MyAlert from "../utils/MyAlert.vue"
export default {
  components:{
      'my-alert':MyAlert,
    },
  name: 'ProcessDetail',
  props:['executionId'],
  data(){
        return{
            percentage: 10,//百分比index
            myAlert: {
              title:"成功提示",
              content:"成功查询",
              show: false,
            },
            graph: null,
            cur_run_node:{//当前运行到的node
                id: 1,
                name: "潍柴设计部",
                type:1,
                ip:"127.0.0.1",
                port:1234,
                path:"/designDept"
            },
            cur_select_node://当前鼠标选定要查看信息的node
            {
                id: 1,
                name: "潍柴设计部",
                type:1,
                ip:"127.0.0.1",
                port:1234,
                path:"/designDept"
            },
            //一个executionId-》多个proExecutions
            // 一个proExecution-》多个tasks
            Tasks_List: [],//tasks的list，数组元素是tasks数组
            proExecutions: []//拿到的流程
        }
    },
    mounted() {
      this.initDate();//利用axios初始化流程
      this.initGraph();
      this.nodeAddEvent();//使得节点可以进行点击并且删除
      this.edgeAddEvent();//使得边可以进行点击与交互显示
      this.currentNodeFlashing(40,180);//启动选中将给定节点闪烁
      this.setLayout();//启动布局
  },
  methods:{
    /**
     *  利用axios初始化流程
     * */
     async initDate()
    {
      this.proExecutions = await dataApi.getProExecutionsByExecutionId(this.executionId);//根据传入流程ID查找proExecutions
      console.log('this is this.proExecutions')
      console.log(this.proExecutions)
      this.Tasks_List = await dataApi.getTasksListByProExecutions(this.proExecutions);//根据proExecutions拿到整个execution的Task_List
      console.log('this is this.Tasks_List')
      console.log(this.Tasks_List)
    },
    goBack(){
      this.$router.go(-1);
    },
    /**
     * 让图里面所有的边绑定点击事件
     * */
    edgeAddEvent(){
      this.graph.on('edge:click', ({ e, x, y, edge, view }) => { 
        edge.appendLabel('edge')
       edge.attr({
          line: {
            targetMarker: {
              tagName: 'image',
              'xlink:href': 'http://cdn3.iconfinder.com/data/icons/49handdrawing/24x24/left.png',
              width: 24,
              height: 24,
              y: -12,
            }
          }
        })
        edge.prop('labels/0', {
          attrs: {
            body: {
              stroke: 'orange',
            },
          },
        })
      })
    },
    /**
       * 让图里面所有的节点绑定点击事件
       */
    nodeAddEvent() {
      
      // 节点绑定点击事件
      this.graph.on('node:click', ({ e, x, y, node, view }) => {
        //读取nodeid
        // console.log(node.id)

        // 判断是否有选中过节点
        if (this.curSelectNode) {
          // 移除选中状态
          this.curSelectNode.removeTools()
          // 判断两次选中节点是否相同
          if (this.curSelectNode !== node) {
            node.addTools([{
              name: 'boundary',
              args: {
                attrs: {
                  fill: '#16B8AA',
                  stroke: '#2F80EB',
                  strokeWidth: 1,
                  fillOpacity: 0.1
                }
              }
            }, {
              name: 'button-remove',
              args: {
                x: '100%',
                y: 0,
                offset: {
                  x: 0,
                  y: 0
                }
              }
            }])
            //将最近选中的节点请求axios读取节点信息
            this.curSelectNode = node
            api.getNodeByNodeId(node.id).then(res =>{
                this.cur_select_node = res.data.valueMap.data;
                let alert_content = "id:" + this.cur_select_node.id +'\n' +'name:'+this.cur_select_node.name+"\n"
                +"type:" + this.cur_select_node.type +'\n' +'ip:'+this.cur_select_node.ip +'\n' +'port:'+this.cur_select_node.port+'\n'
                +"path:" + this.cur_select_node.path +'\n'
                this.myAlertPop("查询到该节点信息",alert_content)
                })
          } else {
            this.curSelectNode = null
          }
        } else {
          this.curSelectNode = node
          node.addTools([{
            name: 'boundary',
            args: {
              attrs: {
                fill: '#16B8AA',
                stroke: '#2F80EB',
                strokeWidth: 1,
                fillOpacity: 0.1
              }
            }
          }, {
            name: 'button-remove',
            args: {
              x: '100%',
              y: 0,
              offset: {
                x: 0,
                y: 0
              }
            }
          }])
          //将最近选中的节点请求axios读取节点信息
          this.curSelectNode = node
            api.getNodeByNodeId(node.id).then(res =>{
                this.cur_select_node = res.data.valueMap.data;
                let alert_content = "id:" + this.cur_select_node.id +'\n' +'name:'+this.cur_select_node.name+"\n"
                +"type:" + this.cur_select_node.type +'\n' +'ip:'+this.cur_select_node.ip +'\n' +'port:'+this.cur_select_node.port+'\n'
                +"path:" + this.cur_select_node.path +'\n'
                this.myAlertPop("查询到该节点信息",alert_content)
                console.log(this.cur_select_node)
                })
        }
      })
    },
    /**
     * 将图改成指定布局，并且读取axios刷新节点和边数据
     */
    async setLayout()
    {
      const dagreLayout = new DagreLayout({
          type: 'dagre',
          rankdir: 'LR',
          align: 'UL',
          ranksep: 30,
          nodesep: 15,
          controlPoints: true,
        })
        const data_with_nodes_edges = {
          nodes: [],
          edges: [],
        }
        //想要画出多个proExctions，但是有bug
      // Tasks_List.forEach(tasks => {
      //  dataApi.addNodesEdgesByTasks(tasks,data_with_nodes_edges)
      // });

      // 可以用没有bug
      // tasks  = await dataApi.getTasksByProExecutionId(189)
      // console.log("tasks: ")
      //  console.log(tasks)
      // dataApi.addNodesEdgesByTasks(tasks,data_with_nodes_edges)

      // dataApi.getTasksListByByProExecutions()


      //测试用
      for (let i = 1; i <= 12; i++) {
        data_with_nodes_edges.nodes.push({
            id: i + '',
            shape: 'rect',
            width: 60,
            height: 30,
            label: i,
            attrs: {
              body: {
                fill: '#855af2',
                stroke: 'transparent',
              },
              label: {
                fill: '#ffffff',
              },
            },
          })
        }
        data_with_nodes_edges.edges.push(
          ...[
            {
              source: '1',
              target: '2',
              attrs: {
                line: {
                  stroke: '#fd6d6f',
                  strokeWidth: 1,
                },
              },
            },
            {
              source: '2',
              target: '3',
              attrs: {
                line: {
                  stroke: '#fd6d6f',
                  strokeWidth: 1,
                },
              },
            },
            {
              source: '2',
              target: '4',
              attrs: {
                line: {
                  stroke: '#fd6d6f',
                  strokeWidth: 1,
                },
              },
            },
            {
              source: '4',
              target: '5',
              attrs: {
                line: {
                  stroke: '#fd6d6f',
                  strokeWidth: 1,
                },
              },
            },
            {
              source: '4',
              target: '6',
              attrs: {
                line: {
                  stroke: '#fd6d6f',
                  strokeWidth: 1,
                },
              },
            },
            {
              source: '4',
              target: '7',
              attrs: {
                line: {
                  stroke: '#fd6d6f',
                  strokeWidth: 1,
                },
              },
            },
            {
              source: '4',
              target: '8',
              attrs: {
                line: {
                  stroke: '#fd6d6f',
                  strokeWidth: 1,
                },
              },
            },
            {
              source: '5',
              target: '9',
              attrs: {
                line: {
                  stroke: '#fd6d6f',
                  strokeWidth: 1,
                },
              },
            },
            {
              source: '6',
              target: '10',
              attrs: {
                line: {
                  stroke: '#fd6d6f',
                  strokeWidth: 1,
                },
              },
            },
            {
              source: '7',
              target: '11',
              attrs: {
                line: {
                  stroke: '#fd6d6f',
                  strokeWidth: 1,
                },
              },
            },
            {
              source: '8',
              target: '12',
              attrs: {
                line: {
                  stroke: '#fd6d6f',
                  strokeWidth: 1,
                },
              },
            },
          ],
        )
      const newData = dagreLayout.layout(data_with_nodes_edges)
      this.graph.fromJSON(newData)
    },

      /**
       * 启动选中将给定节点地址闪烁
       * @param {想要闪烁的节点的x} nodeX 
       * @param {想要闪烁的节点的y} nodeY 
       */
       currentNodeFlashing(nodeX,nodeY)//
      {
        const polygon = this.graph.addNode({
          id: 0,
          shape: 'polygon',
          x: nodeX,
          y: nodeY+50,
          width: 30,
          height: 30,
          points:
            '26.934,1.318 35.256,18.182 53.867,20.887 40.4,34.013 43.579,52.549 26.934,43.798 10.288,52.549 13.467,34.013 0,20.887 18.611,18.182',
          attrs: {
            body: {
              stroke: 'none',
            },
          },
        })
        const view = this.graph.findView(polygon)
        if (view) {
          view.animate('polygon', {
            attributeType: 'XML',
            attributeName: 'fill',
            values: '#5F95FF;#EFF4FF',
            dur: '1s',
            repeatCount: 'indefinite',
          })
        }
      },
      
      
      /**
       * 初始化节点
      */
      initGraph() {
          this.graph = new Graph({
            selecting: {
                enabled: true,
                rubberband: true, // 启用框选
            },
          panning: {
                enabled: true,
                modifiers: 'shift',
            },
          container: document.getElementById('container'),
          width: 800,
          height: 600,
          background: {
            color: '#fffbe6', // 设置画布背景颜色
          },
          grid: {
            size: 10,      // 网格大小 10px
            visible: true, // 渲染网格背景
          },
        });
      },
      /**
       * 点击弹框事件
       * */
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
      /**
       * 按按钮返回上一节点
       * */
      onGoBackNodeClick()
      {

      },
      /**
       * 按按钮进入下一节点
       * */
      onGoNextNodeClick()
      {

      },
  }
}
</script>

<style lang="less" scoped>
</style>