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
    website: "",
    orderNumber: "36",
  },
  divulgacao: {
    type: "promo",
    title: "Doce Mistura",
    subtitle: "A melhor pizza da região",
    description: "Peça pelo WhatsApp e visite nosso site para conferir o cardápio.",
    footer: "Acesse nosso site e faça seu pedido!",
    phone: "(62) 3573-2354",
    website: "https://docemisturapizzaria.menudino.com",
    orderNumber: "",
  },
  branco: {
    type: "custom",
    title: "Seu título aqui",
    subtitle: "Subtítulo opcional",
    description: "Digite aqui o conteúdo personalizado da impressão.",
    footer: "Agradecemos o seu pedido!",
    phone: "",
    website: "",
    orderNumber: "1",
  },
  corretor: {
    type: "realtor",
    title: "Gustavo",
    subtitle: "Corretor de Imóveis",
    description:
      "Conheça o Icoon Home Resort no Jardim Europa!\nEscaneie o QR Code e fale comigo agora mesmo no WhatsApp.",
    footer: "Aponte a câmera do celular para o QR Code",
    phone: "62 994589523",
    website:
      "Olá! Escaneei o QR Code do panfleto e gostaria de receber mais informações sobre o Icoon Home Resort no Jardim Europa. Pode me enviar o book digital e a tabela de preços atualizada?",
    orderNumber: "",
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
  website: document.getElementById("website"),
  orderNumber: document.getElementById("orderNumber"),
  printTicket: document.getElementById("printTicket"),
  downloadHtml: document.getElementById("downloadHtml"),
  resetTemplate: document.getElementById("resetTemplate"),
  ticket: document.getElementById("ticket"),
  phoneField: document.querySelector('[data-field="phone"]'),
  websiteField: document.querySelector('[data-field="website"]'),
  websiteLabel: document.querySelector('label[for="website"]'),
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
  const showWebsite = templateType === "promo" || templateType === "realtor";
  els.orderField.classList.toggle("hidden", !showOrderNumber);
  els.phoneField.classList.toggle("hidden", templateType === "classic");
  els.websiteField.classList.toggle("hidden", !showWebsite);
  els.websiteLabel.textContent =
    templateType === "realtor"
      ? "Mensagem do WhatsApp (usada no QR Code)"
      : "Site / URL";
}

function applyTemplate(templateKey) {
  const template = templates[templateKey];
  els.title.value = template.title;
  els.subtitle.value = template.subtitle;
  els.description.value = template.description;
  els.footer.value = template.footer;
  els.phone.value = template.phone;
  els.website.value = template.website || "";
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

function buildWhatsappLink(phone, message) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) {
    return "";
  }
  const withCountryCode = digits.startsWith("55") ? digits : `55${digits}`;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${withCountryCode}${text}`;
}

function renderRealtor(data) {
  const whatsappLink = buildWhatsappLink(data.phone, data.website);
  const qrImage = whatsappLink
    ? `<div class="qr-card"><img class="qr-code" src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
        whatsappLink
      )}&margin=0" alt="QR Code do WhatsApp"></div>`
    : "";

  return `
    <div class="realtor-header">
      ${data.title ? `<div class="realtor-name">${escapeHtml(data.title)}</div>` : ""}
      ${data.subtitle ? `<div class="realtor-role">${escapeHtml(data.subtitle)}</div>` : ""}
    </div>
    <div class="promo-body">
      <div class="promo-text">
        ${data.description ? `<div class="ticket-box promo-description">${nl2br(data.description)}</div>` : ""}
        ${data.phone ? `<div class="order-contact">WhatsApp: ${escapeHtml(data.phone)}</div>` : ""}
      </div>
      ${qrImage}
    </div>
    ${data.footer ? `<div class="ticket-footer">${escapeHtml(data.footer)}</div>` : ""}
  `;
}

function renderPromo(data) {
  const qrImage = data.website
    ? `<div class="qr-card"><img class="qr-code" src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
        data.website
      )}&margin=0" alt="QR Code do site"></div>`
    : "";

  return `
    <div class="promo-header">
      <div class="brand-mark">
        <span class="mini">PIZZARIA</span>
        <strong>DOCE MISTURA</strong>
      </div>
      ${data.subtitle ? `<div class="brand-name">${escapeHtml(data.subtitle)}</div>` : ""}
    </div>
    <div class="promo-body">
      <div class="promo-text">
        ${data.description ? `<div class="ticket-box promo-description">${nl2br(data.description)}</div>` : ""}
        ${data.phone ? `<div class="order-contact">WhatsApp: ${escapeHtml(data.phone)}</div>` : ""}
        ${data.website ? `<div class="order-contact promo-link">Site: ${escapeHtml(data.website)}</div>` : ""}
      </div>
      ${qrImage}
    </div>
    ${data.footer ? `<div class="ticket-footer">${escapeHtml(data.footer)}</div>` : ""}
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
    website: els.website.value,
    orderNumber: els.orderNumber.value,
  };

  els.ticket.style.setProperty("--paper-width", `${els.paperWidth.value}mm`);

  if (template.type === "order") {
    els.ticket.innerHTML = renderOrder(data);
  } else if (template.type === "custom") {
    els.ticket.innerHTML = renderCustom(data);
  } else if (template.type === "promo") {
    els.ticket.innerHTML = renderPromo(data);
  } else if (template.type === "realtor") {
    els.ticket.innerHTML = renderRealtor(data);
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
    .promo-header { margin-bottom: 2mm; }
    .realtor-header { margin-bottom: 3mm; text-align: center; }
    .realtor-name { font-family: Georgia, "Times New Roman", serif; font-size: 22pt; font-weight: 900; }
    .realtor-role { margin-top: 1mm; font-size: 11pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #444; }
    .promo-body { display: flex; flex-wrap: wrap; justify-content: center; gap: 4mm; align-items: flex-start; }
    .promo-text { min-width: 42mm; max-width: 56mm; }
    .qr-card { width: 42mm; padding: 3mm; border: 1px solid #111; border-radius: 8px; display: flex; justify-content: center; align-items: center; background: #fcfcfc; }
    .qr-code { width: 100%; height: auto; display: block; }
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
  els.website,
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
