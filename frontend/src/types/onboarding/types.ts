/**
 * @file        types.ts
 * @description Single shared form shape for the adult and minor signup
 *              wizards. The `mode` field drives every conditional field
 *              in the shared step components.
 * @author      Morwetsana Mahlatsepule
 * @created     2026-09-22
 * @updated     2026-09-23
 * @version     1.1.0
 *
 * CHANGELOG:
 *   1.0.0  2026-09-22  Initial unified form shape
 *   1.1.0  2026-09-23  Removed legacy AdultSignupForm; added
 *                      emergencyContact.sameAsPrimary flag for minors
 */

export type Mode = 'adult' | 'minor';

export interface Person {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phoneCountry: string;
  phoneNational: string;
}

export interface EmergencyContact {
  /** Minor-only: when true, the guardian auto-fills and locks these fields. */
  sameAsPrimary: boolean;
  name: string;
  phoneCountry: string;
  phoneNational: string;
  relationship: string;
}

export interface MedicalAid {
  scheme: string;
  membershipNumber: string;
  mainMemberName: string;
  mainMemberRelationship: string;
  conditions: string;
  allergies: string;
  medications: string;
}

export interface Guardian {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phoneCountry: string;
  phoneNational: string;
  relationship: string;
}

export interface Guardian2 extends Omit<Guardian, 'relationship'> {
  enabled: boolean;
  relationship: string;
}

export interface AuthorisedCollector {
  name: string;
  phoneCountry: string;
  phoneNational: string;
  relationship: string;
}

export interface FighterProfile {
  weightKg: number | null;
  heightCm: number | null;
  experience: string;
  photoDataUrl: string | null;
  gender: string;
}

export interface Consents {
  // Always present
  liability: boolean;
  medical: boolean;
  photoMedia: boolean;
  dataProcessing: boolean;
  // Minor-only (default false for adults)
  guardianAuthority: boolean;
  emergencyTreatment: boolean;
  sparring: boolean;
  popiaSpecial: boolean;
  photoMediaInternal: boolean;
  photoMediaPromotional: boolean;
}

export interface Payment {
  method: 'card' | 'eft' | '';
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardHolder: string;
  eftAcknowledged: boolean;
}

export interface OnboardingForm {
  mode: Mode;
  subject: Person;
  guardian: Guardian;          // minor
  guardian2: Guardian2;        // minor
  school: {                    // minor
    name: string;
    grade: string;
    phoneCountry: string;
    phoneNational: string;
  };
  emergencyContact: EmergencyContact;
  medicalAid: MedicalAid;
  fighterProfile: FighterProfile;
  consents: Consents;
  authorisedCollectors: AuthorisedCollector[]; // minor
  planId: string | null;
  payment: Payment;
}

export const emptyForm = (mode: Mode): OnboardingForm => ({
  mode,
  subject: {
    firstName: '', lastName: '', dateOfBirth: '', gender: '',
    email: '', phoneCountry: 'ZA', phoneNational: '',
  },
  guardian: {
    firstName: '', lastName: '', dateOfBirth: '', email: '',
    phoneCountry: 'ZA', phoneNational: '', relationship: '',
  },
  guardian2: {
    enabled: false,
    firstName: '', lastName: '', dateOfBirth: '', email: '',
    phoneCountry: 'ZA', phoneNational: '', relationship: '',
  },
  school: { name: '', grade: '', phoneCountry: 'ZA', phoneNational: '' },
  emergencyContact: {
    sameAsPrimary: false,
    name: '', phoneCountry: 'ZA', phoneNational: '', relationship: '',
  },
  medicalAid: {
    scheme: '', membershipNumber: '', mainMemberName: '',
    mainMemberRelationship: '', conditions: '', allergies: '', medications: '',
  },
  fighterProfile: {
    weightKg: null, heightCm: null, gender: '', experience: '', photoDataUrl: null,
  },
  consents: {
    liability: false, medical: false, photoMedia: false, dataProcessing: false,
    guardianAuthority: false, emergencyTreatment: false, sparring: false,
    popiaSpecial: false, photoMediaInternal: false, photoMediaPromotional: false,
  },
  authorisedCollectors: [],
  planId: null,
  payment: {
    method: '', cardNumber: '', cardExpiry: '', cardCvc: '',
    cardHolder: '', eftAcknowledged: false,
  },
});