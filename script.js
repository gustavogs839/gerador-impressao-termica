const templates = {
  goiano: {
    type: "classic",
    title: "Empadão",
    subtitle: "Goiano",
    description:
      "Peito de Frango desfiado, Ervilhas, Azeitonas,\nBatata, Linguiça, Queijo e Guariroba",
    footer: "Agradecemos o seu pedido!",
    phone: "",
    orderNumber: "36",
  },
  moda: {
    type: "classic",
    title: "Empadão",
    subtitle: "Moda",
    description:
      "Peito de Frango desfiado, Ervilhas, Azeitonas,\nBatata, Linguiça, Queijo e Palmito",
    footer: "Agradecemos o seu pedido!",
    phone: "",
    orderNumber: "36",
  },
  carneSol: {
    type: "classic",
    title: "Empadão",
    subtitle: "Carne de Sol",
    description:
      "Carne de Sol desfiada, Ervilhas, Azeitonas,\nBatata, Linguiça, Queijo e Palmito",
    footer: "Agradecemos o seu pedido!",
    phone: "",
    orderNumber: "36",
  },
  pedido: {
    type: "order",
    title: "",
    subtitle: "",
    description: "",
    footer: "Agradecemos o seu pedido!",
    phone: "(62) 3573-2354",
    orderNumber: "36",
  },
  branco: {
    type: "custom",
    title: "Seu título aqui",
    subtitle: "Subtítulo opcional",
    description: "Digite aqui o conteúdo personalizado da impressão.",
    footer: "Agradecemos o seu pedido!",
    phone: "",
    orderNumber: "1",
  },
};

const els = {
  template: document.getElementById("template"),
  paperWidth: document.getElementById("paperWidth"),
  title: document.getElementById("title"),
  subtitle: document.getElementById("subtitle"),
  description: document.getElementById("description"),
  footer: document.getElementById("footer"),
  phone: document.getElementById("phone"),
  orderNumber: document.getElementById("orderNumber"),
  printTicket: document.getElementById("printTicket"),
  downloadHtml: document.getElementById("downloadHtml"),
  resetTemplate: document.getElementById("resetTemplate"),
  ticket: document.getElementById("ticket"),
  phoneField: document.querySelector('[data-field="phone"]'),
  orderField: document.querySelector('[data-field="orderNumber"]'),
};

function escapeHtml(value = "") {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function nl2br(value = "") {
  return escapeHtml(value).replace(/\n/g, "<br>");
}

function getCurrentTemplate() {
  return templates[els.template.value];
}

function updateFieldVisibility(templateType) {
  const showOrderNumber = templateType === "order";
  els.orderField.classList.toggle("hidden", !showOrderNumber);
  els.phoneField.classList.toggle("hidden", templateType === "classic");
}

function applyTemplate(templateKey) {
  const template = templates[templateKey];
  els.title.value = template.title;
  els.subtitle.value = template.subtitle;
  els.description.value = template.description;
  els.footer.value = template.footer;
  els.phone.value = template.phone;
  els.orderNumber.value = template.orderNumber;
  updateFieldVisibility(template.type);
  renderTicket();
}

function renderClassic(data) {
  const description = data.description.trim()
    ? nl2br(data.description)
    : "Personalize os ingredientes ou a mensagem aqui.";

  return `
    <div class="classic-header">
      <div class="classic-chip">Pizzaria Doce Mistura</div>
      <h2 class="ticket-title main">${escapeHtml(data.title)}</h2>
      ${data.subtitle ? `<div class="classic-subtitle">${escapeHtml(data.subtitle)}</div>` : ""}
    </div>
    <div class="classic-card">
      <div class="classic-label">Ingredientes do recheio</div>
      <div class="ticket-box classic-box">${description}</div>
    </div>
    ${data.footer ? `<div class="ticket-footer">${escapeHtml(data.footer)}</div>` : ""}
  `;
}

function getOrderBoxClass(orderNumber = "") {
  const digits = String(orderNumber).replace(/\D/g, "");

  if (digits.length >= 4) {
    return "compact";
  }

  if (digits.length === 3) {
    return "medium";
  }

  return "large";
}

function renderOrder(data) {
  const orderClass = getOrderBoxClass(data.orderNumber || "0");

  return `
    <div class="brand-mark">
      <span class="mini">PIZZARIA</span>
      <strong>Doce Mistura</strong>
    </div>
    ${data.subtitle ? `<div class="brand-name">${escapeHtml(data.subtitle)}</div>` : ""}
    ${data.title ? `<div class="order-heading">${escapeHtml(data.title)}</div>` : ""}
    <div class="order-box ${orderClass}">#${escapeHtml(data.orderNumber || "0")}</div>
    ${data.phone ? `<div class="order-contact">${escapeHtml(data.phone)}</div>` : ""}
    ${data.footer ? `<div class="ticket-footer">${escapeHtml(data.footer)}</div>` : ""}
  `;
}

function renderCustom(data) {
  const body = data.description.trim()
    ? data.description
        .split("\n")
        .map((line) => `<p>${escapeHtml(line)}</p>`)
        .join("")
    : `<p>Área livre para personalização.</p>`;

  return `
    <div class="separator">====================</div>
    ${data.title ? `<h2 class="ticket-title main">${escapeHtml(data.title)}</h2>` : ""}
    ${data.subtitle ? `<div class="ticket-title sub">${escapeHtml(data.subtitle)}</div>` : ""}
    <div class="ticket-box custom-body">${body}</div>
    <div class="separator">====================</div>
    ${data.phone ? `<div class="order-contact">${escapeHtml(data.phone)}</div>` : ""}
    ${data.footer ? `<div class="ticket-footer">${escapeHtml(data.footer)}</div>` : ""}
    <div class="cut-marks"><span>.</span><span>.</span><span>.</span></div>
  `;
}

function renderTicket() {
  const template = getCurrentTemplate();
  const data = {
    title: els.title.value,
    subtitle: els.subtitle.value,
    description: els.description.value,
    footer: els.footer.value,
    phone: els.phone.value,
    orderNumber: els.orderNumber.value,
  };

  els.ticket.style.setProperty("--paper-width", `${els.paperWidth.value}mm`);

  if (template.type === "order") {
    els.ticket.innerHTML = renderOrder(data);
  } else if (template.type === "custom") {
    els.ticket.innerHTML = renderCustom(data);
  } else {
    els.ticket.innerHTML = renderClassic(data);
  }

  els.ticket.dataset.template = els.template.value;
}

function downloadCurrentHtml() {
  const printableHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Impressão térmica</title>
  <style>
    body { margin: 0; background: #fff; }
    .ticket { width: ${els.paperWidth.value}mm; margin: 0 auto; padding: 8mm 4mm; color: #000; font-family: Arial, sans-serif; }
    .separator { margin: 3mm 0; text-align: center; font-family: "Courier New", monospace; font-size: 12pt; font-weight: 700; letter-spacing: 1px; opacity: 0.85; }
    .ticket-title { margin: 0; text-align: center; font-family: Georgia, "Times New Roman", serif; font-weight: 900; line-height: 0.95; }
    .ticket-title.main { font-size: 23pt; }
    .ticket-title.sub { margin-top: 2mm; font-size: 28pt; }
    .classic-header { text-align: center; }
    .classic-chip { display: inline-block; margin-bottom: 3mm; padding: 1.6mm 4.5mm; border: 1px solid #111; border-radius: 999px; background: #111; color: #fff; font-size: 8pt; font-weight: 800; letter-spacing: 0.4px; }
    .classic-subtitle { display: inline-block; margin-top: 2mm; padding: 0 0 1mm; border-bottom: 2px solid #111; font-family: Georgia, "Times New Roman", serif; font-size: 20pt; font-weight: 900; }
    .classic-card { margin-top: 4mm; }
    .classic-label { margin-bottom: 2mm; text-align: center; font-size: 8.5pt; font-weight: 800; letter-spacing: 1.3px; text-transform: uppercase; color: #444; }
    .ticket-box { margin: 0; border: 1px solid #111; border-radius: 4mm; padding: 12px 10px; text-align: center; font-size: 11pt; font-weight: 700; line-height: 1.4; }
    .classic-box { background: #fcfcfc; }
    .ticket-footer, .order-contact, .brand-name, .order-heading { text-align: center; font-family: Georgia, "Times New Roman", serif; font-weight: 700; }
    .brand-mark { width: 42mm; margin: 0 auto 4mm; padding: 2mm; border: 1px solid #111; border-radius: 16px; background: #111; color: #fff; text-align: center; font-family: Georgia, "Times New Roman", serif; }
    .brand-mark .mini { display: block; font-size: 7pt; letter-spacing: 0.8px; }
    .brand-mark strong { font-size: 13pt; font-style: italic; }
    .order-heading { margin: 0 0 3mm; font-size: 24pt; font-weight: 900; }
    .order-box { display: flex; align-items: center; justify-content: center; width: 92%; max-width: 66mm; aspect-ratio: 1 / 1; margin: 2mm auto 5mm; padding: 0; border: 1px solid #111; font-weight: 900; letter-spacing: -1px; line-height: 0.82; }
    .order-box.large { font-size: 90pt; }
    .order-box.medium { font-size: 78pt; }
    .order-box.compact { font-size: 64pt; }
    .cut-marks { display: flex; justify-content: space-between; padding: 4mm 8mm 0; font-size: 16px; line-height: 1; }
    .custom-body p { margin: 0 0 6px; }
    @page { size: ${els.paperWidth.value}mm auto; margin: 3mm; }
  </style>
</head>
<body>
  ${els.ticket.outerHTML}
</body>
</html>`;

  const blob = new Blob([printableHtml], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  link.href = url;
  link.download = `modelo-${els.template.value}-${timestamp}.html`;
  link.click();
  URL.revokeObjectURL(url);
}

els.template.addEventListener("change", (event) => {
  applyTemplate(event.target.value);
});

[
  els.paperWidth,
  els.title,
  els.subtitle,
  els.description,
  els.footer,
  els.phone,
  els.orderNumber,
].forEach((field) => {
  field.addEventListener("input", renderTicket);
  field.addEventListener("change", renderTicket);
});

els.resetTemplate.addEventListener("click", () => {
  applyTemplate(els.template.value);
});

els.printTicket.addEventListener("click", () => {
  window.print();
});

els.downloadHtml.addEventListener("click", downloadCurrentHtml);

applyTemplate("goiano");
