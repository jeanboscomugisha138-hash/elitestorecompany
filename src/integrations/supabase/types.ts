export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      daily_bonuses: {
        Row: {
          amount: number
          claimed_at: string
          id: string
          user_id: string
        }
        Insert: {
          amount?: number
          claimed_at?: string
          id?: string
          user_id: string
        }
        Update: {
          amount?: number
          claimed_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      deposit_transactions: {
        Row: {
          amount: number
          created_at: string
          full_name: string
          id: string
          phone: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          full_name: string
          id?: string
          phone: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          full_name?: string
          id?: string
          phone?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      gift_code_redemptions: {
        Row: {
          amount: number
          gift_code_id: string
          id: string
          redeemed_at: string
          user_id: string
        }
        Insert: {
          amount: number
          gift_code_id: string
          id?: string
          redeemed_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          gift_code_id?: string
          id?: string
          redeemed_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gift_code_redemptions_gift_code_id_fkey"
            columns: ["gift_code_id"]
            isOneToOne: false
            referencedRelation: "gift_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      gift_codes: {
        Row: {
          amount: number
          code: string
          created_at: string
          current_uses: number
          id: string
          is_active: boolean
          max_uses: number
        }
        Insert: {
          amount: number
          code: string
          created_at?: string
          current_uses?: number
          id?: string
          is_active?: boolean
          max_uses?: number
        }
        Update: {
          amount?: number
          code?: string
          created_at?: string
          current_uses?: number
          id?: string
          is_active?: boolean
          max_uses?: number
        }
        Relationships: []
      }
      investment_products: {
        Row: {
          created_at: string
          daily_profit_rate: number
          duration_days: number
          id: string
          investment_amount: number
          is_active: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          daily_profit_rate?: number
          duration_days?: number
          id?: string
          investment_amount: number
          is_active?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          daily_profit_rate?: number
          duration_days?: number
          id?: string
          investment_amount?: number
          is_active?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          invested_amount: number
          last_bonus_claim: string | null
          main_balance: number
          phone: string
          referral_balance: number
          referral_code: string | null
          referred_by: string | null
          total_profit: number
          updated_at: string
          user_id: string
          withdraw_name: string | null
          withdraw_password: string | null
          withdraw_phone: string | null
        }
        Insert: {
          created_at?: string
          full_name: string
          id?: string
          invested_amount?: number
          last_bonus_claim?: string | null
          main_balance?: number
          phone: string
          referral_balance?: number
          referral_code?: string | null
          referred_by?: string | null
          total_profit?: number
          updated_at?: string
          user_id: string
          withdraw_name?: string | null
          withdraw_password?: string | null
          withdraw_phone?: string | null
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          invested_amount?: number
          last_bonus_claim?: string | null
          main_balance?: number
          phone?: string
          referral_balance?: number
          referral_code?: string | null
          referred_by?: string | null
          total_profit?: number
          updated_at?: string
          user_id?: string
          withdraw_name?: string | null
          withdraw_password?: string | null
          withdraw_phone?: string | null
        }
        Relationships: []
      }
      referral_earnings: {
        Row: {
          amount: number
          created_at: string
          from_user_id: string
          id: string
          level: number
          source_investment_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          from_user_id: string
          id?: string
          level: number
          source_investment_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          from_user_id?: string
          id?: string
          level?: number
          source_investment_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_earnings_source_investment_id_fkey"
            columns: ["source_investment_id"]
            isOneToOne: false
            referencedRelation: "user_investments"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      user_investments: {
        Row: {
          amount: number
          created_at: string
          daily_profit: number
          end_date: string
          id: string
          product_id: string
          start_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          daily_profit: number
          end_date: string
          id?: string
          product_id: string
          start_date?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          daily_profit?: number
          end_date?: string
          id?: string
          product_id?: string
          start_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_investments_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "investment_products"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      withdrawal_transactions: {
        Row: {
          amount: number
          created_at: string
          full_name: string
          id: string
          phone: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          full_name: string
          id?: string
          phone: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          full_name?: string
          id?: string
          phone?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_referral_code: { Args: never; Returns: string }
      get_team_members: {
        Args: { _user_id: string }
        Returns: {
          created_at: string
          full_name: string
          id: string
          invested_amount: number
          level: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
