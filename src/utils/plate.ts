const STATES: Record<string, string> = {
    AN: "Andaman and Nicobar Islands", AP: "Andhra Pradesh", AR: "Arunachal Pradesh",
    AS: "Assam", BR: "Bihar", CG: "Chhattisgarh", CH: "Chandigarh",
    DD: "Daman and Diu", DL: "Delhi", DN: "Dadra and Nagar Haveli and Daman and Diu",
    GA: "Goa", GJ: "Gujarat", HP: "Himachal Pradesh", HR: "Haryana",
    JH: "Jharkhand", JK: "Jammu and Kashmir", KA: "Karnataka", KL: "Kerala",
    LA: "Ladakh", LD: "Lakshadweep", MH: "Maharashtra", ML: "Meghalaya",
    MN: "Manipur", MP: "Madhya Pradesh", MZ: "Mizoram", NL: "Nagaland",
    OD: "Odisha", OR: "Odisha", PB: "Punjab", PY: "Puducherry",
    RJ: "Rajasthan", SK: "Sikkim", TN: "Tamil Nadu", TR: "Tripura",
    TS: "Telangana", UK: "Uttarakhand", UP: "Uttar Pradesh", WB: "West Bengal",
  };
  
  export type PlateResult = { plate: string; state: string; country?: string; vehicleType?: string; candidates?: string[]; };
  
  export const NOT_FOUND: PlateResult = { plate: "Not found", state: "Not found", country: "Not found", vehicleType: "Not found" };
  
  export function extractPlate(rawText: string): PlateResult {
    const clean = rawText.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!clean) return NOT_FOUND;
  
    // Standard format: UP 16 AB 1234
    const m = clean.match(/([A-Z]{2})(\d{1,2})([A-Z]{1,3})(\d{4})/);
    if (m) {
      const [, code, rto, series, num] = m;
      return {
        plate: `${code} ${rto} ${series} ${num}`,
        state: STATES[code] ?? "Not found",
      };
    }
  
    // Bharat series: 22 BH 1234 AA
    const bh = clean.match(/(\d{2})BH(\d{4})([A-Z]{1,2})/);
    if (bh) {
      return {
        plate: `${bh[1]} BH ${bh[2]} ${bh[3]}`,
        state: "Bharat (BH) series - valid across India",
      };
    }
  
    return NOT_FOUND;
  }


  