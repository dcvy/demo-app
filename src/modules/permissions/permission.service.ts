import { getEnforcer } from "../../casbin";
import { IAssignPermissionDTO, IAssignRoleDTO } from "./permission.interface";

export class PermissionService {
  static async addPolicy(
    subjectId: string,
    object: string,
    action: string | string[]
  ) {
    const enforcer = await getEnforcer();

    const actions =
      typeof action === "string"
        ? action.split(",").map((a) => a.trim().toUpperCase())
        : action;

    const rules = actions.map((act) => [subjectId, object, act]);

    const result = await enforcer.addPolicies(rules);
    const isSuccess = Array.isArray(result)
      ? result.some((r) => r === true)
      : result;

    if (isSuccess) {
      await enforcer.savePolicy();
      return true;
    }
    return false;
  }

  static async addGroupingPolicy(username: string, groupId: string) {
    const enforcer = await getEnforcer();

    const success = await enforcer.addGroupingPolicy(username, groupId);

    if (success) {
      await enforcer.savePolicy();
      return true;
    }
    return false;
  }

  static async getRules() {
    const enforcer = await getEnforcer();
    return {
      policies: await enforcer.getPolicy(),
      groupingPolicies: await enforcer.getGroupingPolicy(),
    };
  }
}
