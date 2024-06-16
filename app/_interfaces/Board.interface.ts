export type SushiOption = 'onigiri' | 'maki' | 'nigiri' | 'noodle' | 'rice' | 'temaki';
export type Position = { row: number; col: number; }[];

export interface BoardProps {
  boardSize: number;
  sushiOptions: SushiOption[];
}