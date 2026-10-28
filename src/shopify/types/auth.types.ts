export type CustomerInput = {
  acceptsMarketing: boolean;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phone: string;
};

type CustomerErrors = {
  code: string;
  field: string;
  message: string;
};

export type SCustomer = {
  customer: {
    email: string;
    firstName: string;
    id: string;
    lastName: string;
    phone: string;
  };
  customerUserErrors: CustomerErrors[];
};

export type CustomerAccessToken = {
  customerAccessTokenCreate: {
    customerAccessToken: {
      accessToken: string;
      expiresAt: Date | string;
    };
    customerUserErrors: CustomerErrors[];
  };
};

export type SCustomerReset = {
  customerRecover: {
    customerUserErrors: CustomerErrors[];
  }
}

export type SCustomerResetComplete = {
  customerResetByUrl: {
    customerUserErrors: CustomerErrors[];
  }
}
