<template>
  <button type="button" class="btn btn-light btn-sm" @click="goBack">后退</button>
  <h4 class="text-center">流程详情 --- {{executionId}}</h4>
  <div id="container"></div>
  <div>选中的节点id：{{currentNode.id}}</div>
  <div>选中的节点name:{{currentNode.name}}</div>
  <div>选中的节点type：{{currentNode.type}}</div>
  <div>选中的节点ip：{{currentNode.ip}}</div>
  <div>选中的节点port：{{currentNode.port}}</div>
  <div>选中的节点path：{{currentNode.path}}</div>

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
            myAlert: {
              title:"成功提示",
              content:"成功查询",
              show: false,
            },
            graph: null,
            currentNode:
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
                this.currentNode = res.data.valueMap.data;
                let alert_content = "id:" + this.currentNode.id +'\n' +'name:'+this.currentNode.name+"\n"
                +"type:" + this.currentNode.type +'\n' +'ip:'+this.currentNode.ip +'\n' +'port:'+this.currentNode.port+'\n'
                +"path:" + this.currentNode.path +'\n'
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
                this.currentNode = res.data.valueMap.data;
                let alert_content = "id:" + this.currentNode.id +'\n' +'name:'+this.currentNode.name+"\n"
                +"type:" + this.currentNode.type +'\n' +'ip:'+this.currentNode.ip +'\n' +'port:'+this.currentNode.port+'\n'
                +"path:" + this.currentNode.path +'\n'
                this.myAlertPop("查询到该节点信息",alert_content)
                console.log(this.currentNode)
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
  }
}
</script>

<style lang="less" scoped>
</style>