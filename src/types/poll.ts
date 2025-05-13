export interface Poll {
  id: string;
  question: string;
  options: string[];
  expiresAt: Date;
  votes: Record<string, number>;
  tally: number[];
  closed: boolean;
}
