export interface EmergencyContact {
  name: string;
  phoneCountry: string;
  phoneNational: string;
  relationship: string;
}

export interface fighterProfile {
  weightKg: number | null;
  heightCm: number | null;
  experience: string;      // 'Beginner' | 'Intermediate' | 'Advanced' | 'Competitive' | custom
  photoDataUrl: string | null;
  gender: string; // 'Male' | 'Female' | 'Other'
};

export interface AdultSignupForm {
  // Your details
  firstName: string;
  lastName: string;
  dateOfBirth: string;   // ISO yyyy-mm-dd
  email: string;
  phone: string;
  phoneCountry: string;
  phoneNational: string;

  // Emergency contact
  emergencyContact: EmergencyContact;

  //fighter profile
  fighterProfile: {
  weightKg: number | null;
  heightCm: number | null;
  experience: string;      // 'Beginner' | 'Intermediate' | 'Advanced' | 'Competitive' | custom
  photoDataUrl: string | null;
  gender: string; // 'Male' | 'Female' | 'Other'
};

  // Consents
  consents: {
    liability: boolean;
    medical: boolean;
    photoMedia: boolean;
    dataProcessing: boolean;
  };

  // Plan
  planId: string | null;
}

export const emptyAdultSignupForm = (): AdultSignupForm => ({
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  email: '',
  phone: '',
  phoneCountry: 'ZA',
  phoneNational: '',
  emergencyContact: {
    name: '',
    phoneCountry: 'ZA',
    phoneNational: '',
    relationship: '',
  },
  fighterProfile: {
  weightKg: null,
  heightCm: null,
  experience: '',
  photoDataUrl: null,
  gender: ''
},
  consents: {
    liability: false,
    medical: false,
    photoMedia: false,
    dataProcessing: false,
  },
  planId: null,
});

