import { create } from "zustand"
import { axiosInstance } from "../libs/axios"
import { toast } from "react-toastify"

export const useProblemStore = create((set, get) => ({
  problems: [],
  problem: null,
  solvedProblems: [],
  isProblemsLoading: false,
  isProblemLoading: false,
  isLoadingMore: false,
  hasMore: true,
  nextCursor: null,
  filters: {
    difficulty: "all",
    searchTerm: "",
  },

  // Set filters
  setFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    })),

  // Reset filters
  resetFilters: () =>
    set({
      filters: {
        difficulty: "all",
        searchTerm: "",
      },
    }),

  // Get all problems with cursor-based pagination
  getAllProblems: async (limit = 20, cursor = null, reset = false) => {
    try {
      const loadingKey = reset || !cursor ? "isProblemsLoading" : "isLoadingMore"
      set({ [loadingKey]: true })

      const params = { limit }
      if (cursor) params.cursor = cursor

      const res = await axiosInstance.get("/problems/get-all-problems", { params })

      const newProblems = res.data.data.allProblems || []
      console.log(newProblems);
      const nextCursor = res.data.data.nextCursor || null
      const hasMore = !!nextCursor

      set((state) => ({
        problems: reset || !cursor ? newProblems : [...state.problems, ...newProblems],
        nextCursor,
        hasMore,
        [loadingKey]: false,
      }))

      if (reset || !cursor) {
        toast.success(`Loaded ${newProblems.length} problems`)
      }
    } catch (error) {
      console.log("Error getting all problems", error)
      toast.error("Error in getting problems")
      set({ isProblemsLoading: false, isLoadingMore: false })
    }
  },

  // Load more problems for infinite scroll
  loadMoreProblems: async () => {
    const { nextCursor, isLoadingMore, hasMore } = get()
    if (isLoadingMore || !hasMore || !nextCursor) return

    await get().getAllProblems(20, nextCursor, false)
  },

  // Reset and fetch fresh data
  resetAndFetch: async () => {
    set({
      problems: [],
      nextCursor: null,
      hasMore: true,
    })
    await get().getAllProblems(20, null, true)
  },

  // Get problem by ID
  getProblemById: async (id) => {
    try {
      set({ isProblemLoading: true })
      const res = await axiosInstance.get(`/problems/get-problem/${id}`)
      console.log("problem :",res.data.data.problem);
      set({ problem: res.data.data.problem })
      toast.success(res.data.message)
    } catch (error) {
      console.log("Error getting problem", error)
      toast.error("Error in getting problem")
    } finally {
      set({ isProblemLoading: false })
    }
  },

  // Get solved problems by user
  getSolvedProblemByUser: async () => {
    try {
      const res = await axiosInstance.get("/problems/get-solved-problems");
      console.log(res.data);
      toast.success(res.data.message);
  
      const solvedList = res.data?.data?.allProblemsSolvedByUser || [];
  
      set({
        solvedProblems: solvedList.map((item) => ({
          id: item.problem.id,
          title: item.problem.title,
          difficulty: item.problem.difficulty,
        })),
      });
    } catch (error) {
      console.log("Error getting solved problems", error);
      toast.error("Error getting solved problems");
      set({ solvedProblems: [] }); // Optional: Reset to empty on failure
    }
  },
  

  // Mark problem as solved/unsolved (optimistic update)
  toggleProblemStatus: (problemId) => {
    set((state) => ({
      problems: state.problems.map((p) => (p.id === problemId ? { ...p, solved: !p.solved } : p)),
    }))
  },

  // Get filtered problems (client-side filtering)
  getFilteredProblems: () => {
    const { problems, filters } = get()
    return problems.filter((problem) => {
      const matchesDifficulty =
        filters.difficulty === "all" || problem.difficulty.toLowerCase() === filters.difficulty.toLowerCase()

      const matchesSearch = problem.title.toLowerCase().includes(filters.searchTerm.toLowerCase())

      return matchesDifficulty && matchesSearch
    })
  },

  // Get problems stats
  getProblemsStats: () => {
    const { problems = [], solvedProblems = [] } = get();
    const total = problems.length;
    const solved = problems.filter((p) =>
      solvedProblems.some((sp) => sp.id === p.id)
    ).length;
  
    return {
      total,
      solved,
      unsolved: total - solved,
      solvedPercentage: total > 0 ? Math.round((solved / total) * 100) : 0,
    };
  },
  

  // Clear store
  clearStore: () =>
    set({
      problems: [],
      problem: null,
      solvedProblems: [],
      isProblemsLoading: false,
      isProblemLoading: false,
      isLoadingMore: false,
      hasMore: true,
      nextCursor: null,
      filters: {
        difficulty: "all",
        searchTerm: "",
      },
    }),
}))
