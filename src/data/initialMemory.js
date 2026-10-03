export const INITIAL_FORGOTTEN_MEMORY = [
  {
    id: "mem_1",
    itemName: "Laptop Charger (65W Wall Brick)",
    tripContext: "Hostel to Home",
    timesForgotten: 3,
    urgency: "critical", // critical, high, moderate
    lastIncident: "Left plugged into wall outlet behind desk in Block C-402. Alex had to borrow a slow 10W phone charger for 3 days at home.",
    learningRule: "Always check the wall socket behind the desk during exit scan. Proactively place at top of checklist with audible warning."
  },
  {
    id: "mem_2",
    itemName: "USB-C to HDMI Display Dongle",
    tripContext: "College Presentation",
    timesForgotten: 2,
    urgency: "critical",
    lastIncident: "Arrived at seminar hall without video adapter. Auditorium only had VGA/HDMI. Panicked 10 mins before opening remarks.",
    learningRule: "Whenever trip purpose includes 'Presentation' or 'Conference', elevate HDMI adapter to #1 priority regardless of bag type."
  },
  {
    id: "mem_3",
    itemName: "College ID Card & Hostel Gate Pass",
    tripContext: "Hostel to Home",
    timesForgotten: 2,
    urgency: "high",
    lastIncident: "Forgot lanyard on study board. Returned Sunday night at 11 PM and security guard delayed entry for 40 minutes.",
    learningRule: "Hostel exit protocol must mandate physical check of wallet/lanyard before room key is turned."
  },
  {
    id: "mem_4",
    itemName: "Prescription Allergy Medication (Cetirizine)",
    tripContext: "Hostel to Home",
    timesForgotten: 1,
    urgency: "moderate",
    lastIncident: "Forgot strip of meds on bathroom shelf. Woke up with dust allergies at home.",
    learningRule: "Personal health items take precedence over clothes."
  }
];

const STORAGE_KEY = "checkmate_forgotten_memory_v1";

export function loadMemory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn("Failed to load memory from localStorage, using initial:", e);
  }
  return INITIAL_FORGOTTEN_MEMORY;
}

export function saveMemory(memoryList) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryList));
  } catch (e) {
    console.error("Failed to save memory:", e);
  }
}

export function recordForgottenItem(memoryList, itemName, tripContext, incidentNote) {
  const existingIndex = memoryList.findIndex(
    m => m.itemName.toLowerCase().trim() === itemName.toLowerCase().trim()
  );

  let updatedList;
  if (existingIndex >= 0) {
    const existing = memoryList[existingIndex];
    const newCount = existing.timesForgotten + 1;
    const newUrgency = newCount >= 3 ? "critical" : "high";
    const updated = {
      ...existing,
      timesForgotten: newCount,
      urgency: newUrgency,
      lastIncident: incidentNote || `Forgotten again during recent ${tripContext} trip.`,
      tripContext: tripContext || existing.tripContext
    };
    updatedList = [...memoryList];
    updatedList[existingIndex] = updated;
  } else {
    const newItem = {
      id: "mem_" + Date.now(),
      itemName: itemName,
      tripContext: tripContext || "General Trip",
      timesForgotten: 1,
      urgency: "high",
      lastIncident: incidentNote || `Reported forgotten during exit check.`,
      learningRule: `CheckMate flagged: proactively verify this item for future ${tripContext} trips.`
    };
    updatedList = [newItem, ...memoryList];
  }

  saveMemory(updatedList);
  return updatedList;
}

export function resetMemoryToDefault() {
  saveMemory(INITIAL_FORGOTTEN_MEMORY);
  return INITIAL_FORGOTTEN_MEMORY;
}
