package com.sgms.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.sgms.dto.response.GradeItemResponse;
import com.sgms.dto.response.SemesterResultResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PdfGenerationService {

    @Value("${app.institution.name:Apex Institute of Science & Technology}")
    private String institutionName;

    @Value("${app.institution.address:Academic Square, Knowledge City}")
    private String institutionAddress;

    public byte[] generateReportCard(SemesterResultResponse result, Double cgpa) {
        Document document = new Document(PageSize.A4, 36, 36, 40, 40);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter writer = PdfWriter.getInstance(document, out);
            document.open();

            // Fonts & Colors
            Color primaryColor = new Color(79, 70, 229);    // #4F46E5 Indigo
            Color darkNavy = new Color(23, 37, 84);        // #172554 Navy
            Color slateGray = new Color(100, 116, 139);    // #64748B Secondary
            Color tableHeaderBg = new Color(241, 245, 249); // Slate-100
            Color borderColor = new Color(226, 232, 240);

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, primaryColor);
            Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA, 10, slateGray);
            Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 13, darkNavy);
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, darkNavy);
            Font regularFont = FontFactory.getFont(FontFactory.HELVETICA, 9, Color.DARK_GRAY);
            Font smallFont = FontFactory.getFont(FontFactory.HELVETICA, 8, slateGray);

            // 1. Institution Header
            Paragraph instName = new Paragraph(institutionName.toUpperCase(), titleFont);
            instName.setAlignment(Element.ALIGN_CENTER);
            document.add(instName);

            Paragraph instAddr = new Paragraph(institutionAddress + "\nOFFICIAL GRADE REPORT / STATEMENT OF MARKS", subtitleFont);
            instAddr.setAlignment(Element.ALIGN_CENTER);
            instAddr.setSpacingAfter(15);
            document.add(instAddr);

            // 2. Student Information Table (2 columns)
            PdfPTable studentTable = new PdfPTable(4);
            studentTable.setWidthPercentage(100);
            studentTable.setWidths(new float[]{18, 32, 18, 32});
            studentTable.setSpacingAfter(15);

            addInfoCell(studentTable, "Student Name:", boldFont, false);
            addInfoCell(studentTable, result.getStudentName(), regularFont, false);
            addInfoCell(studentTable, "Roll Number:", boldFont, false);
            addInfoCell(studentTable, result.getRollNumber(), regularFont, false);

            addInfoCell(studentTable, "Department:", boldFont, false);
            addInfoCell(studentTable, result.getDepartmentName(), regularFont, false);
            addInfoCell(studentTable, "Semester:", boldFont, false);
            addInfoCell(studentTable, result.getSemesterName(), regularFont, false);

            addInfoCell(studentTable, "Academic Year:", boldFont, false);
            addInfoCell(studentTable, result.getAcademicYearCode() != null ? result.getAcademicYearCode() : "N/A", regularFont, false);
            addInfoCell(studentTable, "Result Status:", boldFont, false);
            addInfoCell(studentTable, result.getResultStatus(), boldFont, false);

            document.add(studentTable);

            // 3. Marks & Grades Table
            PdfPTable table = new PdfPTable(8);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{12, 34, 9, 9, 9, 9, 9, 9});
            table.setSpacingBefore(10);
            table.setSpacingAfter(15);

            // Headers
            String[] headers = {"Code", "Subject Name", "Credits", "Internal (50)", "External (50)", "Total (100)", "Grade", "Points"};
            for (String h : headers) {
                PdfPCell headerCell = new PdfPCell(new Phrase(h, boldFont));
                headerCell.setBackgroundColor(tableHeaderBg);
                headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                headerCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                headerCell.setPadding(6);
                headerCell.setBorderColor(borderColor);
                table.addCell(headerCell);
            }

            // Subject Rows
            boolean alternate = false;
            for (GradeItemResponse sub : result.getSubjects()) {
                Color rowBg = alternate ? new Color(248, 250, 252) : Color.WHITE;
                alternate = !alternate;

                addCell(table, sub.getSubjectCode(), regularFont, Element.ALIGN_CENTER, rowBg, borderColor);
                addCell(table, sub.getSubjectName(), regularFont, Element.ALIGN_LEFT, rowBg, borderColor);
                addCell(table, String.valueOf(sub.getCredits()), regularFont, Element.ALIGN_CENTER, rowBg, borderColor);

                if (sub.isPublished()) {
                    addCell(table, sub.getInternalMarks() != null ? String.format("%.1f", sub.getInternalMarks()) : "-", regularFont, Element.ALIGN_CENTER, rowBg, borderColor);
                    addCell(table, sub.getExternalMarks() != null ? String.format("%.1f", sub.getExternalMarks()) : "-", regularFont, Element.ALIGN_CENTER, rowBg, borderColor);
                    addCell(table, sub.getTotalMarks() != null ? String.format("%.1f", sub.getTotalMarks()) : "-", regularFont, Element.ALIGN_CENTER, rowBg, borderColor);
                    addCell(table, sub.getGrade() != null ? sub.getGrade() : "-", boldFont, Element.ALIGN_CENTER, rowBg, borderColor);
                    addCell(table, sub.getGradePoint() != null ? String.format("%.1f", sub.getGradePoint()) : "-", regularFont, Element.ALIGN_CENTER, rowBg, borderColor);
                } else {
                    PdfPCell pendingCell = new PdfPCell(new Phrase("Pending Publication", smallFont));
                    pendingCell.setColspan(5);
                    pendingCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                    pendingCell.setBackgroundColor(rowBg);
                    pendingCell.setBorderColor(borderColor);
                    pendingCell.setPadding(5);
                    table.addCell(pendingCell);
                }
            }
            document.add(table);

            // 4. Performance Summary Box
            PdfPTable summaryTable = new PdfPTable(4);
            summaryTable.setWidthPercentage(100);
            summaryTable.setWidths(new float[]{25, 25, 25, 25});
            summaryTable.setSpacingAfter(20);

            Color summaryBg = new Color(238, 242, 255); // Indigo-50
            addSummaryBox(summaryTable, "Total Credits", String.valueOf(result.getTotalCredits()), summaryBg, borderColor, boldFont);
            addSummaryBox(summaryTable, "Earned Credits", String.valueOf(result.getEarnedCredits()), summaryBg, borderColor, boldFont);
            addSummaryBox(summaryTable, "Semester GPA (SGPA)", result.getSgpa() != null ? String.format("%.2f", result.getSgpa()) : "N/A", summaryBg, borderColor, boldFont);
            addSummaryBox(summaryTable, "Cumulative GPA (CGPA)", cgpa != null ? String.format("%.2f", cgpa) : "N/A", summaryBg, borderColor, boldFont);

            document.add(summaryTable);

            // 5. Grading Legend & Note
            Paragraph legendTitle = new Paragraph("GRADING SYSTEM & SCALE:", boldFont);
            legendTitle.setSpacingBefore(10);
            document.add(legendTitle);

            Paragraph legend = new Paragraph(
                    "O: 90-100% (10.0) | A+: 80-89% (9.0) | A: 70-79% (8.0) | B+: 60-69% (7.0) | B: 50-59% (6.0) | C: 40-49% (5.0) | F: Below 40% (0.0 / Fail)\n" +
                    "Formula: SGPA = \u2211(Subject Credits \u00d7 Grade Points) / \u2211(Total Semester Credits)\n" +
                    "Note: This document displays officially published academic records managed in the SGMS database.",
                    smallFont
            );
            legend.setSpacingAfter(25);
            document.add(legend);

            // 6. Verification and Footer
            Paragraph footer = new Paragraph("Generated by SGMS Academic Management Portal on " +
                    java.time.LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MMM-yyyy HH:mm:ss")), smallFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF report card: " + e.getMessage(), e);
        }

        return out.toByteArray();
    }

    private void addInfoCell(PdfPTable table, String text, Font font, boolean border) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        if (!border) cell.setBorder(Rectangle.NO_BORDER);
        cell.setPadding(4);
        table.addCell(cell);
    }

    private void addCell(PdfPTable table, String text, Font font, int align, Color bg, Color border) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setHorizontalAlignment(align);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setBackgroundColor(bg);
        cell.setBorderColor(border);
        cell.setPadding(5);
        table.addCell(cell);
    }

    private void addSummaryBox(PdfPTable table, String title, String value, Color bg, Color border, Font font) {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(bg);
        cell.setBorderColor(border);
        cell.setPadding(8);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);

        Paragraph pTitle = new Paragraph(title, new Font(FontFactory.getFont(FontFactory.HELVETICA, 8, new Color(79, 70, 229))));
        pTitle.setAlignment(Element.ALIGN_CENTER);
        Paragraph pVal = new Paragraph(value, font);
        pVal.setAlignment(Element.ALIGN_CENTER);

        cell.addElement(pTitle);
        cell.addElement(pVal);
        table.addCell(cell);
    }
}

