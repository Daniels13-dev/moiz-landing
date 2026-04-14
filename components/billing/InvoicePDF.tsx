"use client";

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const MOIZ_GREEN = "#6a8e2a";
const MOIZ_DARK = "#2a2a2a";
const MOIZ_GRAY = "#6B7280";
const MOIZ_LIGHT_BG = "#FAF9F6";

const styles = StyleSheet.create({
  page: {
    paddingBottom: 100,
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
  },
  accentBar: {
    height: 8,
    backgroundColor: MOIZ_GREEN,
    width: "100%",
  },
  container: {
    padding: 40,
    paddingBottom: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 40,
  },
  brandSection: {
    flexDirection: "column",
  },
  brandName: {
    fontSize: 28,
    fontWeight: "bold",
    color: MOIZ_GREEN,
    letterSpacing: -1,
  },
  brandDetails: {
    fontSize: 9,
    color: MOIZ_GRAY,
    marginTop: 4,
    lineHeight: 1.4,
  },
  invoiceBadgeSection: {
    alignItems: "flex-end",
  },
  invoiceLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: MOIZ_GRAY,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  invoiceNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: MOIZ_DARK,
  },
  statusBadge: {
    marginTop: 8,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 9,
    color: "#059669",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  infoGrid: {
    flexDirection: "row",
    marginBottom: 40,
    gap: 30,
  },
  infoBox: {
    flex: 1,
    backgroundColor: MOIZ_LIGHT_BG,
    padding: 15,
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: MOIZ_GREEN,
    textTransform: "uppercase",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 4,
  },
  infoText: {
    fontSize: 10,
    color: MOIZ_DARK,
    lineHeight: 1.5,
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: MOIZ_GREEN,
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableHeaderText: {
    fontSize: 9,
    fontWeight: "bold",
    color: MOIZ_GRAY,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  colProd: { flex: 2.5 },
  colQty: { flex: 0.5, textAlign: "center" },
  colPrice: { flex: 1, textAlign: "right" },
  colTotal: { flex: 1, textAlign: "right" },
  cellText: { fontSize: 10, color: MOIZ_DARK },
  cellTextBold: { fontSize: 10, fontWeight: "bold", color: MOIZ_DARK },
  footerSection: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  notesArea: {
    width: "55%",
  },
  totalsArea: {
    width: "35%",
  },
  totalLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  grandTotalLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: MOIZ_GREEN,
  },
  totalLabel: { fontSize: 10, color: MOIZ_GRAY },
  totalValue: { fontSize: 10, color: MOIZ_DARK, fontWeight: "bold" },
  grandTotalLabel: { fontSize: 12, fontWeight: "bold", color: MOIZ_DARK },
  grandTotalValue: { fontSize: 16, fontWeight: "bold", color: MOIZ_GREEN },
  legalFooter: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  thanksText: {
    fontSize: 12,
    fontWeight: "bold",
    color: MOIZ_GREEN,
    marginBottom: 5,
  },
  footerDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginBottom: 15,
  },
  contactText: {
    fontSize: 8,
    color: MOIZ_GRAY,
    lineHeight: 1.5,
  },
});

export default function InvoicePDF({ invoice, order }: { invoice: any; order: any }) {
  const displayInvoiceId = `FMZ-${invoice.invoiceNumber}`;
  const displayOrderId = `MZ-${order.orderNumber}`;
  const date = new Date(invoice.createdAt).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document title={`Factura ${displayInvoiceId}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.accentBar} />

        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.brandSection}>
              <Text style={styles.brandName}>Möiz Pets</Text>
              <Text style={styles.brandDetails}>NIT: 123.456.789-0</Text>
              <Text style={styles.brandDetails}>contacto@moizpets.com</Text>
              <Text style={styles.brandDetails}>Manizales, Colombia</Text>
            </View>

            <View style={styles.invoiceBadgeSection}>
              <Text style={styles.invoiceLabel}>Factura de Venta</Text>
              <Text style={styles.invoiceNumber}>{displayInvoiceId}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Pagado</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Cliente</Text>
              <Text style={styles.cellTextBold}>{invoice.customerName}</Text>
              <Text style={styles.infoText}>
                {invoice.customerIdType}: {invoice.customerNit}
              </Text>
              <Text style={styles.infoText}>{invoice.customerAddress}</Text>
              <Text style={styles.infoText}>
                {invoice.customerCity}, {invoice.customerState}
              </Text>
              <Text style={styles.infoText}>{invoice.customerPhone}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Detalles del Documento</Text>
              <Text style={styles.infoText}>Fecha: {date}</Text>
              <Text style={styles.infoText}>Número de Pedido: {displayOrderId}</Text>
              <Text style={styles.infoText}>Forma de Pago: Electrónico / Efectivo</Text>
              <Text style={styles.infoText}>Moneda: COP</Text>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.colProd]}>Descripción del Producto</Text>
              <Text style={[styles.tableHeaderText, styles.colQty]}>Cant.</Text>
              <Text style={[styles.tableHeaderText, styles.colPrice]}>V. Unitario</Text>
              <Text style={[styles.tableHeaderText, styles.colTotal]}>V. Total</Text>
            </View>

            {order.items.map((item: any, i: number) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.cellText, styles.colProd]}>{item.productName}</Text>
                <Text style={[styles.cellText, styles.colQty]}>{item.quantity}</Text>
                <Text style={[styles.cellText, styles.colPrice]}>
                  $ {item.price.toLocaleString("es-CO")}
                </Text>
                <Text style={[styles.cellTextBold, styles.colTotal]}>
                  $ {(item.price * item.quantity).toLocaleString("es-CO")}
                </Text>
              </View>
            ))}
          </View>

          <View style={[styles.footerSection, { justifyContent: "flex-end" }]}>
            <View style={styles.totalsArea}>
              <View style={styles.totalLine}>
                <Text style={styles.totalLabel}>Subtotal</Text>
                <Text style={styles.totalValue}>$ {invoice.subtotal.toLocaleString("es-CO")}</Text>
              </View>
              <View style={styles.totalLine}>
                <Text style={styles.totalLabel}>Descuento</Text>
                <Text style={styles.totalValue}>
                  $ {(invoice.discount || 0).toLocaleString("es-CO")}
                </Text>
              </View>
              <View style={styles.grandTotalLine}>
                <Text style={styles.grandTotalLabel}>TOTAL</Text>
                <Text style={styles.grandTotalValue}>
                  $ {invoice.total.toLocaleString("es-CO")}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.legalFooter} fixed>
          <View style={styles.footerDivider} />
          <Text style={styles.thanksText}>¡Gracias por tu compra!</Text>
          <Text style={styles.contactText}>
            www.moizpets.com | Manizales, Colombia | WhatsApp: +57 321 8515161
          </Text>
          <Text style={[styles.contactText, { marginTop: 4, fontSize: 7 }]}>
            Generado electrónicamente por Möiz
          </Text>
        </View>
      </Page>
    </Document>
  );
}
