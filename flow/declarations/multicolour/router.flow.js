// @flow

// @TODO: Grab these from an export and use typeof
export type VERBS = "POST" 
  | "GET" 
  | "PATCH" 
  | "PUT" 
  | "DELETE" 
  | "HEAD" 
  | "OPTIONS" 
  | "CONNECT" 
  | "HEAD" 
  | "TRACE"

export type Route = {
  method: VERBS,
  path: string,
  auth: string,
}
