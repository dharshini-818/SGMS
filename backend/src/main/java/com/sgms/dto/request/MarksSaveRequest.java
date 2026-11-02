package com.sgms.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class MarksSaveRequest {
    @NotNull(message = "Subject ID is required")
    private Long subjectId;

    @NotNull(message = "Academic year ID is required")
    private Long academicYearId;

    private boolean draft = true; // true = draft, false = submitted

    @NotEmpty(message = "Marks list cannot be empty")
    @Valid
    private List<MarksEntryItem> marksList;

    public MarksSaveRequest() {}

    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }

    public Long getAcademicYearId() { return academicYearId; }
    public void setAcademicYearId(Long academicYearId) { this.academicYearId = academicYearId; }

    public boolean isDraft() { return draft; }
    public void setDraft(boolean draft) { this.draft = draft; }

    public List<MarksEntryItem> getMarksList() { return marksList; }
    public void setMarksList(List<MarksEntryItem> marksList) { this.marksList = marksList; }
}

