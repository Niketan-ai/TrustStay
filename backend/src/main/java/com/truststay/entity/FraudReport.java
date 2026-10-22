package com.truststay.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "fraud_reports")
public class FraudReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id")
    private User reporter;

    @Column(name = "report_category", nullable = false, length = 50)
    private String reportCategory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_user_id")
    private User reportedUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_property_id")
    private Property reportedProperty;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_booking_id")
    private Booking reportedBooking;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "evidence_reference", length = 500)
    private String evidenceReference;

    @Column(nullable = false, length = 20)
    private String severity = "MEDIUM";

    @Column(nullable = false, length = 30)
    private String status = "REPORTED";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_reviewer_id")
    private User assignedReviewer;

    @Column(name = "admin_notes", columnDefinition = "TEXT")
    private String adminNotes;

    @Column(name = "resolution_reason", columnDefinition = "TEXT")
    private String resolutionReason;

    @Column(name = "resolved_at")
    private OffsetDateTime resolvedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt = OffsetDateTime.now();

    public FraudReport() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getReporter() { return reporter; }
    public void setReporter(User reporter) { this.reporter = reporter; }
    public String getReportCategory() { return reportCategory; }
    public void setReportCategory(String reportCategory) { this.reportCategory = reportCategory; }
    public User getReportedUser() { return reportedUser; }
    public void setReportedUser(User reportedUser) { this.reportedUser = reportedUser; }
    public Property getReportedProperty() { return reportedProperty; }
    public void setReportedProperty(Property reportedProperty) { this.reportedProperty = reportedProperty; }
    public Booking getReportedBooking() { return reportedBooking; }
    public void setReportedBooking(Booking reportedBooking) { this.reportedBooking = reportedBooking; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getEvidenceReference() { return evidenceReference; }
    public void setEvidenceReference(String evidenceReference) { this.evidenceReference = evidenceReference; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public User getAssignedReviewer() { return assignedReviewer; }
    public void setAssignedReviewer(User assignedReviewer) { this.assignedReviewer = assignedReviewer; }
    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }
    public String getResolutionReason() { return resolutionReason; }
    public void setResolutionReason(String resolutionReason) { this.resolutionReason = resolutionReason; }
    public OffsetDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(OffsetDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
