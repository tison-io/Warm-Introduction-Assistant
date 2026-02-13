import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Invoice } from "../types/invoice";

export const generateInvoicePDF = (invoice: Invoice, profileName: string) => {
    const doc = new jsPDF();
    const img = new Image();
    img.src = '/logo.png';

    const buildPdfContent = (includeLogo: boolean) => {
        if (includeLogo) {
            doc.addImage(img, 'PNG', 14, 10, 40, 12);
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text("Warmly Introduction Assistant", 14, 28);
        } else {
            doc.setFontSize(22);
            doc.setTextColor(79, 70, 229);
            doc.text("Warmly", 14, 20);
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text("Warmly Introduction Assistant", 14, 26);
        }

        doc.setTextColor(0);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`INVOICE: INV-${invoice._id.slice(-6).toUpperCase()}`, 140, 20);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 140, 26);
        doc.text(`Status: ${invoice.status.toUpperCase()}`, 140, 32);

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("BILL TO:", 14, 50);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(profileName, 14, 56);

        autoTable(doc, {
            startY: 65,
            head: [['Description', 'Quantity', 'Price', 'Total']],
            body: [
                [
                    'Warmly Subscription - Lifetime Access', 
                    '1', 
                    `$${(invoice.amount / 100).toFixed(2)}`, 
                    `$${(invoice.amount / 100).toFixed(2)}`
                ],
            ],
            headStyles: { 
                fillColor: [79, 70, 229], 
                fontSize: 10,
                halign: 'left'
            },
            alternateRowStyles: {
                fillColor: [245, 247, 250]
            },
            styles: { fontSize: 9, cellPadding: 5 },
        });

        const finalY = (doc as any).lastAutoTable.finalY || 70;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`Grand Total: $${(invoice.amount / 100).toFixed(2)}`, 140, finalY + 15);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(150);
        const pageHeight = doc.internal.pageSize.height;
        doc.text("Thank you for choosing Warmly. Your support helps us build better connections.", 14, pageHeight - 20);
        doc.text("For billing inquiries, please contact support@warmly.com", 14, pageHeight - 15);
        doc.text("Warmly Inc.", 14, pageHeight - 10);

        doc.save(`Invoice_Warmly_${invoice._id.slice(-6).toUpperCase()}.pdf`);
    };

    img.onload = () => {
        buildPdfContent(true);
    };

    img.onerror = () => {
        console.error("Logo could not be loaded from /logo.png. Generating text-only header.");
        buildPdfContent(false);
    };
};