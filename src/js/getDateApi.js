const dateApi ={
    // getsometest()
    // {
    //     var fruits = ["Banana", "Orange", "Apple", "Mango"];
    //     console.log(fruits.length)
    // },
    /**
         * 根据传入流程ID查找流程
         * @param executionId
         * @return Executions
         */
    getProExecutionsByExecutionId(executionId)
    {
        api.getProExecutionsByExecutionId(executionId).then(res=>{
        console.log("传入成功getProExecutions:")
        console.log(this.proExecutions)
        return res.data.valueMap.data;
        })
    },
    /**
     * 根据proExecutionId查找Tasks
     * @param proExecutionId
     * @return tasks
     * */
    getTasksByProExecutionId(proExecutionId){
        api.getTasksByProExecutionId(proExecutionId).then(res=>{
        console.log("传入成功tasks")
        console.log(this.tasks)
        return res.data.valueMap.data;
        })
    },
}
export default dateApi