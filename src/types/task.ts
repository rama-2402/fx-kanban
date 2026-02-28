export type TaskStatus =
  | 'Completed'
  | 'In progress'
  | 'On hold'
  | 'Yet to start'
  | 'Not started yet';

export interface FXTask {
  id: string;
  week_label: string;
  week_start_date?: string;
  fsd_presented?: string;
  status: TaskStatus;
  design_start_date?: string;
  design_end_date?: string;
  apl?: string;
  feature_name: string;
  pm?: string;
  designer?: string;
  task_description?: string;
  demo_date?: string;
  created_at: string;
  updated_at: string;
}

export type NewFXTask = Omit<FXTask, 'id' | 'created_at' | 'updated_at'>;
