// Browser-side GitHub Contents API client for /admin. No server and no stored secret:
// the owner pastes a fine-grained token (contents read/write on the two repositories below)
// into their own browser. Without that token this code can read or write nothing.

export const OWNER = "sysmetrix";
export const PRIVATE_REPO = `${OWNER}/ax-builder-career`;
export const PRIVATE_PATH = "career.json";
export const PUBLIC_REPO = `${OWNER}/AX-Builder-by-sysmetrix`;
export const PUBLIC_PATH = "content/career.public.json";
export const BRANCH = "main";

const API = "https://api.github.com";

function headers(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function encode(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

function decode(b64: string): string {
  const bin = atob(b64.replace(/\n/g, ""));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

async function fail(res: Response, what: string): Promise<never> {
  const hint = res.status === 401 ? "토큰이 올바르지 않거나 만료되었습니다."
    : res.status === 403 ? "토큰에 이 저장소의 쓰기 권한이 없습니다."
    : res.status === 404 ? "저장소를 찾을 수 없거나 토큰에 접근 권한이 없습니다."
    : res.status === 409 ? "다른 곳에서 먼저 저장되었습니다. 새로고침 후 다시 시도하세요."
    : `GitHub 응답 ${res.status}`;
  throw new Error(`${what}: ${hint}`);
}

export async function whoAmI(token: string): Promise<string> {
  const res = await fetch(`${API}/user`, { headers: headers(token) });
  if (!res.ok) await fail(res, "로그인 확인");
  return (await res.json()).login as string;
}

export async function readFile(token: string, repo: string, path: string, ref: string = BRANCH): Promise<{ text: string; sha: string } | null> {
  const res = await fetch(`${API}/repos/${repo}/contents/${path}?ref=${encodeURIComponent(ref)}`, { headers: headers(token), cache: "no-store" });
  if (res.status === 404) {
    // 404 means either "no file yet" or "no access"; tell them apart with the repository itself.
    const repoRes = await fetch(`${API}/repos/${repo}`, { headers: headers(token) });
    if (!repoRes.ok) await fail(repoRes, `${repo} 읽기`);
    return null;
  }
  if (!res.ok) await fail(res, `${repo} 읽기`);
  const json = await res.json();
  return { text: decode(json.content), sha: json.sha };
}

export async function writeFile(token: string, repo: string, path: string, text: string, sha: string | undefined, message: string): Promise<string> {
  const res = await fetch(`${API}/repos/${repo}/contents/${path}`, {
    method: "PUT",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify({ message, content: encode(text), branch: BRANCH, ...(sha ? { sha } : {}) }),
  });
  if (!res.ok) await fail(res, `${repo} 저장`);
  return (await res.json()).content.sha as string;
}

export interface Revision { sha: string; date: string; message: string }

/** Saved versions of one file, newest first. */
export async function listRevisions(token: string, repo: string, path: string, count = 50): Promise<Revision[]> {
  const res = await fetch(`${API}/repos/${repo}/commits?path=${encodeURIComponent(path)}&sha=${BRANCH}&per_page=${count}`, { headers: headers(token), cache: "no-store" });
  if (!res.ok) await fail(res, "변경 기록 읽기");
  const list = (await res.json()) as { sha: string; commit: { message: string; committer: { date: string } } }[];
  return list.map((c) => ({ sha: c.sha, date: c.commit.committer.date, message: c.commit.message.split("\n")[0] }));
}
