import axios from "axios";
import path from "./path";

const api = {
    getAllNodesByProcessId(processId){
        return axios.post(path.baseUrl +path.getAllNodesByProcessId,{processId: this.processId})
    },
    getNodeByNodeId(nodeId)
    {
        return axios.post(path.baseUrl +path.getNodeByNodeId,{nodeId: this.nodeId})
    },
    queryExecution(isDone,startTime,endTime)
    {
       return axios.post(path.baseUrl +path.queryExecution,{isDone: this.isDone,startTime: this.startTime,endTime: this.endTime})
    },
    getProExecutionsByExecutionId(executionId)
    {
       return axios.post(path.baseUrl +path.getProExecutionsByExecutionId,{executionId: this.executionId})
    },
    getTasksByProExecutionId(proExecutionId)
    {
       return axios.post(path.baseUrl +path.getTasksByProExecutionId,{proExecutionId: this.proExecutionId})
    },
}

export default api