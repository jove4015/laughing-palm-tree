import { JwtPayload } from "@clerk/types";

export interface kiefaCustomJWTTemplate extends JwtPayload {
  siteAdmin: boolean;
  timeZone: string;
  incidentNotifications: boolean;
  facilities: number[];
  teamId?: number;
}
