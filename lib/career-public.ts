// The only career data the public site imports. Written by /admin on save (items marked public only).
import data from "@/content/career.public.json";
import { byRecent, normalizeCareer, type CareerItem, type PublicCareer } from "./career";

export const publicCareer: PublicCareer = normalizeCareer(data);

const s = publicCareer.sections;
export const publicProfile: CareerItem | undefined = s.profile[0];
export const publicContacts = s.contacts;
export const publicTimeline = byRecent([...s.experience, ...s.youthPrograms]);
export const hasPublicCareer = Object.values(s).some((list) => list.length > 0);
