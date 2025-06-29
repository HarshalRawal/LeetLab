import { create} from "zustand";
import { axiosInstance } from "../libs/axios";
import { toast } from "react-toastify";
export const useAuthStore = create((set)=>({
    authUser:null,
    isSigninUp:false,
    isLoggingIn:false,  
    isCheckingAuth:false,

    checkAuth : async()=>{
        try {
            set({isCheckingAuth:true})
            const {data} = await axiosInstance.get("/auth/check");
            set({authUser : data.data.user})
            toast.success(data.message)
        } catch (error) {
            console.log("Error checking auth: ",error)
          //  const errorMessage = error?.response?.data?.message|| "SomeThing Went Wrong !!!!!"
            //toast.error(errorMessage)
            set({authUser:null})
        }
        finally {
            set({isCheckingAuth:false})
        }
    },
     signup : async(data)=>{
        try {
            set({isSigninUp:true})
            const res = await axiosInstance.post("/auth/signup",data)
            console.log(JSON.stringify(res.data.data));
            set({authUser:res.data.data.id})
            console.log(res.data.data.id)
            toast.success(res.data.message)
        } catch (error) {
            console.log(`Error signIn up ${error}`)
            const errorMessage =  error?.response?.data?.message || "Something went wrong. Please try again.";
            set({authUser:null})
            toast.error(errorMessage)
        }
        finally {
            set({isSigninUp:false})
        }
    },
    login : async(data)=>{
        try {
            set({isLoggingIn : true})
            const response = await axiosInstance.post("/auth/signIn",data);
            set({authUser:response.data.data.user});
            toast.success(response.data.message);
        } catch (error) {
            console.log("error signing in ",error);
            const errorMessage = error?.response?.data?.message || "Something went wrong while signing in";
            toast.error(errorMessage);
        }
        finally {
            set({isLoggingIn:false});
        }
    },

    logout : async()=>{
        try {
            const response = await axiosInstance.post("/auth/logOut");
            set({authUser : null});
            toast.success(response.data.message);
        } catch (error) {
            console.log(`error logging out ${error}`);
            const errorMessage = error?.response?.data?.message || "Something went wrong while logging out";
            toast.error(errorMessage);
        }

    },
    refreshAccessToken : async()=>{
        try {
            const response = await axiosInstance.post("/auth/refreshAccessToken");
            set({authUser:response.data.data.userId});
        } catch (error) {
            console.log("error refreshing access token ",error);
            set({authUser:null});
            const errorMessage = error?.response?.data?.message || "Something went wrong while refreshing access token ! Please login again";
            toast.error(errorMessage);
        }
    }
}))