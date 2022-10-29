import axios from "axios";
import path from "./path";

const api = {
    getAllNodesByProcessId(processId){
        return axios.post(path.baseUrl +path.getAllNodesByProcessId,{processId: processId})
    },
    getNodeByNodeId(nodeId)
    {
        return axios.post(path.baseUrl +path.getNodeByNodeId,{nodeId: nodeId})
    },
    queryExecution(isDone,startTime,endTime)
    {
       return axios.post(path.baseUrl +path.queryExecution,{isDone: isDone,startTime: startTime,endTime: endTime})
    },
    getProExecutionsByExecutionId(executionId)
    {
       return axios.post(path.baseUrl +path.getProExecutionsByExecutionId,{executionId: executionId})
    },
    getTasksByProExecutionId(proExecutionId)
    {
       return axios.post(path.baseUrl +path.getTasksByProExecutionId,{proExecutionId: proExecutionId})
    },
    getProExecutionByProExecutionId(proExecutionId)
    {
        return axios.post(path.baseUrl +path.getProExecutionByProExecutionId,{proExecutionId: proExecutionId})
    }
}

export default api