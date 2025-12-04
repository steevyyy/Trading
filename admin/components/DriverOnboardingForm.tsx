
import React, { useState } from 'react';
import { User, Phone, Mail, Car, FileText, Upload, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../lib/api';

interface DriverFormData {
  fullName: string;
  email: string;
  phone: string;
  idNumber: string;
  licenseNumber: string;
  vehicleType: string;
  vehiclePlate: string;
  vehicleModel: string;
  vehicleYear: string;
  insuranceNumber: string;
  bankAccount: string;
  bankName: string;
  emergencyContact: string;
  emergencyPhone: string;
}

export const DriverOnboardingForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<DriverFormData>({
    fullName: '',
    email: '',
    phone: '',
    idNumber: '',
    licenseNumber: '',
    vehicleType: 'boda',
    vehiclePlate: '',
    vehicleModel: '',
    vehicleYear: '',
    insuranceNumber: '',
    bankAccount: '',
    bankName: '',
    emergencyContact: '',
    emergencyPhone: '',
  });

  const [documents, setDocuments] = useState({
    idPhoto: null as File | null,
    licensePhoto: null as File | null,
    vehiclePhoto: null as File | null,
    insuranceDoc: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, docType: keyof typeof documents) => {
    if (e.target.files && e.target.files[0]) {
      setDocuments({ ...documents, [docType]: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      await api.createDriver(formData);
      toast.success('Application submitted successfully! We will review and contact you within 24-48 hours.');

      // Reset form
      setStep(1);
      setFormData({
        fullName: '', email: '', phone: '', idNumber: '', licenseNumber: '',
        vehicleType: 'boda', vehiclePlate: '', vehicleModel: '', vehicleYear: '',
        insuranceNumber: '', bankAccount: '', bankName: '', emergencyContact: '', emergencyPhone: '',
      });
      setDocuments({ idPhoto: null, licensePhoto: null, vehiclePhoto: null, insuranceDoc: null });
    } catch (error) {
      toast.error('Failed to submit application');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= s ? 'bg-sky-500 text-white' : 'bg-neutral-200 text-neutral-500'
              }`}>
                {step > s ? <CheckCircle className="w-6 h-6" /> : s}
              </div>
              {s < 4 && <div className={`w-16 sm:w-24 h-1 ${step > s ? 'bg-sky-500' : 'bg-neutral-200'}`} />}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs sm:text-sm text-neutral-600">
          <span>Personal</span>
          <span>License</span>
          <span>Vehicle</span>
          <span>Documents</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Personal Information */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-neutral-800 mb-4">Personal Information</h2>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  placeholder="John Kamau"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-neutral-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-neutral-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                    placeholder="+254712345678"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">National ID Number *</label>
              <input
                type="text"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                placeholder="12345678"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Emergency Contact Name *</label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  placeholder="Jane Kamau"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Emergency Phone *</label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  placeholder="+254712345679"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: License Information */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-neutral-800 mb-4">Driver's License</h2>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">License Number *</label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                placeholder="DL123456"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Bank Name *</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  placeholder="Equity Bank"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Account Number *</label>
                <input
                  type="text"
                  name="bankAccount"
                  value={formData.bankAccount}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  placeholder="1234567890"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Vehicle Information */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-neutral-800 mb-4">Vehicle Information</h2>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">Vehicle Type *</label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              >
                <option value="boda">Boda Boda (Motorcycle)</option>
                <option value="car">Car (Sedan/Hatchback)</option>
                <option value="van">Van (7-14 seats)</option>
                <option value="bus">Bus (30+ seats)</option>
              </select>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Vehicle Plate *</label>
                <input
                  type="text"
                  name="vehiclePlate"
                  value={formData.vehiclePlate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  placeholder="KCA 123A"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Vehicle Model *</label>
                <input
                  type="text"
                  name="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  placeholder="Toyota Corolla"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Year *</label>
                <input
                  type="text"
                  name="vehicleYear"
                  value={formData.vehicleYear}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  placeholder="2020"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Insurance Number *</label>
                <input
                  type="text"
                  name="insuranceNumber"
                  value={formData.insuranceNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  placeholder="INS123456"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Documents Upload */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-neutral-800 mb-4">Upload Documents</h2>

            {[
              { key: 'idPhoto', label: 'National ID Photo', icon: FileText },
              { key: 'licensePhoto', label: 'Driver License Photo', icon: FileText },
              { key: 'vehiclePhoto', label: 'Vehicle Photo', icon: Car },
              { key: 'insuranceDoc', label: 'Insurance Certificate', icon: FileText },
            ].map(({ key, label, icon: Icon }) => (
              <div key={key} className="border-2 border-dashed border-neutral-300 rounded-lg p-4 hover:border-sky-500 transition-colors">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6 text-neutral-400" />
                    <div>
                      <p className="font-semibold text-neutral-800">{label}</p>
                      <p className="text-sm text-neutral-500">
                        {documents[key as keyof typeof documents]?.name || 'Click to upload'}
                      </p>
                    </div>
                  </div>
                  <Upload className="w-5 h-5 text-sky-500" />
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange(e, key as keyof typeof documents)}
                    className="hidden"
                  />
                </label>
              </div>
            ))}

            <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 mt-6">
              <p className="text-sm text-neutral-700">
                <strong>Note:</strong> All documents will be verified within 24-48 hours. You'll receive an email once approved.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 border-2 border-neutral-300 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Previous
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="ml-auto px-6 py-3 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="ml-auto px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-lg hover:from-sky-600 hover:to-blue-700 transition-all"
            >
              Submit Application
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
