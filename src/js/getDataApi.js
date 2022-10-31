import api from './api'
const dateApi ={
    /**
   * 根据Id获取
   * @param {Id} nodeId
   */
     async  getNodeByNodeId(nodeId)
     {
         let node
         await api.getNodeByNodeId(nodeId).then(
           res => {
            node = res.data.valueMap.data
           }
         )
         return node
     },
  /**
   * 根据Id获取
   * @param {Id} proExecutionId 
   */
    async  getProExecutionByProExecutionId(proExecutionId)
    {
        let proExecution
        await api.getProExecutionByProExecutionId(proExecutionId).then(
          res => {
            proExecution = res.data.valueMap.data
          }
        )
        return proExecution
    },
    /**
         * 根据传入流程ID查找流程
         * @param executionId
         * @return Executions
         */
     async getProExecutionsByExecutionId(executionId)
    {
        let proExecutions;
        await api.getProExecutionsByExecutionId(executionId).then(res=>{
        // console.log("传入成功getProExecutions:")
        // console.log(res.data.valueMap.data)
        proExecutions = res.data.valueMap.data
        })
        return proExecutions;
    },
    /**
     * 根据proExecutionId查找Tasks
     * @param proExecutionId
     * @return tasks
     * */
     async getTasksByProExecutionId(proExecutionId){
        let tasks;
        await api.getTasksByProExecutionId(proExecutionId).then(res=>{
        tasks  = res.data.valueMap.data
        // console.log("传入成功tasks")
        // console.log(tasks)
        })
        return tasks;
    },
    /**
     * 根据传入某个proExecution的tasks将则一小段的tasks图像化为node和edge
     * 会根据tasks正确更新data中的nodes和edges
     * @param {传入的tasks} tasks 
     * @param {tasks所属的proExecution} proExecution
     * @param {传入的data,包含了nodes和edges} dataForNodesEdges
     * @return {data} dataForNodesEdges 添加了新的nodes和edegs后的data
     */
    addNodesEdgesByTasks(tasks,dataForNodesEdges,proExecution)
    {
        const sequences_processnodes_map = new Map();//
        //map:1->[node1的node_antvx6_id,node2的node_antvx6_id]
        //map:sequence -> nodes[]

        //加入node进入nodes,并且整理不同seq的node进行分类
        for (let i = 0; i < tasks.length; i++) 
        {
            let processNodeId = tasks[i].processNode.id
            let proExecutionId = tasks[i].proExecutionId
            let processNode_sequence = tasks[i].processNode.sequence
            let processNodeName  = tasks[i].processNode.node.name
            //先处理sequences_processnodes_map,将该节点记录在根据seq对应的map_value
            let sequencesNodes_ids = sequences_processnodes_map.get(processNode_sequence)
            let node_antvx6_id = proExecutionId + '_' +processNodeId//antvx6用来记录node的id是 proExecutionId_processNodeId,比如:189_1
            if(sequencesNodes_ids == null) {
                sequencesNodes_ids = []
                sequencesNodes_ids.push(node_antvx6_id)
                sequences_processnodes_map.set(processNode_sequence,sequencesNodes_ids)
            }
            else{
                sequencesNodes_ids.push(node_antvx6_id)
                sequences_processnodes_map.set(processNode_sequence,sequencesNodes_ids)
            }
            //处理nodes
            dataForNodesEdges.nodes.push({
              id: node_antvx6_id,//记录的id是 proExecutionId_processNodeId,比如:189_1
              shape: 'rect',
              width: 60,
              height: 30,
              label: processNodeName,//标签为processNodeName比如 设计部
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

          //先让本ProExeution的第一Seq节点去找到parentProcessNode，连接上1个ProExeution的末尾
        //连接上1个ProExeution的末尾
        //找到last_Node,让本ProExeution的seq=1的所有节点去连接上一个ProExeution的末尾last_node
        {
          let last_processNodeId = proExecution.lastProcessNodeId
          let last_proExecutionId = proExecution.lastProExecutionId
          let last_node_antvx6_id = last_proExecutionId+ '_' +last_processNodeId
          if(last_node_antvx6_id !== '0_0')//如果前一个存在
          {
            let firstSeq_node_ids = sequences_processnodes_map.get(1)//seq =1首层
            firstSeq_node_ids.forEach((target_node)=>
            {
              dataForNodesEdges.edges.push(
                {
                    source: last_node_antvx6_id,
                    target: target_node,
                    attrs: {
                      line: {
                        stroke: '#fd6d6f',
                        strokeWidth: 1,
                      },
                    },
                }
            )
            })
          }
        }

          //让每一个seq去和（seq-1）节点连线
          sequences_processnodes_map.forEach((sequencesNodes_ids,processNode_sequence)=>
        {
            //获得相对前一seq的nodes_ids
            let last_node_ids = sequences_processnodes_map.get(processNode_sequence-1)
            if(last_node_ids==null)
            {
                ;//留空，作用相当于continue
            }
            else
            {   //以此对(seq-1)的每一个节点开始连线
              last_node_ids.forEach((last_node_id)=>{
                let source_node = last_node_id
                //对于(seq-1)的某个节点进行连接seq的所有节点
                sequencesNodes_ids.forEach((cur_node_it)=>
                {
                  let target_node = cur_node_it
                  dataForNodesEdges.edges.push(
                      {
                          source: source_node,
                          target: target_node,
                          attrs: {
                            line: {
                              stroke: '#fd6d6f',
                              strokeWidth: 1,
                            },
                          },
                      }
                  )
                })
              })
            }

        })
        return dataForNodesEdges;
    },
    /**
     * 根据一份execution中对应的多个ProExecution组成的proExections,获取到每一个的ProExecution的tasks并存入TasksList
     * 通过execution获取到所有的tasks并构成tasksList
     * @param {一份execution中对应的多个ProExecution组成的proExections} proExections
     */
    async getTasksListByProExecutions(proExecutions)
    {
        var i;
        var proExecutionsLength = proExecutions.length;
        var temp_tasks = []
        var Tasks_List = [];
        // console.log('this is proExecutions')
        // console.log(proExecutions)
        for(i=0;i<proExecutionsLength;i++)
        {
          var proExecution = proExecutions[i];
          var temp_tasks = await this.getTasksByProExecutionId(proExecution.id)
          // console.log("当前是：第"+(i+1)+'个的tasks')
          // console.log(temp_tasks)
          Tasks_List.push(temp_tasks)
        }
        // console.log("这是TasksList")
        // console.log(Tasks_List)
        return Tasks_List;
    }
}
export default dateApi