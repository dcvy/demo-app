import casbinInstance from "../../casbin";

export class PermissionService {
  static async addPolicies(
    subjectId: string,
    object: string,
    action: string | string[]
  ) {
    const enforcer = casbinInstance.enforcer;
    const actions =
      typeof action === "string"
        ? action.split(",").map((a) => a.trim().toUpperCase())
        : action;

    const rules = actions.map((act) => [subjectId, object, act]);
    const result = await enforcer.addPolicies(rules);

    if (result) await enforcer.savePolicy();
    return result;
  }

  static async addGrouping(username: string, groupId: string) {
    const enforcer = casbinInstance.enforcer;
    const success = await enforcer.addGroupingPolicy(username, groupId);
    if (success) await enforcer.savePolicy();
    return success;
  }

  static async getRules() {
    const enforcer = casbinInstance.enforcer;
    return {
      policies: await enforcer.getPolicy(),
      groupingPolicies: await enforcer.getGroupingPolicy(),
    };
  }
}
