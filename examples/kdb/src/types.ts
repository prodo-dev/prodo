export interface KxEvent {
  time: string;
  sym: string;
}

export interface KxQuote extends KxEvent {
  ask: number;
  bid: number;
}

export interface KxTrade extends KxEvent {
  price: number;
  size: number;
}

interface AppEvent {
  time: Date;
  sym: string;
}

export interface Quote extends AppEvent {
  ask: number;
  bid: number;
}

export interface Trade extends AppEvent {
  price: number;
  size: number;
}
