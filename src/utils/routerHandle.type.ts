import { Request, Response, NextFunction } from "express";

export type RouterHandle<T = {}> = (
  req: Request<
    T extends { param: infer P } ? P : any,
    any,
    T extends { body: infer B } ? B : any,
    T extends { query: infer Q } ? Q : any
  >,
  res: Response,
  next: NextFunction
) => any | Promise<any>;
