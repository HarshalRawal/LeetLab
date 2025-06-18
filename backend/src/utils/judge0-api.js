import axios from "axios";
import dotenv from "dotenv";
import { ApiError } from "./api-errors.js";
dotenv.config()
const languageMap = {
    "PYTHON":71,
    "JAVA":62,
    "JAVASCRIPT":63,
    "CPP":54
}
const reverseLanguageMap = Object.fromEntries(
    Object.entries(languageMap).map(([key,value]) => [value,key])
)

export const getJudge0LanguageFromId = (id)=>{
    return reverseLanguageMap[id] || null
}
export const getJudge0LanguageId = (language)=>{
        return  languageMap[language.toUpperCase()]||null;
}
export const singleSubmission = async({source_code,language_id,stdin})=>{
    try {
        const {data} = await axios.post(`${process.env.JUDGE0_BASE_URL}/submissions/?base64_encoded=false&wait=false`,{
            source_code,
            language_id,
            stdin
        })
        return data;
    } catch (error) {
        throw new ApiError(500,"Failed to submit single custom inputs",error);
    }
}
export const submitBatch = async(submissions)=>{
    try {
        const {data} = await axios.post(`${process.env.JUDGE0_BASE_URL}/submissions/batch?base64_encoded=false`,{
            submissions
        })
        //console.log("Submission Results : ",data);
        return data;
    } catch (error) {
        throw new ApiError(500,"Failed to submit batch-submission",error);
    }
}
const sleep = async(ms)=>{
   return new Promise((resolve)=> setTimeout(resolve,ms));
}

export const pollSingleResult = async(token)=>{
    try {
        while(true){
            const {data} = await axios.get(`${process.env.JUDGE0_BASE_URL}/submissions/${token}`,{
                params:{
                    base64_encoded:false
                }
            })
            if(data.status.id!==1 && data.status.id!==2){
                return data;
            }
            await sleep(1000);
        }
    } catch (error) {
        console.error("Polling Error:", error?.response?.data || error.message);
        throw new ApiError(500, "Error polling Judge0 single result",error);
    }
}
export const pollBatchResults = async (tokens) => {
    try {
        while (true) {
            const { data } = await axios.get(`${process.env.JUDGE0_BASE_URL}/submissions/batch`, {
                params: {
                    tokens: tokens.join(","),
                    base64_encoded: false
                }
            });

            const result = data.submissions;

            const isAllDone = result.every((r) => r.status.id !== 1 && r.status.id !== 2);
            if (isAllDone) return result;

            await sleep(1000); // Wait and retry
        }
    } catch (error) {
        console.error("Polling Error:", error?.response?.data || error.message);
        throw new ApiError(500, "Error polling Judge0 batch results",error);
    }
}