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
      brew_logs: {
        Row: {
          brew_method: string
          brewed_at: string | null
          coffee_name: string
          created_at: string | null
          id: string
          notes: string | null
          rating: number | null
          user_id: string
        }
        Insert: {
          brew_method: string
          brewed_at?: string | null
          coffee_name: string
          created_at?: string | null
          id?: string
          notes?: string | null
          rating?: number | null
          user_id: string
        }
        Update: {
          brew_method?: string
          brewed_at?: string | null
          coffee_name?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          rating?: number | null
          user_id?: string
        }
        Relationships: []
      }
      coffee_scans: {
        Row: {
          ai_confidence: number | null
          coffee_id: string
          created_at: string | null
          id: string
          image_url: string
          match_reasons: string[] | null
          raw_ai_response: Json | null
          scanned_at: string | null
          tribe_match_score: number | null
          user_id: string
        }
        Insert: {
          ai_confidence?: number | null
          coffee_id: string
          created_at?: string | null
          id?: string
          image_url: string
          match_reasons?: string[] | null
          raw_ai_response?: Json | null
          scanned_at?: string | null
          tribe_match_score?: number | null
          user_id: string
        }
        Update: {
          ai_confidence?: number | null
          coffee_id?: string
          created_at?: string | null
          id?: string
          image_url?: string
          match_reasons?: string[] | null
          raw_ai_response?: Json | null
          scanned_at?: string | null
          tribe_match_score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coffee_scans_coffee_id_fkey"
            columns: ["coffee_id"]
            isOneToOne: false
            referencedRelation: "coffees"
            referencedColumns: ["id"]
          },
        ]
      }
      coffees: {
        Row: {
          acidity_score: number | null
          additional_image_urls: string[] | null
          ai_confidence: number | null
          altitude_meters: number | null
          awards: string[] | null
          body_score: number | null
          brand: string | null
          brand_story: string | null
          created_at: string | null
          created_by: string | null
          cupping_score: number | null
          description: string | null
          flavor_notes: string[] | null
          id: string
          image_url: string | null
          is_verified: boolean | null
          jargon_explanations: Json | null
          name: string
          origin_country: string | null
          origin_farm: string | null
          origin_region: string | null
          processing_method: string | null
          roast_level: Database["public"]["Enums"]["roast_level_enum"] | null
          roaster_id: string | null
          scanned_image_url: string | null
          source: Database["public"]["Enums"]["coffee_source"]
          sweetness_score: number | null
          updated_at: string | null
          variety: string | null
        }
        Insert: {
          acidity_score?: number | null
          additional_image_urls?: string[] | null
          ai_confidence?: number | null
          altitude_meters?: number | null
          awards?: string[] | null
          body_score?: number | null
          brand?: string | null
          brand_story?: string | null
          created_at?: string | null
          created_by?: string | null
          cupping_score?: number | null
          description?: string | null
          flavor_notes?: string[] | null
          id?: string
          image_url?: string | null
          is_verified?: boolean | null
          jargon_explanations?: Json | null
          name: string
          origin_country?: string | null
          origin_farm?: string | null
          origin_region?: string | null
          processing_method?: string | null
          roast_level?: Database["public"]["Enums"]["roast_level_enum"] | null
          roaster_id?: string | null
          scanned_image_url?: string | null
          source?: Database["public"]["Enums"]["coffee_source"]
          sweetness_score?: number | null
          updated_at?: string | null
          variety?: string | null
        }
        Update: {
          acidity_score?: number | null
          additional_image_urls?: string[] | null
          ai_confidence?: number | null
          altitude_meters?: number | null
          awards?: string[] | null
          body_score?: number | null
          brand?: string | null
          brand_story?: string | null
          created_at?: string | null
          created_by?: string | null
          cupping_score?: number | null
          description?: string | null
          flavor_notes?: string[] | null
          id?: string
          image_url?: string | null
          is_verified?: boolean | null
          jargon_explanations?: Json | null
          name?: string
          origin_country?: string | null
          origin_farm?: string | null
          origin_region?: string | null
          processing_method?: string | null
          roast_level?: Database["public"]["Enums"]["roast_level_enum"] | null
          roaster_id?: string | null
          scanned_image_url?: string | null
          source?: Database["public"]["Enums"]["coffee_source"]
          sweetness_score?: number | null
          updated_at?: string | null
          variety?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coffees_roaster_id_fkey"
            columns: ["roaster_id"]
            isOneToOne: false
            referencedRelation: "roasters"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_widgets: {
        Row: {
          config: Json | null
          created_at: string | null
          id: string
          is_visible: boolean | null
          position: Json | null
          updated_at: string | null
          user_id: string
          widget_type: Database["public"]["Enums"]["widget_type"]
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          id?: string
          is_visible?: boolean | null
          position?: Json | null
          updated_at?: string | null
          user_id: string
          widget_type: Database["public"]["Enums"]["widget_type"]
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          id?: string
          is_visible?: boolean | null
          position?: Json | null
          updated_at?: string | null
          user_id?: string
          widget_type?: Database["public"]["Enums"]["widget_type"]
        }
        Relationships: []
      }
      feedback: {
        Row: {
          created_at: string
          email: string | null
          id: string
          message: string
          name: string | null
          rating: number | null
          usage_summary: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          message: string
          name?: string | null
          rating?: number | null
          usage_summary?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          message?: string
          name?: string | null
          rating?: number | null
          usage_summary?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      learning_achievements: {
        Row: {
          category: string
          code: string
          condition_track:
            | Database["public"]["Enums"]["learning_track_id"]
            | null
          condition_type: string
          condition_value: number
          created_at: string
          description: string
          description_es: string
          icon: string
          id: string
          is_active: boolean
          name: string
          name_es: string
          sort_order: number
          xp_reward: number
        }
        Insert: {
          category?: string
          code: string
          condition_track?:
            | Database["public"]["Enums"]["learning_track_id"]
            | null
          condition_type?: string
          condition_value?: number
          created_at?: string
          description?: string
          description_es?: string
          icon?: string
          id?: string
          is_active?: boolean
          name: string
          name_es: string
          sort_order?: number
          xp_reward?: number
        }
        Update: {
          category?: string
          code?: string
          condition_track?:
            | Database["public"]["Enums"]["learning_track_id"]
            | null
          condition_type?: string
          condition_value?: number
          created_at?: string
          description?: string
          description_es?: string
          icon?: string
          id?: string
          is_active?: boolean
          name?: string
          name_es?: string
          sort_order?: number
          xp_reward?: number
        }
        Relationships: []
      }
      learning_exercises: {
        Row: {
          audio_url: string | null
          concept_tags: string[]
          created_at: string
          difficulty_score: number
          exercise_type: Database["public"]["Enums"]["exercise_type"]
          id: string
          image_url: string | null
          is_active: boolean
          lesson_id: string
          mascot: string
          mascot_mood: string
          question_data: Json
          sort_order: number
          updated_at: string
        }
        Insert: {
          audio_url?: string | null
          concept_tags?: string[]
          created_at?: string
          difficulty_score?: number
          exercise_type: Database["public"]["Enums"]["exercise_type"]
          id?: string
          image_url?: string | null
          is_active?: boolean
          lesson_id: string
          mascot?: string
          mascot_mood?: string
          question_data?: Json
          sort_order?: number
          updated_at?: string
        }
        Update: {
          audio_url?: string | null
          concept_tags?: string[]
          created_at?: string
          difficulty_score?: number
          exercise_type?: Database["public"]["Enums"]["exercise_type"]
          id?: string
          image_url?: string | null
          is_active?: boolean
          lesson_id?: string
          mascot?: string
          mascot_mood?: string
          question_data?: Json
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_exercises_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "learning_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_leagues: {
        Row: {
          color_hex: string
          created_at: string
          demote_bottom_n: number
          icon: string
          id: string
          name: string
          name_es: string
          promote_top_n: number
          tier: number
        }
        Insert: {
          color_hex?: string
          created_at?: string
          demote_bottom_n?: number
          icon?: string
          id?: string
          name: string
          name_es: string
          promote_top_n?: number
          tier: number
        }
        Update: {
          color_hex?: string
          created_at?: string
          demote_bottom_n?: number
          icon?: string
          id?: string
          name?: string
          name_es?: string
          promote_top_n?: number
          tier?: number
        }
        Relationships: []
      }
      learning_lessons: {
        Row: {
          created_at: string
          estimated_minutes: number
          exercise_count: number
          featured_coffee_id: string | null
          id: string
          intro_text: string
          intro_text_es: string
          is_active: boolean
          name: string
          name_es: string
          sort_order: number
          unit_id: string
          updated_at: string
          xp_reward: number
        }
        Insert: {
          created_at?: string
          estimated_minutes?: number
          exercise_count?: number
          featured_coffee_id?: string | null
          id?: string
          intro_text?: string
          intro_text_es?: string
          is_active?: boolean
          name: string
          name_es: string
          sort_order?: number
          unit_id: string
          updated_at?: string
          xp_reward?: number
        }
        Update: {
          created_at?: string
          estimated_minutes?: number
          exercise_count?: number
          featured_coffee_id?: string | null
          id?: string
          intro_text?: string
          intro_text_es?: string
          is_active?: boolean
          name?: string
          name_es?: string
          sort_order?: number
          unit_id?: string
          updated_at?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "learning_lessons_featured_coffee_id_fkey"
            columns: ["featured_coffee_id"]
            isOneToOne: false
            referencedRelation: "coffees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_lessons_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "learning_units"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_sections: {
        Row: {
          created_at: string
          description: string
          description_es: string
          id: string
          is_active: boolean
          learning_goal: string
          learning_goal_es: string
          level: Database["public"]["Enums"]["learning_level"]
          name: string
          name_es: string
          requires_section_id: string | null
          sort_order: number
          track_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          description_es?: string
          id?: string
          is_active?: boolean
          learning_goal?: string
          learning_goal_es?: string
          level: Database["public"]["Enums"]["learning_level"]
          name: string
          name_es: string
          requires_section_id?: string | null
          sort_order?: number
          track_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          description_es?: string
          id?: string
          is_active?: boolean
          learning_goal?: string
          learning_goal_es?: string
          level?: Database["public"]["Enums"]["learning_level"]
          name?: string
          name_es?: string
          requires_section_id?: string | null
          sort_order?: number
          track_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_sections_requires_section_id_fkey"
            columns: ["requires_section_id"]
            isOneToOne: false
            referencedRelation: "learning_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_sections_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "learning_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_tracks: {
        Row: {
          color_hex: string
          created_at: string
          description: string
          description_es: string
          icon: string
          id: string
          is_active: boolean
          is_bonus: boolean
          name: string
          name_es: string
          sort_order: number
          track_id: Database["public"]["Enums"]["learning_track_id"]
          updated_at: string
        }
        Insert: {
          color_hex?: string
          created_at?: string
          description: string
          description_es: string
          icon?: string
          id?: string
          is_active?: boolean
          is_bonus?: boolean
          name: string
          name_es: string
          sort_order?: number
          track_id: Database["public"]["Enums"]["learning_track_id"]
          updated_at?: string
        }
        Update: {
          color_hex?: string
          created_at?: string
          description?: string
          description_es?: string
          icon?: string
          id?: string
          is_active?: boolean
          is_bonus?: boolean
          name?: string
          name_es?: string
          sort_order?: number
          track_id?: Database["public"]["Enums"]["learning_track_id"]
          updated_at?: string
        }
        Relationships: []
      }
      learning_units: {
        Row: {
          created_at: string
          description: string
          description_es: string
          estimated_minutes: number
          icon: string
          id: string
          is_active: boolean
          lesson_count: number
          name: string
          name_es: string
          section_id: string
          sort_order: number
          tribe_affinity: Database["public"]["Enums"]["coffee_tribe"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          description_es?: string
          estimated_minutes?: number
          icon?: string
          id?: string
          is_active?: boolean
          lesson_count?: number
          name: string
          name_es: string
          section_id: string
          sort_order?: number
          tribe_affinity?: Database["public"]["Enums"]["coffee_tribe"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          description_es?: string
          estimated_minutes?: number
          icon?: string
          id?: string
          is_active?: boolean
          lesson_count?: number
          name?: string
          name_es?: string
          section_id?: string
          sort_order?: number
          tribe_affinity?: Database["public"]["Enums"]["coffee_tribe"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_units_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "learning_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "learning_achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_user_daily_goals: {
        Row: {
          date: string
          earned_xp: number
          goal_xp: number
          id: string
          is_achieved: boolean
          user_id: string
        }
        Insert: {
          date?: string
          earned_xp?: number
          goal_xp?: number
          id?: string
          is_achieved?: boolean
          user_id: string
        }
        Update: {
          date?: string
          earned_xp?: number
          goal_xp?: number
          id?: string
          is_achieved?: boolean
          user_id?: string
        }
        Relationships: []
      }
      learning_user_exercise_history: {
        Row: {
          attempted_at: string
          exercise_id: string
          id: string
          is_correct: boolean
          lesson_attempt_id: string | null
          time_spent_seconds: number
          user_answer: Json | null
          user_id: string
          was_review: boolean
        }
        Insert: {
          attempted_at?: string
          exercise_id: string
          id?: string
          is_correct?: boolean
          lesson_attempt_id?: string | null
          time_spent_seconds?: number
          user_answer?: Json | null
          user_id: string
          was_review?: boolean
        }
        Update: {
          attempted_at?: string
          exercise_id?: string
          id?: string
          is_correct?: boolean
          lesson_attempt_id?: string | null
          time_spent_seconds?: number
          user_answer?: Json | null
          user_id?: string
          was_review?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "learning_user_exercise_history_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "learning_exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_user_exercise_history_lesson_attempt_id_fkey"
            columns: ["lesson_attempt_id"]
            isOneToOne: false
            referencedRelation: "learning_user_progress"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_user_league: {
        Row: {
          created_at: string
          demoted_at: string | null
          id: string
          league_id: string
          previous_league_id: string | null
          promoted_at: string | null
          updated_at: string
          user_id: string
          week_start_date: string
          weekly_xp: number
        }
        Insert: {
          created_at?: string
          demoted_at?: string | null
          id?: string
          league_id: string
          previous_league_id?: string | null
          promoted_at?: string | null
          updated_at?: string
          user_id: string
          week_start_date?: string
          weekly_xp?: number
        }
        Update: {
          created_at?: string
          demoted_at?: string | null
          id?: string
          league_id?: string
          previous_league_id?: string | null
          promoted_at?: string | null
          updated_at?: string
          user_id?: string
          week_start_date?: string
          weekly_xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "learning_user_league_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "learning_leagues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_user_league_previous_league_id_fkey"
            columns: ["previous_league_id"]
            isOneToOne: false
            referencedRelation: "learning_leagues"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_user_progress: {
        Row: {
          attempt_count: number
          best_score_percent: number
          completed_at: string | null
          created_at: string
          exercises_correct: number
          exercises_total: number
          id: string
          is_completed: boolean
          lesson_id: string
          score_percent: number
          time_spent_seconds: number
          updated_at: string
          user_id: string
          xp_earned: number
        }
        Insert: {
          attempt_count?: number
          best_score_percent?: number
          completed_at?: string | null
          created_at?: string
          exercises_correct?: number
          exercises_total?: number
          id?: string
          is_completed?: boolean
          lesson_id: string
          score_percent?: number
          time_spent_seconds?: number
          updated_at?: string
          user_id: string
          xp_earned?: number
        }
        Update: {
          attempt_count?: number
          best_score_percent?: number
          completed_at?: string | null
          created_at?: string
          exercises_correct?: number
          exercises_total?: number
          id?: string
          is_completed?: boolean
          lesson_id?: string
          score_percent?: number
          time_spent_seconds?: number
          updated_at?: string
          user_id?: string
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "learning_user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "learning_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_user_streaks: {
        Row: {
          created_at: string
          current_streak: number
          hearts: number
          hearts_last_refilled_at: string | null
          id: string
          last_activity_date: string | null
          longest_streak: number
          max_hearts: number
          streak_freeze_used_today: boolean
          streak_freezes_available: number
          streak_start_date: string | null
          total_days_active: number
          total_lessons_completed: number
          total_xp: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number
          hearts?: number
          hearts_last_refilled_at?: string | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number
          max_hearts?: number
          streak_freeze_used_today?: boolean
          streak_freezes_available?: number
          streak_start_date?: string | null
          total_days_active?: number
          total_lessons_completed?: number
          total_xp?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number
          hearts?: number
          hearts_last_refilled_at?: string | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number
          max_hearts?: number
          streak_freeze_used_today?: boolean
          streak_freezes_available?: number
          streak_start_date?: string | null
          total_days_active?: number
          total_lessons_completed?: number
          total_xp?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          brewing_level: Database["public"]["Enums"]["brewing_level"] | null
          city: string | null
          coffee_tribe: Database["public"]["Enums"]["coffee_tribe"] | null
          cover_url: string | null
          created_at: string
          display_name: string | null
          id: string
          is_onboarded: boolean | null
          onboarded_at: string | null
          updated_at: string
          weekly_goal_target: number | null
        }
        Insert: {
          avatar_url?: string | null
          brewing_level?: Database["public"]["Enums"]["brewing_level"] | null
          city?: string | null
          coffee_tribe?: Database["public"]["Enums"]["coffee_tribe"] | null
          cover_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          is_onboarded?: boolean | null
          onboarded_at?: string | null
          updated_at?: string
          weekly_goal_target?: number | null
        }
        Update: {
          avatar_url?: string | null
          brewing_level?: Database["public"]["Enums"]["brewing_level"] | null
          city?: string | null
          coffee_tribe?: Database["public"]["Enums"]["coffee_tribe"] | null
          cover_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_onboarded?: boolean | null
          onboarded_at?: string | null
          updated_at?: string
          weekly_goal_target?: number | null
        }
        Relationships: []
      }
      recipes: {
        Row: {
          brew_method: string
          brew_time_seconds: number | null
          coffee_id: string | null
          created_at: string | null
          description: string | null
          grind_size: string | null
          id: string
          is_public: boolean | null
          name: string
          ratio: string | null
          steps: string[] | null
          updated_at: string | null
          user_id: string
          water_temp_celsius: number | null
        }
        Insert: {
          brew_method: string
          brew_time_seconds?: number | null
          coffee_id?: string | null
          created_at?: string | null
          description?: string | null
          grind_size?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          ratio?: string | null
          steps?: string[] | null
          updated_at?: string | null
          user_id: string
          water_temp_celsius?: number | null
        }
        Update: {
          brew_method?: string
          brew_time_seconds?: number | null
          coffee_id?: string | null
          created_at?: string | null
          description?: string | null
          grind_size?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          ratio?: string | null
          steps?: string[] | null
          updated_at?: string | null
          user_id?: string
          water_temp_celsius?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "recipes_coffee_id_fkey"
            columns: ["coffee_id"]
            isOneToOne: false
            referencedRelation: "coffees"
            referencedColumns: ["id"]
          },
        ]
      }
      roasters: {
        Row: {
          banner_url: string | null
          business_name: string
          certifications: string[] | null
          contact_email: string | null
          created_at: string | null
          description: string | null
          id: string
          is_verified: boolean | null
          location_city: string | null
          location_country: string | null
          logo_url: string | null
          slug: string
          updated_at: string | null
          user_id: string
          website: string | null
        }
        Insert: {
          banner_url?: string | null
          business_name: string
          certifications?: string[] | null
          contact_email?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_verified?: boolean | null
          location_city?: string | null
          location_country?: string | null
          logo_url?: string | null
          slug: string
          updated_at?: string | null
          user_id: string
          website?: string | null
        }
        Update: {
          banner_url?: string | null
          business_name?: string
          certifications?: string[] | null
          contact_email?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_verified?: boolean | null
          location_city?: string | null
          location_country?: string | null
          logo_url?: string | null
          slug?: string
          updated_at?: string | null
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      scan_error_reports: {
        Row: {
          coffee_brand: string | null
          coffee_id: string
          coffee_name: string | null
          created_at: string
          id: string
          scan_id: string | null
          suggested_edit: string
          user_id: string
        }
        Insert: {
          coffee_brand?: string | null
          coffee_id: string
          coffee_name?: string | null
          created_at?: string
          id?: string
          scan_id?: string | null
          suggested_edit: string
          user_id: string
        }
        Update: {
          coffee_brand?: string | null
          coffee_id?: string
          coffee_name?: string | null
          created_at?: string
          id?: string
          scan_id?: string | null
          suggested_edit?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scan_error_reports_coffee_id_fkey"
            columns: ["coffee_id"]
            isOneToOne: false
            referencedRelation: "coffees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scan_error_reports_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "coffee_scans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_coffee_favorites: {
        Row: {
          added_at: string | null
          coffee_id: string
          id: string
          user_id: string
        }
        Insert: {
          added_at?: string | null
          coffee_id: string
          id?: string
          user_id: string
        }
        Update: {
          added_at?: string | null
          coffee_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_coffee_favorites_coffee_id_fkey"
            columns: ["coffee_id"]
            isOneToOne: false
            referencedRelation: "coffees"
            referencedColumns: ["id"]
          },
        ]
      }
      user_coffee_inventory: {
        Row: {
          coffee_id: string
          created_at: string | null
          id: string
          notes: string | null
          opened_date: string | null
          purchase_date: string | null
          quantity_grams: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          coffee_id: string
          created_at?: string | null
          id?: string
          notes?: string | null
          opened_date?: string | null
          purchase_date?: string | null
          quantity_grams?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          coffee_id?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          opened_date?: string | null
          purchase_date?: string | null
          quantity_grams?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_coffee_inventory_coffee_id_fkey"
            columns: ["coffee_id"]
            isOneToOne: false
            referencedRelation: "coffees"
            referencedColumns: ["id"]
          },
        ]
      }
      user_coffee_ratings: {
        Row: {
          coffee_id: string
          created_at: string | null
          id: string
          updated_at: string | null
          user_acidity_score: number | null
          user_body_score: number | null
          user_flavor_notes: string[] | null
          user_id: string
          user_match_score: number | null
          user_sweetness_score: number | null
        }
        Insert: {
          coffee_id: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_acidity_score?: number | null
          user_body_score?: number | null
          user_flavor_notes?: string[] | null
          user_id: string
          user_match_score?: number | null
          user_sweetness_score?: number | null
        }
        Update: {
          coffee_id?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_acidity_score?: number | null
          user_body_score?: number | null
          user_flavor_notes?: string[] | null
          user_id?: string
          user_match_score?: number | null
          user_sweetness_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_coffee_ratings_coffee_id_fkey"
            columns: ["coffee_id"]
            isOneToOne: false
            referencedRelation: "coffees"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
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
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      update_streak_and_xp: {
        Args: { p_date: string; p_user_id: string; p_xp_earned: number }
        Returns: Json
      }
    }
    Enums: {
      app_role: "user" | "roaster" | "admin"
      brewing_level: "beginner" | "intermediate" | "expert"
      coffee_source: "scan" | "admin" | "roaster" | "import" | "manual"
      coffee_tribe: "fox" | "owl" | "hummingbird" | "bee"
      exercise_type:
        | "multiple_choice"
        | "fill_in_blank"
        | "true_false"
        | "matching_pairs"
        | "sequencing"
        | "image_identification"
        | "categorization"
        | "troubleshooting"
        | "recipe_building"
        | "prediction"
        | "comparison"
      learning_level:
        | "beginner"
        | "foundation"
        | "intermediate"
        | "advanced"
        | "expert"
      learning_track_id:
        | "history_culture"
        | "bean_knowledge"
        | "brewing_science"
        | "sustainability"
      roast_level_enum: "1" | "2" | "3" | "4" | "5"
      widget_type:
        | "welcome_hero"
        | "coffee_tribe"
        | "recent_scans"
        | "favorites"
        | "inventory"
        | "weekly_goal"
        | "brewing_level"
        | "quick_scan"
        | "recent_brews"
        | "recommendations"
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
      app_role: ["user", "roaster", "admin"],
      brewing_level: ["beginner", "intermediate", "expert"],
      coffee_source: ["scan", "admin", "roaster", "import", "manual"],
      coffee_tribe: ["fox", "owl", "hummingbird", "bee"],
      exercise_type: [
        "multiple_choice",
        "fill_in_blank",
        "true_false",
        "matching_pairs",
        "sequencing",
        "image_identification",
        "categorization",
        "troubleshooting",
        "recipe_building",
        "prediction",
        "comparison",
      ],
      learning_level: [
        "beginner",
        "foundation",
        "intermediate",
        "advanced",
        "expert",
      ],
      learning_track_id: [
        "history_culture",
        "bean_knowledge",
        "brewing_science",
        "sustainability",
      ],
      roast_level_enum: ["1", "2", "3", "4", "5"],
      widget_type: [
        "welcome_hero",
        "coffee_tribe",
        "recent_scans",
        "favorites",
        "inventory",
        "weekly_goal",
        "brewing_level",
        "quick_scan",
        "recent_brews",
        "recommendations",
      ],
    },
  },
} as const
