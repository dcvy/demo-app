export interface IAssignPermissionDTO {
  subject: string;
  object: string;
  action: string | string[];
}

export interface IAssignRoleDTO {
  username: string;
  groupName: string;
}
