export interface Mailbody {
    payload: Payload;
}

export interface Payload {
    number:               number;
    title:                string;
    email:                string;
    name:                 null;
    first_name:           null;
    last_name:            null;
    company:              null;
    summary:              string;
    body:                 null;
    data:                 Data;
    created_at:           Date;
    human_fields:         HumanFields;
    ordered_human_fields: OrderedHumanField[];
    id:                   string;
    form_id:              string;
    site_url:             string;
    form_name:            string;
}

export interface Data {
    customer_prename: string;
    customer_surname: string;
    email_address:    string;
    ip:               string;
    user_agent:       string;
    referrer:         string;
}

export interface HumanFields {
    "Customer Prename": string;
    "Customer Surname": string;
    "Email Address":    string;
}

export interface OrderedHumanField {
    title: string;
    name:  string;
    value: string;
}
