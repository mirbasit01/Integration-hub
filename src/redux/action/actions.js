import { getPostsService } from "../../utils/services/posts.services";

export const setUser = (payload) => ({ type: "SET_USER", payload });
export const clearUser = () => ({ type: "CLEAR_USER" });

// Thunk: fetch posts via service layer, map to chart data
export const fetchPostsAction = () => async (dispatch) => {
  dispatch({ type: "PRICES_LOADING" });
  const posts = await getPostsService(10);
  if (!posts) return;
  const chartData = posts.map((p) => ({
    name: `Post ${p.id}`,
    value: p.id * 10 + (p.title.length % 50),
  }));
  dispatch({ type: "SET_PRICES", payload: chartData });
};
