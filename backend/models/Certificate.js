import mongoose from 'mongoose';

const CertificateSchema = new mongoose.Schema({
    certificateId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    courseName: { type: String, required: true },
    userName: { type: String, required: true },
    issuedAt: { type: Date, default: Date.now },
    completionDate: { type: String, required: true },
    verificationToken: { type: String },
    certificateFileUrl: { type: String },
    status: { type: String, default: 'VALID' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Certificate = mongoose.models.Certificate || mongoose.model('Certificate', CertificateSchema);
export default Certificate;
