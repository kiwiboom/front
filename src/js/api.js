import axios from "axios";
import path from "./path";

const api = {
    getAllNodesByProcessId(processId){
        return axios.post(path.baseUrl +path.getAllNodesByProcessId,{processId: this.processId})
    },
    getNodeByNodeId(nodeId)
    {
        return axios.post(path.baseUrl +path.getNodeByNodeId,{nodeId: this.nodeId})
    }
}

export default api