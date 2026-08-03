export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      companies: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string
          gst_number: string | null
          id: string
          industry: string | null
          logo: string | null
          name: string
          owner_id: string | null
          size: string | null
          state: string | null
          timezone: string | null
          updated_at: string
          website: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          gst_number?: string | null
          id?: string
          industry?: string | null
          logo?: string | null
          name: string
          owner_id?: string | null
          size?: string | null
          state?: string | null
          timezone?: string | null
          updated_at?: string
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          gst_number?: string | null
          id?: string
          industry?: string | null
          logo?: string | null
          name?: string
          owner_id?: string | null
          size?: string | null
          state?: string | null
          timezone?: string | null
          updated_at?: string
          website?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          role: string | null
          organization_id: string | null
          employee_code: string | null
          department_id: string | null
          designation_id: string | null
          manager_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          organization_id?: string | null
          employee_code?: string | null
          department_id?: string | null
          designation_id?: string | null
          manager_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          organization_id?: string | null
          employee_code?: string | null
          department_id?: string | null
          designation_id?: string | null
          manager_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: string
          user_id: string
        }
        Insert: {
          id?: string
          role: string
          user_id: string
        }
        Update: {
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          id: string
          organization_id: string
          name: string
          code: string | null
          head_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          code?: string | null
          head_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          code?: string | null
          head_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      designations: {
        Row: {
          id: string
          organization_id: string
          department_id: string | null
          name: string
          code: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          department_id?: string | null
          name: string
          code?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          department_id?: string | null
          name?: string
          code?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      employees: {
        Row: {
          id: string
          organization_id: string
          user_id: string | null
          employee_code: string
          full_name: string
          email: string
          phone: string | null
          job_title: string | null
          department_id: string | null
          designation_id: string | null
          manager_id: string | null
          location: string | null
          employment_type: string | null
          joining_date: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id?: string | null
          employee_code: string
          full_name: string
          email: string
          phone?: string | null
          job_title?: string | null
          department_id?: string | null
          designation_id?: string | null
          manager_id?: string | null
          location?: string | null
          employment_type?: string | null
          joining_date?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string | null
          employee_code?: string
          full_name?: string
          email?: string
          phone?: string | null
          job_title?: string | null
          department_id?: string | null
          designation_id?: string | null
          manager_id?: string | null
          location?: string | null
          employment_type?: string | null
          joining_date?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      attendance_records: {
        Row: {
          id: string
          organization_id: string
          employee_id: string
          date: string
          clock_in: string | null
          clock_out: string | null
          total_minutes: number
          status: string
          lat: number | null
          lng: number | null
          overtime_minutes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          employee_id: string
          date?: string
          clock_in?: string | null
          clock_out?: string | null
          total_minutes?: number
          status?: string
          lat?: number | null
          lng?: number | null
          overtime_minutes?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          employee_id?: string
          date?: string
          clock_in?: string | null
          clock_out?: string | null
          total_minutes?: number
          status?: string
          lat?: number | null
          lng?: number | null
          overtime_minutes?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      leave_policies: {
        Row: {
          id: string
          organization_id: string
          type: string
          max_days_per_year: number
          notice_days_required: number
          carry_forward_allowed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          type: string
          max_days_per_year?: number
          notice_days_required?: number
          carry_forward_allowed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          type?: string
          max_days_per_year?: number
          notice_days_required?: number
          carry_forward_allowed?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      leave_balances: {
        Row: {
          id: string
          organization_id: string
          employee_id: string
          leave_type: string
          total_accrued: number
          used: number
          remaining: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          employee_id: string
          leave_type: string
          total_accrued?: number
          used?: number
          remaining?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          employee_id?: string
          leave_type?: string
          total_accrued?: number
          used?: number
          remaining?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      leave_requests: {
        Row: {
          id: string
          organization_id: string
          employee_id: string
          leave_type: string
          from_date: string
          to_date: string
          days_count: number
          reason: string | null
          status: string
          approver_id: string | null
          applied_on: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          employee_id: string
          leave_type: string
          from_date: string
          to_date: string
          days_count?: number
          reason?: string | null
          status?: string
          approver_id?: string | null
          applied_on?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          employee_id?: string
          leave_type?: string
          from_date?: string
          to_date?: string
          days_count?: number
          reason?: string | null
          status?: string
          approver_id?: string | null
          applied_on?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      salary_structures: {
        Row: {
          id: string
          organization_id: string
          employee_id: string
          basic_pay: number
          hra: number
          conveyance: number
          special_allowance: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          employee_id: string
          basic_pay?: number
          hra?: number
          conveyance?: number
          special_allowance?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          employee_id?: string
          basic_pay?: number
          hra?: number
          conveyance?: number
          special_allowance?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      payroll_runs: {
        Row: {
          id: string
          organization_id: string
          month: string
          year: string
          total_disbursement: number
          employees_count: number
          status: string
          processed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          month: string
          year: string
          total_disbursement?: number
          employees_count?: number
          status?: string
          processed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          month?: string
          year?: string
          total_disbursement?: number
          employees_count?: number
          status?: string
          processed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      payslips: {
        Row: {
          id: string
          organization_id: string
          payroll_run_id: string | null
          employee_id: string
          month: string
          year: string
          basic_pay: number
          hra: number
          conveyance: number
          special_allowance: number
          gross_earnings: number
          pf_deduction: number
          professional_tax: number
          income_tax: number
          total_deductions: number
          net_pay: number
          paid_on: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          payroll_run_id?: string | null
          employee_id: string
          month: string
          year: string
          basic_pay: number
          hra: number
          conveyance: number
          special_allowance: number
          gross_earnings: number
          pf_deduction?: number
          professional_tax?: number
          income_tax?: number
          total_deductions: number
          net_pay: number
          paid_on?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          payroll_run_id?: string | null
          employee_id?: string
          month?: string
          year?: string
          basic_pay?: number
          hra?: number
          conveyance?: number
          special_allowance?: number
          gross_earnings?: number
          pf_deduction?: number
          professional_tax?: number
          income_tax?: number
          total_deductions?: number
          net_pay?: number
          paid_on?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      approval_requests: {
        Row: {
          id: string
          organization_id: string
          approval_code: string
          type: string
          request_title: string
          requester_id: string | null
          priority: string
          assigned_approver_id: string | null
          amount_or_days: string | null
          status: string
          comments: string | null
          submitted_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          approval_code: string
          type: string
          request_title: string
          requester_id?: string | null
          priority?: string
          assigned_approver_id?: string | null
          amount_or_days?: string | null
          status?: string
          comments?: string | null
          submitted_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          approval_code?: string
          type?: string
          request_title?: string
          requester_id?: string | null
          priority?: string
          assigned_approver_id?: string | null
          amount_or_days?: string | null
          status?: string
          comments?: string | null
          submitted_date?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      assets: {
        Row: {
          id: string
          organization_id: string
          asset_tag: string
          name: string
          category: string
          serial_number: string | null
          purchase_date: string | null
          value: number | null
          status: string
          assigned_to: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          asset_tag: string
          name: string
          category: string
          serial_number?: string | null
          purchase_date?: string | null
          value?: number | null
          status?: string
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          asset_tag?: string
          name?: string
          category?: string
          serial_number?: string | null
          purchase_date?: string | null
          value?: number | null
          status?: string
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      candidates: {
        Row: {
          id: string
          organization_id: string
          candidate_code: string
          full_name: string
          email: string
          phone: string | null
          position: string
          department: string | null
          stage: string
          experience: string | null
          expected_ctc: string | null
          notice_period: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          candidate_code: string
          full_name: string
          email: string
          phone?: string | null
          position: string
          department?: string | null
          stage?: string
          experience?: string | null
          expected_ctc?: string | null
          notice_period?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          candidate_code?: string
          full_name?: string
          email?: string
          phone?: string | null
          position?: string
          department?: string | null
          stage?: string
          experience?: string | null
          expected_ctc?: string | null
          notice_period?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      onboarding_tasks: {
        Row: {
          id: string
          organization_id: string
          employee_id: string
          title: string
          category: string
          due_date: string | null
          completed: boolean
          assigned_role: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          employee_id: string
          title: string
          category?: string
          due_date?: string | null
          completed?: boolean
          assigned_role?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          employee_id?: string
          title?: string
          category?: string
          due_date?: string | null
          completed?: boolean
          assigned_role?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          id: string
          organization_id: string
          document_code: string
          title: string
          category: string
          file_url: string | null
          file_size: string | null
          uploaded_by: string | null
          security_classification: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          document_code: string
          title: string
          category: string
          file_url?: string | null
          file_size?: string | null
          uploaded_by?: string | null
          security_classification?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          document_code?: string
          title?: string
          category?: string
          file_url?: string | null
          file_size?: string | null
          uploaded_by?: string | null
          security_classification?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      helpdesk_tickets: {
        Row: {
          id: string
          organization_id: string
          ticket_code: string
          subject: string
          category: string
          priority: string
          status: string
          requester_id: string | null
          assigned_to: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          ticket_code: string
          subject: string
          category: string
          priority?: string
          status?: string
          requester_id?: string | null
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          ticket_code?: string
          subject?: string
          category?: string
          priority?: string
          status?: string
          requester_id?: string | null
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      vendors: {
        Row: {
          id: string
          organization_id: string
          vendor_code: string
          company_name: string
          category: string
          contact_person: string | null
          email: string | null
          phone: string | null
          contract_status: string
          annual_spend: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          vendor_code: string
          company_name: string
          category: string
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          contract_status?: string
          annual_spend?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          vendor_code?: string
          company_name?: string
          category?: string
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          contract_status?: string
          annual_spend?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          id: string
          organization_id: string | null
          actor_id: string | null
          entity_name: string
          entity_id: string | null
          action: string
          old_data: Json | null
          new_data: Json | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id?: string | null
          actor_id?: string | null
          entity_name: string
          entity_id?: string | null
          action: string
          old_data?: Json | null
          new_data?: Json | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string | null
          actor_id?: string | null
          entity_name?: string
          entity_id?: string | null
          action?: string
          old_data?: Json | null
          new_data?: Json | null
          ip_address?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
