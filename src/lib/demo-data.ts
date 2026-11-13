export type QualityStatus = "PASS" | "FAIL" | "INVALID";
export type EventSeverity = "critical" | "high" | "medium" | "low";
export type EventStatus = "open" | "acknowledged" | "investigating" | "resolved";
export type UserRole = "administrator" | "qualityEngineer" | "operator" | "viewer";

export type Gateway = {
  id: string;
  name: string;
  protocol: string;
  address: string;
  online: boolean;
  lastHeartbeat: string;
  messageCount: number;
  errors: number;
};

export type Instrument = {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  type: string;
  line: string;
  gatewayId: string;
  online: boolean;
  lastSeen: string;
  firmware: string;
  calibrationDue: string;
};

export type Part = {
  number: string;
  name: string;
  revision: string;
  characteristic: string;
  nominal: number;
  lsl: number;
  usl: number;
  unit: string;
  active: boolean;
};

export type Measurement = {
  id: string;
  timestamp: string;
  partNumber: string;
  batchId: string;
  serialNumber: string;
  characteristic: string;
  value: number | null;
  unit: string;
  instrumentId: string;
  operator: string;
  status: QualityStatus;
};

export type QualityEvent = {
  id: string;
  type: string;
  severity: EventSeverity;
  description: string;
  descriptionMeasurementId?: string;
  timestamp: string;
  source: string;
  measurementId: string;
  status: EventStatus;
  assignedTo: string;
  notes: string;
  rootCause?: string;
  correctiveActions?: string[];
  correctiveActionCompleted?: boolean[];
  statusHistory?: { status: EventStatus; timestamp: string }[];
};

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
};

export type WorkspaceSettings = {
  plantName: string;
  productionLine: string;
  timezone: string;
  decimalPrecision: number;
  demoIntervalSeconds: number;
  theme: "light" | "dark";
};

export type DemoData = {
  version: 2;
  gateways: Gateway[];
  instruments: Instrument[];
  parts: Part[];
  measurements: Measurement[];
  events: QualityEvent[];
  users: DemoUser[];
  settings: WorkspaceSettings;
};

const demoTextIds = [
  "gatewayAssembly",
  "gatewayFinishing",
  "protocolOpcUa",
  "protocolModbusTcp",
  "instrumentWidthLaserA",
  "instrumentWidthLaserB",
  "instrumentHeightProbeC",
  "instrumentReferenceGauge",
  "manufacturerDemoMetrology",
  "manufacturerPrecisionWorks",
  "manufacturerNewDemoDevice",
  "modelLm240",
  "modelHp90",
  "modelRg12",
  "typeLaserDisplacement",
  "typeDigitalProbe",
  "typeDigitalGauge",
  "lineAssembly1",
  "lineFinishing",
  "lineInspection",
  "partMountingBracket",
  "partRotorHousing",
  "partValveStem",
  "characteristicWidth",
  "characteristicDiameter",
  "characteristicLength",
  "operatorPatel",
  "operatorChen",
  "operatorKumar",
  "userQualityTeam",
  "userPatel",
  "userChen",
  "userReadOnlyDemo",
  "plantName",
  "eventOutOfTolerance",
  "instrumentDisconnected",
  "qualityEvent",
  "manualEntry",
  "unassigned",
  "measurementOutsideSpecification",
  "instrumentDisconnectedMessage",
] as const;

type DemoTextId = (typeof demoTextIds)[number];

export function demoTranslationKey(value: string): `demo.${DemoTextId}` | null {
  return demoTextIds.some((id) => id === value)
    ? `demo.${value as DemoTextId}`
    : null;
}

export function measurementStatus(
  value: number | null,
  part: Part | undefined,
): QualityStatus {
  if (value === null || !Number.isFinite(value) || !part) return "INVALID";
  return value >= part.lsl && value <= part.usl ? "PASS" : "FAIL";
}

export function createDemoData(now = Date.now()): DemoData {
  const isoMinutesAgo = (minutes: number) =>
    new Date(now - minutes * 60_000).toISOString();
  const gateways: Gateway[] = [
    {
      id: "GW-001",
      name: "gatewayAssembly",
      protocol: "protocolOpcUa",
      address: "192.168.1.21",
      online: true,
      lastHeartbeat: isoMinutesAgo(1),
      messageCount: 18_420,
      errors: 2,
    },
    {
      id: "GW-002",
      name: "gatewayFinishing",
      protocol: "protocolModbusTcp",
      address: "192.168.1.22",
      online: true,
      lastHeartbeat: isoMinutesAgo(2),
      messageCount: 12_806,
      errors: 0,
    },
  ];
  const instruments: Instrument[] = [
    {
      id: "INS-001",
      name: "instrumentWidthLaserA",
      manufacturer: "manufacturerDemoMetrology",
      model: "modelLm240",
      type: "typeLaserDisplacement",
      line: "lineAssembly1",
      gatewayId: "GW-001",
      online: true,
      lastSeen: isoMinutesAgo(1),
      firmware: "2.4.1",
      calibrationDue: "2026-12-15",
    },
    {
      id: "INS-002",
      name: "instrumentWidthLaserB",
      manufacturer: "manufacturerDemoMetrology",
      model: "modelLm240",
      type: "typeLaserDisplacement",
      line: "lineAssembly1",
      gatewayId: "GW-001",
      online: true,
      lastSeen: isoMinutesAgo(2),
      firmware: "2.4.1",
      calibrationDue: "2026-11-20",
    },
    {
      id: "INS-003",
      name: "instrumentHeightProbeC",
      manufacturer: "manufacturerPrecisionWorks",
      model: "modelHp90",
      type: "typeDigitalProbe",
      line: "lineFinishing",
      gatewayId: "GW-002",
      online: true,
      lastSeen: isoMinutesAgo(1),
      firmware: "1.8.0",
      calibrationDue: "2026-10-28",
    },
    {
      id: "INS-004",
      name: "instrumentReferenceGauge",
      manufacturer: "manufacturerPrecisionWorks",
      model: "modelRg12",
      type: "typeDigitalGauge",
      line: "lineInspection",
      gatewayId: "GW-002",
      online: false,
      lastSeen: isoMinutesAgo(72),
      firmware: "1.6.2",
      calibrationDue: "2026-08-31",
    },
  ];
  const parts: Part[] = [
    {
      number: "P001",
      name: "partMountingBracket",
      revision: "C",
      characteristic: "characteristicWidth",
      nominal: 24.25,
      lsl: 24,
      usl: 24.5,
      unit: "millimeter",
      active: true,
    },
    {
      number: "P002",
      name: "partRotorHousing",
      revision: "A",
      characteristic: "characteristicDiameter",
      nominal: 52,
      lsl: 51.7,
      usl: 52.3,
      unit: "millimeter",
      active: true,
    },
    {
      number: "P003",
      name: "partValveStem",
      revision: "B",
      characteristic: "characteristicLength",
      nominal: 81.5,
      lsl: 81.1,
      usl: 81.9,
      unit: "millimeter",
      active: true,
    },
  ];
  const measurements = Array.from({ length: 120 }, (_, index) => {
    const part = parts[index % parts.length];
    const drift = Math.sin(index * 1.7) * (part.usl - part.lsl) * 0.28;
    const outOfSpec = index % 29 === 0;
    const invalid = index === 17;
    const value = invalid
      ? null
      : Number(
          (
            part.nominal +
            drift +
            (outOfSpec
              ? index % 2 === 0
                ? (part.usl - part.nominal) * 1.3
                : (part.lsl - part.nominal) * 1.3
              : 0)
          ).toFixed(3),
        );
    return {
      id: `ME-${String(10_000 + index)}`,
      timestamp: isoMinutesAgo((119 - index) * 12),
      partNumber: part.number,
      batchId: `B-${String(260_100 + Math.floor(index / 12))}`,
      serialNumber: `SN-${String(70_000 + index)}`,
      characteristic: part.characteristic,
      value,
      unit: part.unit,
      instrumentId: instruments[index % 3].id,
      operator: ["operatorPatel", "operatorChen", "operatorKumar"][index % 3],
      status: measurementStatus(value, part),
    } satisfies Measurement;
  });
  const failed = measurements.filter((measurement) => measurement.status === "FAIL");
  const events: QualityEvent[] = failed.slice(0, 3).map((measurement, index) => ({
    id: `QE-${String(3001 + index)}`,
    type: "eventOutOfTolerance",
    severity: index === 0 ? "high" : "medium",
    description: "measurementOutsideSpecification",
    descriptionMeasurementId: measurement.id,
    timestamp: measurement.timestamp,
    source: measurement.instrumentId,
    measurementId: measurement.id,
    status: index === 0 ? "open" : "acknowledged",
    assignedTo: index === 0 ? "unassigned" : "operatorPatel",
    notes: "",
  }));

  return {
    version: 2,
    gateways,
    instruments,
    parts,
    measurements,
    events,
    users: [
      { id: "U-001", name: "userQualityTeam", email: "quality@example.demo", role: "administrator", active: true },
      { id: "U-002", name: "userPatel", email: "apatel@example.demo", role: "qualityEngineer", active: true },
      { id: "U-003", name: "userChen", email: "mchen@example.demo", role: "operator", active: true },
      { id: "U-004", name: "userReadOnlyDemo", email: "viewer@example.demo", role: "viewer", active: true },
    ],
    settings: {
      plantName: "plantName",
      productionLine: "lineAssembly1",
      timezone: "Asia/Kolkata",
      decimalPrecision: 3,
      demoIntervalSeconds: 5,
      theme: "light",
    },
  };
}

const legacyValues: Record<string, Record<string, string>> = {
  gateways: {
    "Assembly gateway": "gatewayAssembly",
    "Finishing gateway": "gatewayFinishing",
    "OPC UA": "protocolOpcUa",
    "Modbus TCP": "protocolModbusTcp",
  },
  instruments: {
    "Width laser A": "instrumentWidthLaserA",
    "Width laser B": "instrumentWidthLaserB",
    "Height probe C": "instrumentHeightProbeC",
    "Reference gauge": "instrumentReferenceGauge",
    "Demo Metrology": "manufacturerDemoMetrology",
    "Precision Works": "manufacturerPrecisionWorks",
    "Demo device": "manufacturerNewDemoDevice",
    "LM-240": "modelLm240",
    "HP-90": "modelHp90",
    "RG-12": "modelRg12",
    "Laser displacement": "typeLaserDisplacement",
    "Digital probe": "typeDigitalProbe",
    "Digital gauge": "typeDigitalGauge",
    "Assembly 1": "lineAssembly1",
    Finishing: "lineFinishing",
    Inspection: "lineInspection",
  },
  parts: {
    "Mounting bracket": "partMountingBracket",
    "Rotor housing": "partRotorHousing",
    "Valve stem": "partValveStem",
    Width: "characteristicWidth",
    Diameter: "characteristicDiameter",
    Length: "characteristicLength",
    mm: "millimeter",
  },
  measurements: {
    "A. Patel": "operatorPatel",
    "M. Chen": "operatorChen",
    "S. Kumar": "operatorKumar",
    mm: "millimeter",
    Width: "characteristicWidth",
    Diameter: "characteristicDiameter",
    Length: "characteristicLength",
  },
  events: {
    "Out-of-tolerance measurement": "eventOutOfTolerance",
    "Instrument disconnected": "instrumentDisconnected",
    "Quality event": "qualityEvent",
    "A. Patel": "operatorPatel",
    "Unassigned": "unassigned",
    "Manual entry": "manualEntry",
  },
  users: {
    "Quality Team": "userQualityTeam",
    "A. Patel": "userPatel",
    "M. Chen": "userChen",
    "Read-only Demo": "userReadOnlyDemo",
  },
  settings: {
    "GAP-IT Demo Plant": "plantName",
    "Assembly 1": "lineAssembly1",
  },
};

const legacyEventStatuses: Record<string, EventStatus> = {
  Open: "open",
  Acknowledged: "acknowledged",
  Investigating: "investigating",
  Resolved: "resolved",
};

const legacySeverities: Record<string, EventSeverity> = {
  Critical: "critical",
  High: "high",
  Medium: "medium",
  Low: "low",
};

const legacyRoles: Record<string, UserRole> = {
  Administrator: "administrator",
  "Quality Engineer": "qualityEngineer",
  Operator: "operator",
  Viewer: "viewer",
};

function migrateKnownText(collection: keyof typeof legacyValues, value: string) {
  return legacyValues[collection][value] ?? value;
}

export function migrateDemoData(value: unknown): DemoData | null {
  if (
    value === null ||
    typeof value !== "object" ||
    !("measurements" in value) ||
    !("parts" in value) ||
    !("instruments" in value) ||
    !("gateways" in value) ||
    !("settings" in value)
  ) {
    return null;
  }

  const saved = value as Partial<DemoData> & Record<string, unknown>;
  const defaults = createDemoData();
  const savedSettings = saved.settings ?? defaults.settings;
  if (!Array.isArray(saved.measurements) || !Array.isArray(saved.parts)) return null;

  const migratedEvents = (Array.isArray(saved.events) ? saved.events : defaults.events).map((event) => ({
    ...event,
    type: typeof event.type === "string" ? migrateKnownText("events", event.type) : event.type,
    severity: legacySeverities[String(event.severity)] ?? event.severity,
    status: legacyEventStatuses[String(event.status)] ?? event.status,
    assignedTo: typeof event.assignedTo === "string" ? migrateKnownText("events", event.assignedTo) : event.assignedTo,
    statusHistory: event.statusHistory?.map((entry) => ({
      ...entry,
      status: legacyEventStatuses[String(entry.status)] ?? entry.status,
    })),
    ...(typeof event.description === "string" &&
    event.description.includes(" measured ") &&
    event.description.endsWith(", outside specification.")
      ? {
          description: "measurementOutsideSpecification",
          descriptionMeasurementId: event.measurementId,
        }
      : typeof event.description === "string" &&
          event.description.endsWith(" was marked offline in the demo simulator.")
        ? { description: "instrumentDisconnectedMessage" }
        : {}),
  }));

  return {
    ...defaults,
    ...saved,
    version: 2,
    gateways: (saved.gateways ?? defaults.gateways).map((gateway) => ({
      ...gateway,
      name: migrateKnownText("gateways", gateway.name),
      protocol: migrateKnownText("gateways", gateway.protocol),
    })),
    instruments: (saved.instruments ?? defaults.instruments).map((instrument) => ({
      ...instrument,
      name: migrateKnownText("instruments", instrument.name),
      manufacturer: migrateKnownText("instruments", instrument.manufacturer),
      model: migrateKnownText("instruments", instrument.model),
      type: migrateKnownText("instruments", instrument.type),
      line: migrateKnownText("instruments", instrument.line),
    })),
    parts: saved.parts.map((part) => ({
      ...part,
      name: migrateKnownText("parts", part.name),
      characteristic: migrateKnownText("parts", part.characteristic),
      unit: migrateKnownText("parts", part.unit),
    })),
    measurements: saved.measurements.map((measurement) => ({
      ...measurement,
      characteristic: migrateKnownText("measurements", measurement.characteristic),
      operator: migrateKnownText("measurements", measurement.operator),
      unit: migrateKnownText("measurements", measurement.unit),
    })),
    events: migratedEvents,
    users: (Array.isArray(saved.users) ? saved.users : defaults.users).map((user) => ({
      ...user,
      name: migrateKnownText("users", user.name),
      role: legacyRoles[String(user.role)] ?? user.role,
    })),
    settings: {
      ...defaults.settings,
      ...savedSettings,
      plantName: migrateKnownText("settings", savedSettings.plantName),
      productionLine: migrateKnownText("settings", savedSettings.productionLine),
    },
  } as DemoData;
}

export function calculateStatistics(values: number[]) {
  if (!values.length) return null;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const sorted = [...values].sort((left, right) => left - right);
  const variance =
    values.length > 1
      ? values.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
        (values.length - 1)
      : 0;
  const standardDeviation = Math.sqrt(variance);
  return {
    count: values.length,
    mean,
    median:
      values.length % 2
        ? sorted[Math.floor(values.length / 2)]
        : (sorted[values.length / 2 - 1] + sorted[values.length / 2]) / 2,
    minimum: sorted[0],
    maximum: sorted[sorted.length - 1],
    range: sorted[sorted.length - 1] - sorted[0],
    standardDeviation,
  };
}

export function downloadCsv(filename: string, rows: Record<string, string | number | null>[]) {
  if (!rows.length) return false;
  const headers = Object.keys(rows[0]);
  const quote = (value: unknown) =>
    `"${String(value ?? "").replaceAll('"', '""')}"`;
  const csv = [
    headers.map(quote).join(","),
    ...rows.map((row) => headers.map((header) => quote(row[header])).join(",")),
  ].join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
  return true;
}
