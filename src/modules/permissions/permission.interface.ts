import { RouterHandle } from "../../utils/routerHandle.type";
export interface IAssignPermissionDTO {
  subject: string;
  object: string;
  action: string | string[];
}

export interface IAssignRoleDTO {
  username: string;
  groupName: string;
}

export namespace PermissionSpace {
  export type AssignRoleController = RouterHandle<{
    body: IAssignRoleDTO;
  }>;

  export type AssignPermissionController = RouterHandle<{
    body: IAssignPermissionDTO;
  }>;

  export type GetAllController = RouterHandle<{}>;
}
