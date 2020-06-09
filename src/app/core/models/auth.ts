export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  userId?: string;
  firstName: string;
  lastName: string;
  telephone: string;
  email: string;
  password: string;
  isFacebook?: boolean;
}

export interface TokenRequest {
  user: User;
}

export interface PrepareLocationRequest {
  houseName: string;
  postcode: string;
}

export interface Address {
  address1: string;
  address2: string;
  postcode: string;
  city: string;
  state: string;
  countryId: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  telephone?: string;
  areaId?: string;
  locationId?: string;
  deliveryAddress?: string;
  stripeCustomerId?: string;
  isFacebook?: boolean;
}
