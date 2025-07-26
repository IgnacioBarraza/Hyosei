export interface Client {
  id: string;
  name: string;
  api_key: string;
  contact_email: string;
  logo_url: string;
  staff?: ClientStaff[];
  created_at: string;
  updated_at: string;
}

export interface ClientStaff {
  id: string;
}
