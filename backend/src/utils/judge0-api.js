import axios from "axios";
import dotenv from "dotenv";
import { ApiError } from "./api-errors.js";
dotenv.config()
export const getJudge0LanguageId = (language)=>{
        const languageMap = {
            "PYTHON":71,
            "JAVA":62,
            "JAVASCRIPT":63,
            "C++":54
        }
        return  languageMap[language.toUpperCase()];
}

export const submitBatch = async(submissions)=>{
    try {
        const {data} = await axios.post(`${process.env.JUDGE0_BASE_URL}/submissions/batch?base64_encoded=false`,{
            submissions
        })
        console.log("Submission Results : ",data);
        return data;
    } catch (error) {
        throw new ApiError(500,"Failed to submit batch-submission",error);
    }
}
const sleep = async(ms)=>{
   return new Promise((resolve)=> setTimeout(resolve,ms));
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
        throw new ApiError(500, "Error polling Judge0 batch results", error);
    }
}