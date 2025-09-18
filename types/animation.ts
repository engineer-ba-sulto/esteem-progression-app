export interface Particle {
  id: string;
  tx: number; // Target X offset for travel
  ty: number; // Target Y offset for travel
  size: number;
  color: string;
  animationDelay: string;
}

export interface Rocket {
  id: string;
  x: number; // X position (% of viewport)
  y: number; // Y position (% of viewport)
  animationDelay: string;
}

export interface FireworkInstance {
  rocket: Rocket;
  particles: Particle[];
  x: number; // Burst X position
  y: number; // Burst Y position
}

export interface ConfettiPiece {
  id: string;
  x: number;
  color: string;
  animationDelay: string;
  animationDuration: string;
  rotation: number;
}