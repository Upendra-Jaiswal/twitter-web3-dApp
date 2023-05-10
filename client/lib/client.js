import sanityClient from "@sanity/client";

export const client = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  //projectId: "chatobam",
  dataset: "production",
  apiVersion: "v1",
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
  //token: "skC4wsahF0q3VUCDBai42IgermODBB0rMqZmtrvpL8M8lCPt9gmnmTb931ZhOcMeHgCfbcaIf2oe5N7DUsa4ZHwmOKmQYWzYRspgVE6LpZZtz33LbqLTyoYYLOwb6GHEzwfb5rh7fmPLU1u6HMwQ0LHCaxI34cyWsIHv3tCq9V1YkSkxFx22",
  useCdn: false,
});

//NEXT_PUBLIC_SANITY_PROJECT_ID=chatobam
// projectId: "chatobam",
//NEXT_PUBLIC_SANITY_PROJECT_ID=chatobam

// skC4wsahF0q3VUCDBai42IgermODBB0rMqZmtrvpL8M8lCPt9gmnmTb931ZhOcMeHgCfbcaIf2oe5N7DUsa4ZHwmOKmQYWzYRspgVE6LpZZtz33LbqLTyoYYLOwb6GHEzwfb5rh7fmPLU1u6HMwQ0LHCaxI34cyWsIHv3tCq9V1YkSkxFx22
//c: process.env.NEXT_PUBLIC_SANITY_TOKEN,
