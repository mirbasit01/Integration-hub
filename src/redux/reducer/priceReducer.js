const initialState = { data: [], loading: false };

const priceReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_PRICES":
      return { ...state, data: action.payload, loading: false };
    case "PRICES_LOADING":
      return { ...state, loading: true };
    default:
      return state;
  }
};

export default priceReducer;
