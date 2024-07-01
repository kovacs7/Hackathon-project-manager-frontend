import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";

const useAccountData = create((set) => ({
  data: {},
  getAccountData: async () => {
    try {
      const userToken = localStorage.getItem("userToken");
      const res = await axios.post("/accountsinfo", { userToken });
      if (res.data) {
        if (res.data.error) {
          toast.error(res.data.error);
        } else {
          set({ data: res.data });
        }
      } else {
        set({ data: null });
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to fetch account data");
    }
  },
}));

export default useAccountData