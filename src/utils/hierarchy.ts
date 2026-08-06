import type { Employee, HierarchyTreeNode } from "@/types/employee";

export interface HierarchyInfo {
  level: number;
  levelBadge: string;
  reportingManager: Employee | null;
  directReports: Employee[];
  reportingChain: Employee[];
  organizationPath: string[];
  teamSize: number; // direct + indirect reports
}

/**
 * Computes hierarchy metadata for a given employee from the total employee list.
 * Completely hardened against null/undefined fields.
 */
export function computeEmployeeHierarchyInfo(
  emp: Employee,
  allEmployees: Employee[],
): HierarchyInfo {
  if (!emp) {
    return {
      level: 1,
      levelBadge: "L1",
      reportingManager: null,
      directReports: [],
      reportingChain: [],
      organizationPath: [],
      teamSize: 1,
    };
  }

  const safeAll = Array.isArray(allEmployees) ? allEmployees.filter(Boolean) : [];
  const mapByNormalizedName = new Map<string, Employee>();
  const mapById = new Map<string, Employee>();

  safeAll.forEach((e) => {
    if (e.id) mapById.set(e.id, e);
    if (e.full_name && typeof e.full_name === "string") {
      mapByNormalizedName.set(e.full_name.trim().toLowerCase(), e);
    }
  });

  // Find direct reporting manager object
  let manager: Employee | null = null;
  if (emp.reporting_manager_id && mapById.has(emp.reporting_manager_id)) {
    manager = mapById.get(emp.reporting_manager_id)!;
  } else if (emp.reporting_manager && typeof emp.reporting_manager === "string") {
    const key = emp.reporting_manager.trim().toLowerCase();
    if (mapByNormalizedName.has(key)) {
      manager = mapByNormalizedName.get(key)!;
    }
  }

  // Calculate Ancestor Reporting Chain (bottom-up: Manager -> Manager's Manager -> ... -> Root)
  const chain: Employee[] = [];
  const visited = new Set<string>();
  let current: Employee | null = manager;

  while (current && current.id && !visited.has(current.id)) {
    visited.add(current.id);
    chain.unshift(current); // Prepend so order is Top -> Bottom

    if (current.reporting_manager_id && mapById.has(current.reporting_manager_id)) {
      current = mapById.get(current.reporting_manager_id)!;
    } else if (current.reporting_manager && typeof current.reporting_manager === "string") {
      const key = current.reporting_manager.trim().toLowerCase();
      current = mapByNormalizedName.get(key) ?? null;
    } else {
      current = null;
    }
  }

  // Level: 1 + chain length
  const level = emp.hierarchy_level ?? (chain.length + 1);
  const levelBadge = `L${level}`;

  const safeEmpName = emp.full_name || emp.email || "Employee";

  // Organization Path string breadcrumb
  const organizationPath = [
    ...chain.map((c) => c.job_title || c.full_name || "Manager"),
    emp.job_title || safeEmpName,
  ];

  // Direct reports
  const directReports = safeAll.filter((e) => {
    if (!e || e.id === emp.id) return false;
    if (e.reporting_manager_id && emp.id && e.reporting_manager_id === emp.id) return true;
    if (e.reporting_manager && emp.full_name && typeof e.reporting_manager === "string") {
      return e.reporting_manager.trim().toLowerCase() === emp.full_name.trim().toLowerCase();
    }
    return false;
  });

  // Calculate total subordinates (indirect + direct reports) recursively
  const getSubordinatesCount = (mId?: string, mName?: string, seen = new Set<string>()): number => {
    let count = 0;
    if (!mId && !mName) return 0;
    const safeMName = (mName || "").trim().toLowerCase();

    safeAll.forEach((e) => {
      if (!e || !e.id || seen.has(e.id)) return;
      const isDirect =
        (mId && e.reporting_manager_id === mId) ||
        (safeMName && e.reporting_manager && typeof e.reporting_manager === "string" && e.reporting_manager.trim().toLowerCase() === safeMName);
      if (isDirect) {
        seen.add(e.id);
        count += 1 + getSubordinatesCount(e.id, e.full_name || "", seen);
      }
    });
    return count;
  };

  const teamSize = emp.team_size ?? (directReports.length + getSubordinatesCount(emp.id, safeEmpName));

  return {
    level,
    levelBadge,
    reportingManager: manager,
    directReports,
    reportingChain: chain,
    organizationPath,
    teamSize,
  };
}

/**
 * Builds an N-ary Hierarchy Tree array from flat employee records.
 */
export function buildHierarchyTree(employees: Employee[]): HierarchyTreeNode[] {
  if (!Array.isArray(employees) || !employees.length) return [];

  const safeEmployees = employees.filter((e) => e && e.id);
  const mapById = new Map<string, Employee>();
  const mapByName = new Map<string, Employee>();

  safeEmployees.forEach((emp) => {
    mapById.set(emp.id, emp);
    if (emp.full_name && typeof emp.full_name === "string") {
      mapByName.set(emp.full_name.trim().toLowerCase(), emp);
    }
  });

  const childrenMap = new Map<string, Employee[]>();

  safeEmployees.forEach((emp) => {
    let parentId: string | null = null;
    if (emp.reporting_manager_id && mapById.has(emp.reporting_manager_id)) {
      parentId = emp.reporting_manager_id;
    } else if (emp.reporting_manager && typeof emp.reporting_manager === "string") {
      const parent = mapByName.get(emp.reporting_manager.trim().toLowerCase());
      if (parent) parentId = parent.id;
    }

    if (parentId && parentId !== emp.id) {
      const list = childrenMap.get(parentId) || [];
      list.push(emp);
      childrenMap.set(parentId, list);
    }
  });

  // Find root nodes (no parent in list or explicit executive/CEO role)
  const roots = safeEmployees.filter((emp) => {
    if (!emp.reporting_manager && !emp.reporting_manager_id) return true;
    let hasParent = false;
    if (emp.reporting_manager_id && mapById.has(emp.reporting_manager_id)) hasParent = true;
    if (emp.reporting_manager && typeof emp.reporting_manager === "string" && mapByName.has(emp.reporting_manager.trim().toLowerCase())) hasParent = true;
    return !hasParent;
  });

  const buildNode = (emp: Employee, currentLevel: number): HierarchyTreeNode => {
    const directChildren = childrenMap.get(emp.id) || [];
    const childNodes = directChildren.map((c) => buildNode(c, currentLevel + 1));
    const totalSubordinates = childNodes.reduce(
      (acc, node) => acc + 1 + node.total_subordinates_count,
      0,
    );

    return {
      id: emp.id,
      employee: {
        ...emp,
        hierarchy_level: currentLevel,
        direct_reports_count: directChildren.length,
        team_size: totalSubordinates,
      },
      children: childNodes,
      level: currentLevel,
      direct_reports_count: directChildren.length,
      total_subordinates_count: totalSubordinates,
    };
  };

  const finalRoots = roots.length > 0 ? roots : safeEmployees.slice(0, 1);
  return finalRoots.map((r) => buildNode(r, 1));
}
