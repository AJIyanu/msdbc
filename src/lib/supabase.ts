import { createClient } from "@supabase/supabase-js";
import { GraphQLClient } from "graphql-request";

const supabaseUrl = "https://coqfzdlezcjqqjdkspln.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const restfulClient = createClient(supabaseUrl, supabaseKey);

// lib/graphqlClient.ts

const graphqlUrl = process.env.NEXT_PUBLIC_SUPABASE_URL + "/graphql/v1";
const graphqlAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const graphqlClient = new GraphQLClient(graphqlUrl, {
  headers: {
    apikey: graphqlAnonKey,
    authorization: `Bearer ${graphqlAnonKey}`,
  },
});
