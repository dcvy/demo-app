import { Types } from "mongoose";
import { RouterHandle } from "../../utils/routerHandle.type";

export interface IUserGroup {
  _id?: Types.ObjectId;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateUserGroupDTO {
  name: string;
  description?: string;
}

export interface IUpdateUserGroupDTO {
  name?: string;
  description?: string;
}

export namespace UserGroupSpace {
  export type GetAllController = RouterHandle<{}>;

  export type GetByIdController = RouterHandle<{
    params: { id: string };
  }>;

  export type CreateController = RouterHandle<{
    body: ICreateUserGroupDTO;
  }>;

  export type UpdateController = RouterHandle<{
    params: { id: string };
    body: Partial<IUpdateUserGroupDTO>;
  }>;

  export type DeleteController = RouterHandle<{
    params: { id: string };
  }>;
}
