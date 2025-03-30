export interface IClient {
    id: number;
    name: string;
    email: string;
    cpf: string;
    phone: string;
    cep?: string;          
    street?: string;     
    number?: string;       
    district?: string;     
    city?: string;       
    state?: string;        
}
