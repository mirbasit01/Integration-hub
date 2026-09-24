import axios from "axios";
import { SUBGRAPH_URL, SUBGRAPH_API_KEY } from "../Environment";

const graphClient = axios.create({
  baseURL: SUBGRAPH_URL,
  headers: {
    "Content-Type": "application/json",
    ...(SUBGRAPH_API_KEY && { Authorization: `Bearer ${SUBGRAPH_API_KEY}` }),
  },
});

const sendQuery = async (query, variables = {}) => {
  const res = await graphClient.post("", { query, variables });
  if (res.data.errors) throw new Error(res.data.errors[0].message);
  return res.data.data;
};

export const getRecentSwapsService = async (first = 5) => {
  try {
    const data = await sendQuery(
      `query GetSwaps($first: Int!) {
        swaps(first: $first, orderBy: timestamp, orderDirection: desc) {
          id
          timestamp
          amountUSD
          token0 { symbol }
          token1 { symbol }
        }
      }`,
      { first }
    );
    return data.swaps;
  } catch (error) {
    console.error("getRecentSwapsService error:", error);
    throw error;
  }
};

export const getTopPoolsService = async (first = 3) => {
  try {
    const data = await sendQuery(
      `query GetPools($first: Int!) {
        pools(first: $first, orderBy: totalValueLockedUSD, orderDirection: desc) {
          id
          token0 { symbol }
          token1 { symbol }
          totalValueLockedUSD
          volumeUSD
        }
      }`,
      { first }
    );
    return data.pools;
  } catch (error) {
    console.error("getTopPoolsService error:", error);
    throw error;
  }
};

export const runCustomQueryService = async (query) => {
  try {
    return await sendQuery(query);
  } catch (error) {
    console.error("runCustomQueryService error:", error);
    throw error;
  }
};
