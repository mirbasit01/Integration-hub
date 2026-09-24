const initialState = { address: null, isConnected: false };

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, ...action.payload };
    case "CLEAR_USER":
      return initialState;
    default:
      return state;
  }
};

export default userReducer;
