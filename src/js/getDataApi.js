import api from './api'
const dateApi ={
    /**
         * 根据传入流程ID查找流程
         * @param executionId
         * @return Executions
         */
    getProExecutionsByExecutionId(executionId)
    {
        api.getProExecutionsByExecutionId(executionId).then(res=>{
        console.log("传入成功getProExecutions:")
        var proExecutions = res.data.valueMap.data
        console.log(proExecutions)
        return proExecutions;
        })
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
     * 根据传入的tasks将则一小段的tasks图像化为node和edge
     * 会根据tasks正确更新data中的nodes和edges
     * @param {传入的tasks} tasks 
     * @param {传入的data,包含了nodes和edges} dataForNodesEdges
     * @return {data} dataForNodesEdges 添加了新的nodes和edegs后的data
     */
    addNodesEdgesByTasks(tasks,dataForNodesEdges)
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
          // console.log(sequences_processnodes_map)
          //先让本ProExeution的第一Seq节点去找到parentProcessNode，连接上1个ProExeution的末尾
          //让每一个seq去和（seq-1）节点连线
          sequences_processnodes_map.forEach((sequencesNodes_ids,processNode_sequence)=>
        {
            //连接上1个ProExeution的末尾
            //找到parentProcessNode
            // let parentProcessNode = tasks[0].processNode.process.parentProcessNode
            // {
            //  TODO



            //获得前一seq的nodes_ids
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
     * 根据一份execution中对应的多个ProExecutions,获取到每一个的ProExecution的tasks并存入TasksList
     * 通过execution获取到所有的tasks并构成tasksList
     * @param
     */
    getTasksListByExecutions(execution)
    {
        var i;
        var proExecutionsLength = proExecutions.length;
        console.log("这是proExceutionsLength:"+proExecutionsLength)
        var temp_tasks = []
        var Tasks_List = [];
        console.log('this is proExecutions')
        console.log(proExecutions)
        for(i=0;i<proExecutionsLength;i++)
        {
          proExecution = proExecutions[i];
          temp_tasks = getTasksByProExecutionId(proExecution.id)
          console.log("当前是：第"+i+'的tasks')
          console.log(temp_tasks)
          Tasks_List.push(temp_tasks)
        }
        console.log("这是TasksList")
        console.log(Tasks_List)
        return Tasks_List;
    }
}
export default dateApi