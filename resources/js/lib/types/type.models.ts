export type DocumentType = 'DNI' | 'RUC' | 'CE' | 'PASAPORTE';

export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type ActionResult = {
    success: boolean;
    error?: string;
};

export type SellerRequestInput = {
    businessName: string;
    businessType: string;
    address: string;
    phone: string;
    taxIdType: DocumentType;
    taxIdNumber: string;
    experience: string;
    message: string;
};

export type UpdateProfileInput = {
    name: string;
    lastName: string;
    phone: string;
    documentType: DocumentType;
    documentNumber: string;
};
