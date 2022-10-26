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
}

export default api