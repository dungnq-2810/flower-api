export interface IContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ILoginForm {
  email: string;
  password: string;
}

export interface IRegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  acceptTerms: boolean;
}

export interface ICheckoutForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  notes: string;
}