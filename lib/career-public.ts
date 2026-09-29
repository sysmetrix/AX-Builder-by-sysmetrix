// The only career data the public site imports. Written by /admin on save.
// Only the 기본 정보 (profile) section can ever contain anything (lib/career.ts PUBLISHABLE).
import data from "@/content/career.public.json";
import { normalizeCareer, type CareerItem } from "./career";

export const publicProfile: CareerItem | undefined = normalizeCareer(data).sections.profile[0];
