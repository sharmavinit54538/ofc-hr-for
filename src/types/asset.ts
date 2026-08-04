export type AssetStatus = "AVAILABLE" | "ASSIGNED" | "IN_REPAIR" | "DAMAGED" | "LOST" | "DISPOSED";
export type AssetCondition = "EXCELLENT" | "GOOD" | "FAIR" | "POOR" | "DAMAGED";
export type AssignmentStatus = "ACTIVE" | "RETURNED";
export type MaintenanceStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type AssetRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "ALLOCATED";

export interface AssetCategoryItem {
  id: string;
  organization_id: string;
  name: string;
  code: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface AssetCategoryCreateInput {
  name: string;
  code: string;
  description?: string;
}

export interface AssetCategoryUpdateInput {
  name?: string;
  code?: string;
  description?: string;
}

export interface AssetVendorItem {
  id: string;
  organization_id: string;
  name: string;
  email?: string;
  phone?: string;
  contact_person?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface AssetVendorCreateInput {
  name: string;
  email?: string;
  phone?: string;
  contact_person?: string;
  address?: string;
}

export interface AssetVendorUpdateInput {
  name?: string;
  email?: string;
  phone?: string;
  contact_person?: string;
  address?: string;
}

export interface AssetItem {
  id: string;
  organization_id: string;
  tag_id: string;
  name: string;
  serial_number: string;
  category_id?: string;
  category_name?: string;
  vendor_id?: string;
  vendor_name?: string;
  status: AssetStatus;
  condition: AssetCondition;
  purchase_date?: string;
  purchase_cost: number;
  warranty_expiry?: string;
  department?: string;
  location?: string;
  notes?: string;
  assigned_to_name?: string;
  created_at: string;
  updated_at: string;
}

export interface AssetCreateInput {
  tag_id: string;
  name: string;
  serial_number: string;
  category_id?: string;
  vendor_id?: string;
  status?: AssetStatus;
  condition?: AssetCondition;
  purchase_date?: string;
  purchase_cost?: number;
  warranty_expiry?: string;
  department?: string;
  location?: string;
  notes?: string;
}

export interface AssetUpdateInput {
  name?: string;
  serial_number?: string;
  category_id?: string;
  vendor_id?: string;
  status?: AssetStatus;
  condition?: AssetCondition;
  purchase_date?: string;
  purchase_cost?: number;
  warranty_expiry?: string;
  department?: string;
  location?: string;
  notes?: string;
}

export interface AssetAssignInput {
  asset_id: string;
  employee_id: string;
  assigned_date: string;
  expected_return_date?: string;
  notes?: string;
}

export interface AssetReturnInput {
  asset_id: string;
  return_date: string;
  return_condition?: string;
  notes?: string;
}

export interface AssetAssignmentItem {
  id: string;
  organization_id: string;
  asset_id: string;
  asset_name?: string;
  asset_tag?: string;
  employee_id: string;
  employee_name?: string;
  assigned_by_name?: string;
  assigned_date: string;
  expected_return_date?: string;
  return_date?: string;
  return_condition?: string;
  status: AssignmentStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AssetMaintenanceItem {
  id: string;
  organization_id: string;
  asset_id: string;
  asset_name?: string;
  asset_tag?: string;
  maintenance_type: string;
  description?: string;
  cost: number;
  scheduled_date: string;
  completed_date?: string;
  status: MaintenanceStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AssetMaintenanceCreateInput {
  asset_id: string;
  maintenance_type: string;
  description?: string;
  cost?: number;
  scheduled_date: string;
  completed_date?: string;
  notes?: string;
}

export interface AssetMaintenanceUpdateInput {
  maintenance_type?: string;
  description?: string;
  cost?: number;
  scheduled_date?: string;
  completed_date?: string;
  status?: MaintenanceStatus;
  notes?: string;
}

export interface AssetRequestItem {
  id: string;
  organization_id: string;
  employee_id: string;
  employee_name?: string;
  asset_category: string;
  reason: string;
  priority: string;
  status: AssetRequestStatus;
  created_at: string;
  updated_at: string;
}

export interface AssetRequestCreateInput {
  asset_category: string;
  reason: string;
  priority?: string;
}

export interface AssetRequestUpdateInput {
  status?: AssetRequestStatus;
  priority?: string;
}

export interface CategoryDistributionItem {
  category: string;
  count: number;
}

export interface StatusDistributionItem {
  status: string;
  count: number;
}

export interface AssetDashboardData {
  total_assets: number;
  assigned_assets: number;
  available_assets: number;
  maintenance_assets: number;
  damaged_assets: number;
  lost_assets: number;
  total_asset_value: number;
  pending_requests: number;
  category_distribution: CategoryDistributionItem[];
  status_distribution: StatusDistributionItem[];
}
