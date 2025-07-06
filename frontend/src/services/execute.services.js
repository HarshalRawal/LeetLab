import { axiosInstance } from "../libs/axios"
export const executeExamples  = async(data)=>{
       const res = await axiosInstance.post("/api/v1/execute/run",data);
       return res.data;
}