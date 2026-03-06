import "dotenv/config";

// export default {
//   datasource: {
//     url: process.env.DATABASE_URL,
//   },
// };
export default {
  datasource: {
    url: process.env.DIRECT_URL, // Change DATABASE_URL to DIRECT_URL here
  },
};