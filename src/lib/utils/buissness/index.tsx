import { BusinessLegalCondition } from '@prisma/client';

export const formatBusinessType = (businessType: BusinessLegalCondition): string => {
    const typeMapping: { [key: string]: string } = {
        SoleProprietorship: "Sole Proprietorship",
        GeneralPartnership: "General Partnership",
        LimitedPartnership: "Limited Partnership",
        PrivateLimitedCompany: "Private Limited Company",
        ShareCompany: "Share Company",
        Cooperative: "Cooperative",
        JointVenture: "Joint Venture",
        GovernmentEnterprise: "Government Enterprise",
        NonProfitOrganization: "Non-Profit Organization",
        ForeignBranch: "Foreign Branch",
        LimitedLiabilityPartnership: "Limited Liability Partnership",
        PublicEnterprise: "Public Enterprise",
        Other: "Other"
    };

    return typeMapping[businessType] || "Unknown Business Type";
}
