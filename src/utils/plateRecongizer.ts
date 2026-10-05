
const TOKEN = process.env.EXPO_PUBLIC_PLATE_TOKEN || '';
export type ApiPlate = { plate: string; country: string; vehicleType: string; candidates: string[]; };

export async function readPlate(base64: string): Promise<ApiPlate> {
  if (!TOKEN) throw new Error("Missing API token. Check your .env file.");

  const res = await fetch("https://api.platerecognizer.com/v1/plate-reader/", {
    method: "POST",
    headers: {
      Authorization: `Token ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ upload: base64 }), 
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await res.text()}`);
  }

  const json = await res.json();
  // console.log(JSON.stringify(json, null, 2));
  const top = json.results?.[0];
  return {
    plate: top?.plate ?? "",
    country: top?.region?.code ?? "",
    vehicleType: top?.vehicle?.type ?? "",
    candidates: (top?.candidates ?? []).map((c: any) => c.plate as string),
  };
}