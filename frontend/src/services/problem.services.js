import { axiosInstance } from "../libs/axios";


export const createProblem = async(problemData)=>{
    const response  = await axiosInstance.post("/problems/create-problem",problemData);
    return response.data;
}

