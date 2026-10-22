package com.truststay.dto;

public class AdminStatsResponse {

    private long totalUsers;
    private long totalProperties;
    private long verifiedProperties;
    private long unverifiedProperties;

    public AdminStatsResponse() {}

    public AdminStatsResponse(long totalUsers, long totalProperties, long verifiedProperties, long unverifiedProperties) {
        this.totalUsers = totalUsers;
        this.totalProperties = totalProperties;
        this.verifiedProperties = verifiedProperties;
        this.unverifiedProperties = unverifiedProperties;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalProperties() {
        return totalProperties;
    }

    public void setTotalProperties(long totalProperties) {
        this.totalProperties = totalProperties;
    }

    public long getVerifiedProperties() {
        return verifiedProperties;
    }

    public void setVerifiedProperties(long verifiedProperties) {
        this.verifiedProperties = verifiedProperties;
    }

    public long getUnverifiedProperties() {
        return unverifiedProperties;
    }

    public void setUnverifiedProperties(long unverifiedProperties) {
        this.unverifiedProperties = unverifiedProperties;
    }
}
