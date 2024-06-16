export type Cell = string | null;

export type BoardInterface = Cell[][];

export type Match = {
  row: number;
  col: number;
  length: number;
  horizontal: boolean;
};

export type SwapInfo = {
  row1: number;
  col1: number;
  row2: number;
  col2: number;
} | null;

export type MatchIndicator = Match & { score: number; };