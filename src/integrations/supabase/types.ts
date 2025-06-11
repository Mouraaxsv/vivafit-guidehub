export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      client_professionals: {
        Row: {
          client_id: string | null
          created_at: string
          id: string
          professional_id: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          id?: string
          professional_id?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string
          id?: string
          professional_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_professionals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_professionals_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      dicas_saude: {
        Row: {
          categoria: string | null
          conteudo: string
          criado_em: string | null
          id_dica: string
          titulo: string
        }
        Insert: {
          categoria?: string | null
          conteudo: string
          criado_em?: string | null
          id_dica?: string
          titulo: string
        }
        Update: {
          categoria?: string | null
          conteudo?: string
          criado_em?: string | null
          id_dica?: string
          titulo?: string
        }
        Relationships: []
      }
      perfil_saude: {
        Row: {
          altura: number | null
          estilo_de_vida: string | null
          habitos_alimentares: string | null
          id_perfil: string
          id_usuario: string | null
          peso: number | null
          rotina_exercicios: string | null
        }
        Insert: {
          altura?: number | null
          estilo_de_vida?: string | null
          habitos_alimentares?: string | null
          id_perfil?: string
          id_usuario?: string | null
          peso?: number | null
          rotina_exercicios?: string | null
        }
        Update: {
          altura?: number | null
          estilo_de_vida?: string | null
          habitos_alimentares?: string | null
          id_perfil?: string
          id_usuario?: string | null
          peso?: number | null
          rotina_exercicios?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "perfil_saude_id_usuario_fkey"
            columns: ["id_usuario"]
            isOneToOne: true
            referencedRelation: "usuarios"
            referencedColumns: ["id_usuario"]
          },
        ]
      }
      planos_personalizados: {
        Row: {
          criado_em: string | null
          descricao: string | null
          id_plano: string
          id_usuario: string | null
          tipo_plano: string | null
        }
        Insert: {
          criado_em?: string | null
          descricao?: string | null
          id_plano?: string
          id_usuario?: string | null
          tipo_plano?: string | null
        }
        Update: {
          criado_em?: string | null
          descricao?: string | null
          id_plano?: string
          id_usuario?: string | null
          tipo_plano?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "planos_personalizados_id_usuario_fkey"
            columns: ["id_usuario"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id_usuario"]
          },
        ]
      }
      progresso_usuario: {
        Row: {
          altura: number | null
          data_registro: string | null
          id_progresso: string
          id_usuario: string | null
          notas: string | null
          peso: number | null
        }
        Insert: {
          altura?: number | null
          data_registro?: string | null
          id_progresso?: string
          id_usuario?: string | null
          notas?: string | null
          peso?: number | null
        }
        Update: {
          altura?: number | null
          data_registro?: string | null
          id_progresso?: string
          id_usuario?: string | null
          notas?: string | null
          peso?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "progresso_usuario_id_usuario_fkey"
            columns: ["id_usuario"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id_usuario"]
          },
        ]
      }
      user_activities: {
        Row: {
          completed: boolean | null
          created_at: string
          description: string | null
          id: string
          scheduled_time: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          scheduled_time?: string | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          scheduled_time?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          created_at: string
          date: string
          hydration_progress: number | null
          id: string
          notes: string | null
          nutrition_progress: number | null
          sleep_progress: number | null
          user_id: string | null
          workout_progress: number | null
        }
        Insert: {
          created_at?: string
          date?: string
          hydration_progress?: number | null
          id?: string
          notes?: string | null
          nutrition_progress?: number | null
          sleep_progress?: number | null
          user_id?: string | null
          workout_progress?: number | null
        }
        Update: {
          created_at?: string
          date?: string
          hydration_progress?: number | null
          id?: string
          notes?: string | null
          nutrition_progress?: number | null
          sleep_progress?: number | null
          user_id?: string | null
          workout_progress?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          email: string | null
          fontSize: string | null
          highContrast: boolean | null
          id: string
          name: string
          physicalInfo: Json | null
          role: string | null
          theme: string | null
        }
        Insert: {
          email?: string | null
          fontSize?: string | null
          highContrast?: boolean | null
          id?: string
          name: string
          physicalInfo?: Json | null
          role?: string | null
          theme?: string | null
        }
        Update: {
          email?: string | null
          fontSize?: string | null
          highContrast?: boolean | null
          id?: string
          name?: string
          physicalInfo?: Json | null
          role?: string | null
          theme?: string | null
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          cpf: string
          data_criacao: string | null
          email: string
          id_usuario: string
          nome: string
          senha: string
          sobrenome: string
        }
        Insert: {
          cpf: string
          data_criacao?: string | null
          email: string
          id_usuario?: string
          nome: string
          senha: string
          sobrenome: string
        }
        Update: {
          cpf?: string
          data_criacao?: string | null
          email?: string
          id_usuario?: string
          nome?: string
          senha?: string
          sobrenome?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
