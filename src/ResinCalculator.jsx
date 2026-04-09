import { useState, useCallback } from "react";

const defaultResinSettings = {
  resinPricePerBottle: 18.99,
  resinBottleSize: 1000,
  resinUsed: 50,
  printerWattage: 144,
  printTimeHours: 4,
  washCureWattage: 40,
  washCureMinutes: 20,
  electricityPrice: 0.25,
  fepPrice: 6,
  fepLifePrints: 40,
  filterPrice: 50,
  filterLifePrints: 100,
  ipaPrice: 15,
  ipaLifePrints: 50,
  glovesPrice: 5,
  glovesLifePrints: 100,
  printerPrice: 400,
  printerLifeHours: 2000,
  laborMinutes: 15,
  hourlyRate: 20,
  profitMargin: 30,
  platformFee: 0,
};

const defaultPlaSettings = {
  filamentPricePerSpool: 22,
  filamentSpoolSize: 1000,
  filamentUsed: 80,
  printerWattage: 220,
  printTimeHours: 3,
  electricityPrice: 0.25,
  buildPlatePrice: 25,
  buildPlateLifePrints: 200,
  nozzlePrice: 8,
  nozzleLifePrints: 300,
  printerPrice: 750,
  printerLifeHours: 3000,
  laborMinutes: 10,
  hourlyRate: 20,
  profitMargin: 30,
  platformFee: 0,
};

const sectionStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "6px",
  padding: "16px",
  marginBottom: "12px",
};

const labelStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "8px",
  fontSize: "13px",
  color: "#b0b8c1",
};

const inputStyle = {
  width: "90px",
  background: "#1a1f2b",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "4px",
  color: "#e8ecf1",
  padding: "5px 8px",
  fontSize: "13px",
  textAlign: "right",
  outline: "none",
};

const sectionTitleStyle = {
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "1.5px",
  color: "#f59e0b",
  fontWeight: 700,
  marginBottom: "12px",
  fontFamily: "'JetBrains Mono', monospace",
};

function InputRow({ label, unit, value, onChange, step = 1 }) {
  return (
    <div style={labelStyle}>
      <span>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          style={inputStyle}
          step={step}
          min={0}
        />
        <span style={{ fontSize: "11px", color: "#6b7280", width: "36px" }}>
          {unit}
        </span>
      </div>
    </div>
  );
}

function CostLine({ label, amount, highlight }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "5px 0",
        fontSize: highlight ? "15px" : "13px",
        fontWeight: highlight ? 700 : 400,
        color: highlight ? "#f59e0b" : "#c9cfd6",
        borderTop: highlight ? "1px solid rgba(255,255,255,0.08)" : "none",
        marginTop: highlight ? "6px" : 0,
        paddingTop: highlight ? "10px" : "5px",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      <span>{label}</span>
      <span>€ {amount.toFixed(2)}</span>
    </div>
  );
}

function ResinTab({ s, upd, collapsed, toggle }) {
  const resinCost = (s.resinUsed / s.resinBottleSize) * s.resinPricePerBottle;
  const printElectricity = (s.printerWattage / 1000) * s.printTimeHours * s.electricityPrice;
  const washCureElectricity = (s.washCureWattage / 1000) * (s.washCureMinutes / 60) * s.electricityPrice;
  const electricityCost = printElectricity + washCureElectricity;
  const fepCost = s.fepPrice / s.fepLifePrints;
  const filterCost = s.filterPrice / s.filterLifePrints;
  const ipaCost = s.ipaPrice / s.ipaLifePrints;
  const glovesCost = s.glovesPrice / s.glovesLifePrints;
  const consumablesCost = fepCost + filterCost + ipaCost + glovesCost;
  const depreciationCost = s.printerLifeHours > 0 ? (s.printerPrice / s.printerLifeHours) * s.printTimeHours : 0;
  const laborCost = (s.laborMinutes / 60) * s.hourlyRate;
  const subtotal = resinCost + electricityCost + consumablesCost + depreciationCost + laborCost;
  const margin = subtotal * (s.profitMargin / 100);
  const platformAmount = (subtotal + margin) * (s.platformFee / 100);
  const totalPrice = subtotal + margin + platformAmount;

  const SectionHeader = ({ id, title, icon }) => (
    <div
      onClick={() => toggle(id)}
      style={{ ...sectionTitleStyle, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", userSelect: "none" }}
    >
      <span>{icon} {title}</span>
      <span style={{ fontSize: "10px", color: "#6b7280", transform: collapsed[id] ? "rotate(0deg)" : "rotate(180deg)", transition: "transform 0.2s" }}>▼</span>
    </div>
  );

  return (
    <>
      <div style={{ background: "linear-gradient(135deg, #1c1f2e 0%, #1a1d2a 100%)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "8px", padding: "18px", marginBottom: "20px", boxShadow: "0 0 30px rgba(245,158,11,0.04)" }}>
        <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "'JetBrains Mono', monospace" }}>Verkoopprijs</div>
        <div style={{ fontSize: "36px", fontWeight: 700, color: "#f59e0b", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-1px" }}>€ {totalPrice.toFixed(2)}</div>
        <div style={{ marginTop: "14px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }}>
          <CostLine label="Resin" amount={resinCost} />
          <CostLine label="Stroom" amount={electricityCost} />
          <CostLine label="Verbruiksartikelen" amount={consumablesCost} />
          <CostLine label="Afschrijving" amount={depreciationCost} />
          <CostLine label="Arbeid" amount={laborCost} />
          <CostLine label="Kostprijs" amount={subtotal} highlight />
          <CostLine label={`Winstmarge (${s.profitMargin}%)`} amount={margin} />
          {s.platformFee > 0 && <CostLine label={`Platformkosten (${s.platformFee}%)`} amount={platformAmount} />}
        </div>
      </div>

      <div style={sectionStyle}>
        <SectionHeader id="resin" title="RESIN" icon="◆" />
        {!collapsed.resin && (
          <>
            <InputRow label="Prijs per fles" unit="€" value={s.resinPricePerBottle} onChange={upd("resinPricePerBottle")} step={0.5} />
            <InputRow label="Inhoud fles" unit="g" value={s.resinBottleSize} onChange={upd("resinBottleSize")} />
            <InputRow label="Verbruik per print" unit="g" value={s.resinUsed} onChange={upd("resinUsed")} />
          </>
        )}
      </div>

      <div style={sectionStyle}>
        <SectionHeader id="electricity" title="STROOM" icon="⚡" />
        {!collapsed.electricity && (
          <>
            <InputRow label="Printer vermogen" unit="W" value={s.printerWattage} onChange={upd("printerWattage")} />
            <InputRow label="Printtijd" unit="uur" value={s.printTimeHours} onChange={upd("printTimeHours")} step={0.5} />
            <InputRow label="Wash & cure vermogen" unit="W" value={s.washCureWattage} onChange={upd("washCureWattage")} />
            <InputRow label="Wash & cure tijd" unit="min" value={s.washCureMinutes} onChange={upd("washCureMinutes")} />
            <InputRow label="Stroomprijs" unit="€/kWh" value={s.electricityPrice} onChange={upd("electricityPrice")} step={0.01} />
          </>
        )}
      </div>

      <div style={sectionStyle}>
        <SectionHeader id="consumables" title="VERBRUIKSARTIKELEN" icon="◇" />
        {!collapsed.consumables && (
          <>
            <InputRow label="FEP folie prijs" unit="€" value={s.fepPrice} onChange={upd("fepPrice")} />
            <InputRow label="FEP levensduur" unit="prints" value={s.fepLifePrints} onChange={upd("fepLifePrints")} />
            <InputRow label="Filters prijs" unit="€" value={s.filterPrice} onChange={upd("filterPrice")} />
            <InputRow label="Filters levensduur" unit="prints" value={s.filterLifePrints} onChange={upd("filterLifePrints")} />
            <InputRow label="IPA / reiniger prijs" unit="€" value={s.ipaPrice} onChange={upd("ipaPrice")} />
            <InputRow label="IPA levensduur" unit="prints" value={s.ipaLifePrints} onChange={upd("ipaLifePrints")} />
            <InputRow label="Handschoenen prijs" unit="€" value={s.glovesPrice} onChange={upd("glovesPrice")} />
            <InputRow label="Handschoenen levensduur" unit="prints" value={s.glovesLifePrints} onChange={upd("glovesLifePrints")} />
          </>
        )}
      </div>

      <div style={sectionStyle}>
        <SectionHeader id="depreciation" title="AFSCHRIJVING" icon="▣" />
        {!collapsed.depreciation && (
          <>
            <InputRow label="Aanschafprijs printer" unit="€" value={s.printerPrice} onChange={upd("printerPrice")} />
            <InputRow label="Levensduur printer" unit="uur" value={s.printerLifeHours} onChange={upd("printerLifeHours")} />
          </>
        )}
      </div>

      <div style={sectionStyle}>
        <SectionHeader id="labor" title="ARBEID" icon="⚙" />
        {!collapsed.labor && (
          <>
            <InputRow label="Nabewerking per print" unit="min" value={s.laborMinutes} onChange={upd("laborMinutes")} />
            <InputRow label="Uurtarief" unit="€/uur" value={s.hourlyRate} onChange={upd("hourlyRate")} />
          </>
        )}
      </div>

      <div style={sectionStyle}>
        <SectionHeader id="margin" title="MARGE & KOSTEN" icon="◈" />
        {!collapsed.margin && (
          <>
            <InputRow label="Winstmarge" unit="%" value={s.profitMargin} onChange={upd("profitMargin")} />
            <InputRow label="Platformkosten (Etsy etc.)" unit="%" value={s.platformFee} onChange={upd("platformFee")} />
          </>
        )}
      </div>
    </>
  );
}

function PlaTab({ s, upd, collapsed, toggle }) {
  const filamentCost = (s.filamentUsed / s.filamentSpoolSize) * s.filamentPricePerSpool;
  const electricityCost = (s.printerWattage / 1000) * s.printTimeHours * s.electricityPrice;
  const buildPlateCost = s.buildPlatePrice / s.buildPlateLifePrints;
  const nozzleCost = s.nozzlePrice / s.nozzleLifePrints;
  const consumablesCost = buildPlateCost + nozzleCost;
  const depreciationCost = s.printerLifeHours > 0 ? (s.printerPrice / s.printerLifeHours) * s.printTimeHours : 0;
  const laborCost = (s.laborMinutes / 60) * s.hourlyRate;
  const subtotal = filamentCost + electricityCost + consumablesCost + depreciationCost + laborCost;
  const margin = subtotal * (s.profitMargin / 100);
  const platformAmount = (subtotal + margin) * (s.platformFee / 100);
  const totalPrice = subtotal + margin + platformAmount;

  const accentColor = "#22d3ee";

  const SectionHeader = ({ id, title, icon }) => (
    <div
      onClick={() => toggle(id)}
      style={{ ...sectionTitleStyle, color: accentColor, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", userSelect: "none" }}
    >
      <span>{icon} {title}</span>
      <span style={{ fontSize: "10px", color: "#6b7280", transform: collapsed[id] ? "rotate(0deg)" : "rotate(180deg)", transition: "transform 0.2s" }}>▼</span>
    </div>
  );

  return (
    <>
      <div style={{ background: "linear-gradient(135deg, #1c1f2e 0%, #1a1d2a 100%)", border: "1px solid rgba(34,211,238,0.2)", borderRadius: "8px", padding: "18px", marginBottom: "20px", boxShadow: "0 0 30px rgba(34,211,238,0.04)" }}>
        <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "'JetBrains Mono', monospace" }}>Verkoopprijs</div>
        <div style={{ fontSize: "36px", fontWeight: 700, color: accentColor, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-1px" }}>€ {totalPrice.toFixed(2)}</div>
        <div style={{ fontSize: "11px", color: "#4b5563", marginTop: "4px", fontFamily: "'JetBrains Mono', monospace" }}>Bambu Lab P1S · {s.filamentUsed}g filament · {s.printTimeHours}u printtijd</div>
        <div style={{ marginTop: "14px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }}>
          <CostLine label="Filament" amount={filamentCost} />
          <CostLine label="Stroom" amount={electricityCost} />
          <CostLine label="Verbruiksartikelen" amount={consumablesCost} />
          <CostLine label="Afschrijving" amount={depreciationCost} />
          <CostLine label="Arbeid" amount={laborCost} />
          <CostLine label="Kostprijs" amount={subtotal} highlight />
          <CostLine label={`Winstmarge (${s.profitMargin}%)`} amount={margin} />
          {s.platformFee > 0 && <CostLine label={`Platformkosten (${s.platformFee}%)`} amount={platformAmount} />}
        </div>
      </div>

      <div style={sectionStyle}>
        <SectionHeader id="filament" title="FILAMENT (PLA)" icon="◆" />
        {!collapsed.filament && (
          <>
            <InputRow label="Prijs per spool" unit="€" value={s.filamentPricePerSpool} onChange={upd("filamentPricePerSpool")} step={0.5} />
            <InputRow label="Inhoud spool" unit="g" value={s.filamentSpoolSize} onChange={upd("filamentSpoolSize")} />
            <InputRow label="Verbruik per print" unit="g" value={s.filamentUsed} onChange={upd("filamentUsed")} />
          </>
        )}
      </div>

      <div style={sectionStyle}>
        <SectionHeader id="electricity" title="STROOM" icon="⚡" />
        {!collapsed.electricity && (
          <>
            <InputRow label="Printer vermogen (P1S)" unit="W" value={s.printerWattage} onChange={upd("printerWattage")} />
            <InputRow label="Printtijd" unit="uur" value={s.printTimeHours} onChange={upd("printTimeHours")} step={0.5} />
            <InputRow label="Stroomprijs" unit="€/kWh" value={s.electricityPrice} onChange={upd("electricityPrice")} step={0.01} />
          </>
        )}
      </div>

      <div style={sectionStyle}>
        <SectionHeader id="consumables" title="VERBRUIKSARTIKELEN" icon="◇" />
        {!collapsed.consumables && (
          <>
            <InputRow label="Buildplate prijs" unit="€" value={s.buildPlatePrice} onChange={upd("buildPlatePrice")} />
            <InputRow label="Buildplate levensduur" unit="prints" value={s.buildPlateLifePrints} onChange={upd("buildPlateLifePrints")} />
            <InputRow label="Nozzle prijs" unit="€" value={s.nozzlePrice} onChange={upd("nozzlePrice")} />
            <InputRow label="Nozzle levensduur" unit="prints" value={s.nozzleLifePrints} onChange={upd("nozzleLifePrints")} />
          </>
        )}
      </div>

      <div style={sectionStyle}>
        <SectionHeader id="depreciation" title="AFSCHRIJVING" icon="▣" />
        {!collapsed.depreciation && (
          <>
            <InputRow label="Aanschafprijs printer" unit="€" value={s.printerPrice} onChange={upd("printerPrice")} />
            <InputRow label="Levensduur printer" unit="uur" value={s.printerLifeHours} onChange={upd("printerLifeHours")} />
          </>
        )}
      </div>

      <div style={sectionStyle}>
        <SectionHeader id="labor" title="ARBEID" icon="⚙" />
        {!collapsed.labor && (
          <>
            <InputRow label="Nabewerking per print" unit="min" value={s.laborMinutes} onChange={upd("laborMinutes")} />
            <InputRow label="Uurtarief" unit="€/uur" value={s.hourlyRate} onChange={upd("hourlyRate")} />
          </>
        )}
      </div>

      <div style={sectionStyle}>
        <SectionHeader id="margin" title="MARGE & KOSTEN" icon="◈" />
        {!collapsed.margin && (
          <>
            <InputRow label="Winstmarge" unit="%" value={s.profitMargin} onChange={upd("profitMargin")} />
            <InputRow label="Platformkosten (Etsy etc.)" unit="%" value={s.platformFee} onChange={upd("platformFee")} />
          </>
        )}
      </div>
    </>
  );
}

export default function ResinCalculator() {
  const [activeTab, setActiveTab] = useState("resin");

  const [resinSettings, setResinSettings] = useState(defaultResinSettings);
  const [plaSettings, setPlaSettings] = useState(defaultPlaSettings);

  const [resinCollapsed, setResinCollapsed] = useState({ resin: false, electricity: true, consumables: true, depreciation: true, labor: false, margin: false });
  const [plaCollapsed, setPlaCollapsed] = useState({ filament: false, electricity: true, consumables: true, depreciation: true, labor: false, margin: false });

  const resinUpd = useCallback((key) => (val) => setResinSettings((prev) => ({ ...prev, [key]: val })), []);
  const plaUpd = useCallback((key) => (val) => setPlaSettings((prev) => ({ ...prev, [key]: val })), []);

  const toggleResin = (section) => setResinCollapsed((prev) => ({ ...prev, [section]: !prev[section] }));
  const togglePla = (section) => setPlaCollapsed((prev) => ({ ...prev, [section]: !prev[section] }));

  const isResin = activeTab === "resin";
  const accentColor = isResin ? "#f59e0b" : "#22d3ee";

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(145deg, #0f1117 0%, #161922 50%, #111318 100%)", color: "#e8ecf1", fontFamily: "'Inter', 'Segoe UI', sans-serif", padding: "24px 16px" }}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "3px", color: accentColor, fontFamily: "'JetBrains Mono', monospace", marginBottom: "6px", transition: "color 0.2s" }}>
          {isResin ? "Resin Print" : "FDM Print · Bambu Lab P1S"}
        </div>
        <h1 style={{ fontSize: "22px", fontWeight: 700, margin: 0, letterSpacing: "-0.5px" }}>Prijscalculator</h1>
        <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>Bereken je verkoopprijs per print</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "4px" }}>
        {[
          { id: "resin", label: "◆ Resin", color: "#f59e0b" },
          { id: "pla", label: "▲ PLA (FDM)", color: "#22d3ee" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: "9px 12px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 700,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.5px",
              transition: "all 0.2s",
              background: activeTab === tab.id ? "rgba(255,255,255,0.06)" : "transparent",
              color: activeTab === tab.id ? tab.color : "#6b7280",
              borderBottom: activeTab === tab.id ? `2px solid ${tab.color}` : "2px solid transparent",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Calculator content */}
      {isResin ? (
        <ResinTab s={resinSettings} upd={resinUpd} collapsed={resinCollapsed} toggle={toggleResin} />
      ) : (
        <PlaTab s={plaSettings} upd={plaUpd} collapsed={plaCollapsed} toggle={togglePla} />
      )}

      {/* Footer */}
      <div style={{ textAlign: "center", fontSize: "11px", color: "#4b5563", marginTop: "20px", fontFamily: "'JetBrains Mono', monospace" }}>
        Pas de standaardwaarden aan naar jouw situatie
      </div>
    </div>
  );
}
