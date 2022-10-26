<template>
  <button type="button" class="btn btn-light btn-sm" @click="goBack">后退</button>
  <h4 class="text-center">流程详情 --- {{id}}</h4>
  <div id="container"></div>
  <div>选中的节点id：{{currentNode.id}}</div>
  <div>选中的节点name:{{currentNode.name}}</div>
  <div>选中的节点type：{{currentNode.type}}</div>
  <div>选中的节点ip：{{currentNode.ip}}</div>
  <div>选中的节点port：{{currentNode.port}}</div>
  <div>选中的节点path：{{currentNode.path}}</div>
 </template>

<script>
import { Graph } from "@antv/x6";
import api from '/src/js/api.js'
import { DagreLayout } from '@antv/layout'
export default {
  name: 'ProcessDetail',
  props:['id'],
  data(){
        return{
            graph: null,
            currentNode:
            {
                id: 1,
                name: "潍柴设计部",
                type:1,
                ip:"127.0.0.1",
                port:1234,
                path:"/designDept"
            }
        }
    },
    mounted() {
      this.initGraph();
      this.nodeAddEvent();//启动节点可以进行点击并且删除
      this.currentNodeFlashing(40,180);//启动选中将给定节点闪烁
      this.myLayout();//启动布局
  },
  methods:{
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
        console.log("nodeid="+node.id)
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
                console.log(this.currentNode)
                })
        }
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
                this.currentNode = res.data.valueMap.data;
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
                console.log(this.currentNode)
                })
        }
      })
    },
    /**
     * 将图改成指定布局，并且读取axios刷新节点和边数据
     */
    myLayout()
    {
      const dagreLayout = new DagreLayout({
          type: 'dagre',
          rankdir: 'LR',
          align: 'UL',
          ranksep: 30,
          nodesep: 15,
          controlPoints: true,
        })
        const data = {
          nodes: [],
          edges: [],
        }

        for (let i = 1; i <= 12; i++) {
          data.nodes.push({
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

        data.edges.push(
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
      const newData = dagreLayout.layout(data)
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
          // 1. 节点 nodes 和边 edges 字段 的 JSON 数据
          //默认节点和边数据
          // const data = {
          //     // 节点
          //     nodes: [
          //         {
          //             id: "1", // String，可选，节点的唯一标识
          //             x: 40, // Number，必选，节点位置的 x 值
          //             y: 180, // Number，必选，节点位置的 y 值
          //             width: 80, // Number，可选，节点大小的 width 值
          //             height: 40, // Number，可选，节点大小的 height 值
          //             attrs: {
          //               body: {
          //               fill: '#2ECC71',
          //               stroke: '#000',
          //               strokeDasharray: '10,2',
          //               },
          //               label: {
          //               text: '潍柴设计部',
          //               fill: '#333',
          //               fontSize: 13,
          //               },
          //           }
          //         },
          //         {
          //             id: "2", // String，节点的唯一标识
          //             x: 160, // Number，必选，节点位置的 x 值
          //             y: 180, // Number，必选，节点位置的 y 值
          //             width: 80, // Number，可选，节点大小的 width 值
          //             height: 40, // Number，可选，节点大小的 height 值
          //             label: "潍柴零件供应商",// String，节点标
          //         },
          //         {
          //             id: "3", // String，可选，节点的唯一标识
          //             x: 320, // Number，必选，节点位置的 x 值
          //             y: 100, // Number，必选，节点位置的 y 值
          //             width: 80, // Number，可选，节点大小的 width 值
          //             height: 40, // Number，可选，节点大小的 height 值
          //             label: "潍柴主机厂" // String，节点标签
          //         },
          //         {
          //             id: "4", // String，可选，节点的唯一标识
          //             x: 320, // Number，必选，节点位置的 x 值
          //             y: 300, // Number，必选，节点位置的 y 值
          //             width: 80, // Number，可选，节点大小的 width 值
          //             height: 40, // Number，可选，节点大小的 height 值
          //             label: "潍柴实验相关部门" // String，节点标签
          //         },
          //     ],
          //     // 边
          //     edges: [
          //         {
          //             source: "1", // String，必须，起始节点 id
          //             target: "2" // String，必须，目标节点 id
          //         },
          //         {
          //             source: "2", // String，必须，起始节点 id
          //             target: "3" // String，必须，目标节点 id
          //         },
          //         {
          //             source: "2", // String，必须，起始节点 id
          //             target: "4" // String，必须，目标节点 id
          //         },
          //     ]
          // };
         // 2. 渲染画布
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
          // 3. 渲染我们的节点和边
          // this.graph.fromJSON(data);
      },


  },
}
</script>

<style lang="less" scoped>
</style>